import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

// Error handling helper
const handleError = (error, fallbackMessage = 'An error occurred') => {
  console.error(error);
  if (error.response && error.response.data) {
    return error.response.data.error || fallbackMessage;
  }
  return fallbackMessage;
};

// Transcription API
export const transcriptionApi = {
  // Get all transcriptions
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE}/transcriptions`);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: handleError(error, 'Failed to fetch transcriptions') 
      };
    }
  },
  
  // Upload and transcribe file
  upload: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE}/transcribe`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, 'Failed to upload and transcribe file') 
      };
    }
  },
  
  // Search transcriptions
  search: async (query) => {
    try {
      if (!query) {
        return transcriptionApi.getAll();
      }
      
      const response = await axios.get(`${API_BASE}/search?q=${query}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: handleError(error, 'Failed to search transcriptions') 
      };
    }
  }
};

export default transcriptionApi; 