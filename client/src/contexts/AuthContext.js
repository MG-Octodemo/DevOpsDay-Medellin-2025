import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Helper for making authenticated requests
  const authAxios = axios.create();
  
  // Add token to requests if available
  authAxios.interceptors.request.use(
    config => {
      if (token) {
        // Use ****** for JWT token
        config.headers.Authorization = `******;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Sign up function
  async function signup(email, password, displayName) {
    try {
      setError('');
      
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        displayName
      });
      
      const { user, token } = response.data;
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('authToken', token);
      
      return user;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  }

  // Sign in function
  async function signin(email, password) {
    try {
      setError('');
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      const { user, token } = response.data;
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('authToken', token);
      
      return user;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  }

  // Sign out function
  async function logout() {
    try {
      setError('');
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Reset password function
  async function resetPassword(email) {
    try {
      setError('');
      // In a real app, you would have a server endpoint for this
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert(`Password reset email would be sent to ${email} in a real app`);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Update user profile
  async function updateUserProfile(data) {
    try {
      setError('');
      
      const response = await authAxios.put('/api/auth/profile', data);
      const updatedUser = response.data;
      
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedUser
      }));
      
      return updatedUser;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  }

  // Effect for loading user from token on app start
  useEffect(() => {
    async function loadUserFromToken() {
      if (token) {
        try {
          // Configure axios to use the token with ******          axios.defaults.headers.common['Authorization'] = `******;
          
          // Get user profile with the token
          const response = await axios.get('/api/auth/profile');
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Failed to load user from token:', error);
          // If token is invalid or expired, clear it
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      
      setLoading(false);
    }

    loadUserFromToken();
  }, [token]);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    signin,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
