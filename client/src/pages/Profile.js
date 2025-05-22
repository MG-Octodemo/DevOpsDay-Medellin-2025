import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';

function Profile() {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      
      // Fetch user profile details from backend
      const fetchUserProfile = async () => {
        try {
          const authHeader = currentUser.token ? 'Bearer ' + currentUser.token : undefined;
          if (!authHeader) throw new Error('No authentication token found. Please sign in again.');
          const profileResponse = await axios.get('/api/auth/profile', {
            headers: { Authorization: authHeader }
          });
          const userData = profileResponse.data;
          setCompany(userData.company || '');
          setJobTitle(userData.jobTitle || '');
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      // Fetch user registrations
      const fetchRegistrations = async () => {
        try {
          const authHeader = currentUser.token ? 'Bearer ' + currentUser.token : undefined;
          if (!authHeader) throw new Error('No authentication token found. Please sign in again.');
          const registrationsResponse = await axios.get('/api/registration/user', {
            headers: { Authorization: authHeader }
          });
          setRegistrations(registrationsResponse.data);
        } catch (error) {
          console.error('Error fetching registrations:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
      fetchRegistrations();
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      await updateUserProfile({ 
        displayName,
        company,
        jobTitle 
      });
      
      setSuccess('Profile updated successfully.');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelRegistration = async (registrationId, talkId) => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const authHeader = 'Bearer ' + token;
      
      await axios.delete(`/api/registration/${talkId}`, {
        headers: { Authorization: authHeader }
      });
      
      // Remove the cancelled registration from the list
      setRegistrations(registrations.filter(reg => reg._id !== registrationId));
      
      setSuccess('Registration cancelled successfully.');
    } catch (error) {
      setError('Failed to cancel registration: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-6 rounded">
          {success}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Your Information</h2>
        
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label 
              htmlFor="displayName" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="company" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Company
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="jobTitle" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={updating}
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-black px-6 py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Registered Talks</h2>
        
        {registrations.length === 0 ? (
          <p className="text-gray-500">
            You haven't registered for any talks yet. 
            <a href="/calendar" className="text-blue-600 ml-1 hover:underline">
              Browse the schedule
            </a>
          </p>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div 
                key={registration._id} 
                className="border border-gray-200 rounded-md p-4"
              >
                <h3 className="font-semibold">{registration.talk.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(registration.talk.startTime).toLocaleString([], {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Location: {registration.talk.location}
                </p>
                
                <button 
                  onClick={() => handleCancelRegistration(registration._id, registration.talk._id)}
                  className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-black font-semibold shadow-md hover:from-red-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                >
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;