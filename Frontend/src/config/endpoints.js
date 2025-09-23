// API Endpoints Configuration
const BASE_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/login/`,
    VERIFY_OTP: `${BASE_URL}/verify-otp/`,
    LOGOUT: `${BASE_URL}/logout/`,
    REFRESH: `${BASE_URL}/refresh-token/`,
    ME: `${BASE_URL}/me/`,
  },

  // Clinic endpoints
  CLINIC: {
    REGISTER: `${BASE_URL}/register-clinic/`,
  },

};

export default ENDPOINTS;
