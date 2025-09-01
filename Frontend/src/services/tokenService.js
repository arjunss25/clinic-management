import api from '../config/axios';
import { ENDPOINTS } from '../config/endpoints';

// Token service for managing authentication with HTTP-only cookies
class TokenService {
  // Check if user is authenticated by making a request to the server
  static async isAuthenticated() {
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Get user info from server
  static async getUserInfo() {
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Refresh token manually
  static async refreshToken() {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REFRESH);
      return {
        success: true,
        data: response.data,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
        error: error.response?.data || error.message
      };
    }
  }

  // Remove tokens (clear any local storage and call logout endpoint)
  static async removeTokens() {
    try {
      // Call logout endpoint to clear cookies on server
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear any local storage as fallback
    localStorage.removeItem('clinic_access_token');
    sessionStorage.removeItem('clinic_refresh_token');
  }

  // Legacy methods for backward compatibility (deprecated)
  static getAccessToken() {
    console.warn('getAccessToken is deprecated. Tokens are now stored as HTTP-only cookies.');
    return null;
  }

  static setAccessToken(token) {
    console.warn('setAccessToken is deprecated. Tokens are now stored as HTTP-only cookies.');
  }

  static getRefreshToken() {
    console.warn('getRefreshToken is deprecated. Tokens are now stored as HTTP-only cookies.');
    return null;
  }

  static setRefreshToken(token) {
    console.warn('setRefreshToken is deprecated. Tokens are now stored as HTTP-only cookies.');
  }

  // Get token expiration time (if token has exp claim) - legacy method
  static getTokenExpiration(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired - legacy method
  static isTokenExpired(token) {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return false;
    return Date.now() >= expiration;
  }

  // Get user info from token (if token has user info) - legacy method
  static getUserFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user || payload.sub || null;
    } catch (error) {
      return null;
    }
  }
}

// Export individual functions for easier imports
export const getAccessToken = () => TokenService.getAccessToken();
export const setAccessToken = (token) => TokenService.setAccessToken(token);
export const getRefreshToken = () => TokenService.getRefreshToken();
export const setRefreshToken = (token) => TokenService.setRefreshToken(token);
export const removeTokens = () => TokenService.removeTokens();
export const isAuthenticated = () => TokenService.isAuthenticated();
export const isTokenExpired = (token) => TokenService.isTokenExpired(token);
export const getUserFromToken = (token) => TokenService.getUserFromToken(token);
export const getUserInfo = () => TokenService.getUserInfo();
export const refreshToken = () => TokenService.refreshToken();

export default TokenService;
