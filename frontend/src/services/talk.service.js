import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:5000/api/';

// Service for talks related API calls
const TalkService = {
  // Get all talks
  getAllTalks: async () => {
    try {
      const response = await axios.get(API_URL + 'talks');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al obtener las charlas';
    }
  },

  // Get a specific talk
  getTalkById: async (id) => {
    try {
      const response = await axios.get(API_URL + 'talks/' + id);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al obtener la charla';
    }
  },

  // Register user to a talk
  registerToTalk: async (id) => {
    try {
      const response = await axios.post(
        API_URL + 'talks/' + id + '/register',
        {},
        { headers: AuthService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al registrarse a la charla';
    }
  },

  // Get user profile with registered talks
  getUserProfile: async () => {
    try {
      const response = await axios.get(
        API_URL + 'profile',
        { headers: AuthService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al obtener el perfil';
    }
  }
};

export default TalkService;
