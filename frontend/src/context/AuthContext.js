import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile with token
  const fetchUserProfile = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `******'token')}`
        }
      };
      
      const response = await axios.get('/api/users/profile', config);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      setError('Sesión inválida. Por favor inicia sesión nuevamente.');
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user state
      setUser(response.data.user);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar usuario');
      setLoading(false);
      return { success: false, error: error.response?.data?.message || 'Error al registrar usuario' };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', credentials);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user state
      setUser(response.data.user);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      setLoading(false);
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;