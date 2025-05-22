import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Talk API methods
export const getTalks = async () => {
  try {
    const response = await api.get('/talks');
    return response.data;
  } catch (error) {
    console.error('Error fetching talks:', error);
    throw error;
  }
};

export const getTalkById = async (id) => {
  try {
    const response = await api.get(`/talks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching talk with ID ${id}:`, error);
    throw error;
  }
};

// Registration API methods
export const registerForTalk = async (userData) => {
  try {
    const response = await api.post('/registrations', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering for talk:', error);
    throw error;
  }
};

export const getRegistrationsByTalkId = async (talkId) => {
  try {
    const response = await api.get(`/registrations/talk/${talkId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching registrations for talk ID ${talkId}:`, error);
    throw error;
  }
};