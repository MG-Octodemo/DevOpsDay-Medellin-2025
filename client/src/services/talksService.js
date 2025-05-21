import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Get all talks
export const getAllTalks = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/talks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching talks:', error);
    throw error;
  }
};

// Get a single talk by ID
export const getTalkById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/talks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching talk with ID ${id}:`, error);
    throw error;
  }
};

// Register for a talk
export const registerForTalk = async (talkId, token) => {
  try {
    const authHeader = 'Bearer ' + token;
    const response = await axios.post(
      `${API_URL}/api/registration/${talkId}`, 
      {},
      {
        headers: { Authorization: authHeader }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error registering for talk:', error);
    throw error;
  }
};

// Cancel a talk registration
export const cancelRegistration = async (talkId, token) => {
  try {
    const authHeader = 'Bearer ' + token;
    const response = await axios.delete(
      `${API_URL}/api/registration/${talkId}`,
      {
        headers: { Authorization: authHeader }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling registration:', error);
    throw error;
  }
};

// Get user's registrations
export const getUserRegistrations = async (token) => {
  try {
    const authHeader = 'Bearer ' + token;
    const response = await axios.get(
      `${API_URL}/api/registration/user`,
      {
        headers: { Authorization: authHeader }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    throw error;
  }
};

// Parse and fetch agenda from PDF
export const parseAgendaFromPdf = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/talks/parse-pdf`);
    return response.data;
  } catch (error) {
    console.error('Error parsing agenda from PDF:', error);
    throw error;
  }
};
