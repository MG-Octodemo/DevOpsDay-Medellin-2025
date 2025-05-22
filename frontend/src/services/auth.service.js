import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Service for authentication related API calls
const AuthService = {
  // Register a new user
  register: async (username, password) => {
    try {
      const response = await axios.post(API_URL + 'register', {
        username,
        password
      });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error en el registro';
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const response = await axios.post(API_URL + 'login', {
        username,
        password
      });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error en el inicio de sesión';
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Get auth header
  getAuthHeader: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return { 'x-auth-token': user.token };
    } else {
      return {};
    }
  }
};

export default AuthService;
