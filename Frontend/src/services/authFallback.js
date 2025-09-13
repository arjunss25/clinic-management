// Fallback authentication service for when HTTP-only cookies are not working
import api from '../config/axios';
import { ENDPOINTS } from '../config/endpoints';

class AuthFallback {
  // Store tokens in localStorage as fallback
  static setTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem('clinic_access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('clinic_refresh_token', refreshToken);
    }
  }

  // Get tokens from localStorage
  static getTokens() {
    return {
      accessToken: localStorage.getItem('clinic_access_token'),
      refreshToken: localStorage.getItem('clinic_refresh_token')
    };
  }

  // Clear tokens from localStorage
  static clearTokens() {
    localStorage.removeItem('clinic_access_token');
    localStorage.removeItem('clinic_refresh_token');
  }

  // Check if we have tokens
  static hasTokens() {
    const { accessToken, refreshToken } = this.getTokens();
    return !!(accessToken && refreshToken);
  }

  // Login with fallback token storage
  static async login(email, password) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });

      // Check if response contains tokens (fallback for when cookies don't work)
      if (response.data.access_token || response.data.refresh_token) {
        this.setTokens(response.data.access_token, response.data.refresh_token);
      }

      return {
        success: true,
        data: response.data,
        message: 'Login successful. Please check your email for OTP.'
      };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Login service is currently unavailable. Please check if the server is running.',
          error: error.response?.data || error.message
        };
      } else if (error.response?.status === 401) {
        return {
          success: false,
          message: error.response?.data?.message || 'Invalid email or password.',
          error: error.response?.data || error.message
        };
      } else if (error.response?.data?.non_field_errors) {
        return {
          success: false,
          message: Array.isArray(error.response.data.non_field_errors) 
            ? error.response.data.non_field_errors.join(', ')
            : error.response.data.non_field_errors,
          error: error.response?.data || error.message
        };
      } else {
        return {
          success: false,
          message: error.response?.data?.message || error.message || 'Login failed. Please try again.',
          error: error.response?.data || error.message
        };
      }
    }
  }

  // Verify OTP with fallback token storage
  static async verifyOtp(email, otp) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp
      });
      
      if (response.data.status && response.data.data) {
        const { role, user_id, email: userEmail, access_token, refresh_token } = response.data.data;
        
        // Store tokens if provided (fallback for when cookies don't work)
        if (access_token || refresh_token) {
          this.setTokens(access_token, refresh_token);
        }
        
        return {
          success: true,
          data: {
            role,
            user_id,
            email: userEmail
          },
          message: response.data.message || 'OTP verified successfully'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'OTP verification failed'
        };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'OTP verification service is currently unavailable. Please check if the server is running.',
          error: error.response?.data || error.message
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response?.data?.message || 'Invalid OTP. Please try again.',
          error: error.response?.data || error.message
        };
      } else if (error.response?.data?.non_field_errors) {
        return {
          success: false,
          message: Array.isArray(error.response.data.non_field_errors) 
            ? error.response.data.non_field_errors.join(', ')
            : error.response.data.non_field_errors,
          error: error.response?.data || error.message
        };
      } else {
        return {
          success: false,
          message: error.response?.data?.message || error.message || 'OTP verification failed. Please try again.',
          error: error.response?.data || error.message
        };
      }
    }
  }

  // Refresh token with fallback
  static async refreshToken() {
    try {
      const { refreshToken } = this.getTokens();
      
      if (!refreshToken) {
        return {
          success: false,
          message: 'No refresh token available. Please login again.',
          error: 'REFRESH_TOKEN_MISSING'
        };
      }

      // Try with Authorization header as fallback
      const response = await api.post(ENDPOINTS.AUTH.REFRESH, {}, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      // Update tokens if new ones are provided
      if (response.data.access_token || response.data.refresh_token) {
        this.setTokens(response.data.access_token, response.data.refresh_token);
      }

      return {
        success: true,
        data: response.data,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      if (error.response?.status === 401) {
        // Refresh token expired, clear tokens
        this.clearTokens();
        return {
          success: false,
          message: 'Refresh token expired. Please login again.',
          error: 'REFRESH_TOKEN_EXPIRED'
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Refresh token endpoint not found. Please check server configuration.',
          error: 'REFRESH_ENDPOINT_NOT_FOUND'
        };
      } else {
        return {
          success: false,
          message: error.response?.data?.message || 'Token refresh failed',
          error: error.response?.data || error.message
        };
      }
    }
  }

  // Check authentication status
  static async isAuthenticated() {
    try {
      const { accessToken } = this.getTokens();
      
      if (!accessToken) {
        return false;
      }

      // Try to verify token with server
      const response = await api.get(ENDPOINTS.AUTH.ME, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      // If 401, try to refresh token
      if (error.response?.status === 401) {
        const refreshResult = await this.refreshToken();
        return refreshResult.success;
      }
      return false;
    }
  }

  // Get user info
  static async getUserInfo() {
    try {
      const { accessToken } = this.getTokens();
      
      if (!accessToken) {
        return null;
      }

      const response = await api.get(ENDPOINTS.AUTH.ME, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Logout
  static async logout() {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }
}

export default AuthFallback;
