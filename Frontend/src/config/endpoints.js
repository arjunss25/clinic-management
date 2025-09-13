// API Endpoints Configuration
const BASE_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/login/`,
    VERIFY_OTP: `${BASE_URL}/verify-otp/`,
    LOGOUT: `${BASE_URL}/logout/`,
    ME: `${BASE_URL}/auth/me/`,
    REFRESH: `${BASE_URL}/refresh-token/`,
  },
  // Doctor endpoints
  DOCTORS: {
    REGISTER: `${BASE_URL}/register-doctor/`,
    GET_ALL: `${BASE_URL}/doctors/`,
    GET_BY_ID: (id) => `${BASE_URL}/doctors/${id}/`,
    UPDATE: (id) => `${BASE_URL}/doctors/${id}/`,
    DELETE: (id) => `${BASE_URL}/doctors/${id}/`,
  },
};

export default ENDPOINTS;
