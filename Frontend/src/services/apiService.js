import api from '../config/axios';
import { removeTokens } from './tokenService';

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    // Tokens are now stored as HTTP-only cookies, no need to manually store them
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove any local tokens as fallback
      removeTokens();
    }
  },

};

// Clinic API calls
export const clinicAPI = {
  // Register new clinic
  register: async (clinicData) => {
    const response = await api.post('/register-clinic/', clinicData);
    return response.data;
  },
};

// Export all API services
export default {
  auth: authAPI,
  clinic: clinicAPI,
};
