import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

function TalkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [talk, setTalk] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTalkDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/talks/${id}`);
        setTalk(response.data);
        
        // Check if user is registered for this talk
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            const authHeader = 'Bearer ' + token;
            
            const registrationsResponse = await axios.get('/api/registration/user', {
              headers: { Authorization: authHeader }
            });
            
            const isUserRegistered = registrationsResponse.data.some(
              registration => registration.talk._id === id
            );
            
            setIsRegistered(isUserRegistered);
          } catch (error) {
            console.error('Error checking registration status:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching talk details:', error);
        setError('Failed to load talk details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTalkDetails();
  }, [id, currentUser]);

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/signin', { state: { from: `/talks/${id}` } });
      return;
    }
    
    try {
      setRegistering(true);
      setError('');
      setSuccess('');
      
      const token = await currentUser.getIdToken();
      const authHeader = 'Bearer ' + token;
      
      await axios.post(`/api/registration/${id}`, {}, {
        headers: { Authorization: authHeader }
      });
      
      setIsRegistered(true);
      setSuccess('You have successfully registered for this talk!');
    } catch (error) {
      console.error('Error registering for talk:', error);
      setError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!currentUser) return;
    
    try {
      setRegistering(true);
      setError('');
      setSuccess('');
      
      const token = await currentUser.getIdToken();
      const authHeader = 'Bearer ' + token;
      
      await axios.delete(`/api/registration/${id}`, {
        headers: { Authorization: authHeader }
      });
      
      setIsRegistered(false);
      setSuccess('Your registration has been cancelled.');
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError(error.response?.data?.message || 'Failed to cancel registration. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!talk) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Talk not found</h2>
        <p className="mt-4">The talk you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/calendar')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Return to Calendar
        </button>
      </div>
    );
  }

  // Format date and time
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/calendar')}
        className="mb-6 text-blue-600 hover:underline flex items-center"
      >
        &larr; Back to Calendar
      </button>
      
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
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{talk.title}</h1>
        
        <div className="mb-6">
          <div className="text-gray-600 mb-2">
            <strong>When:</strong> {formatDate(talk.startTime)} - {new Date(talk.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div className="text-gray-600 mb-2">
            <strong>Where:</strong> {talk.location}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{talk.description}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {talk.speakers.map((speaker, index) => (
              <div key={index} className="flex items-start">
                {speaker.photo && (
                  <img 
                    src={speaker.photo} 
                    alt={speaker.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{speaker.name}</h3>
                  {speaker.bio && <p className="text-sm text-gray-600">{speaker.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          {isRegistered ? (
            <button
              onClick={handleCancelRegistration}
              disabled={registering}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {registering ? 'Processing...' : 'Cancel Registration'}
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {registering ? 'Processing...' : 'Register for this Talk'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TalkDetails;
