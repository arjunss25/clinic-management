import api from '../config/axios';
import TokenService from './tokenService';
import { ENDPOINTS } from '../config/endpoints';

class AuthService {
  // Login with email and password
  static async login(email, password) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });

      return {
        success: true,
        data: response.data,
        message: 'Login successful. Please check your email for OTP.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
        error: error.response?.data || error.message
      };
    }
  }

  // Verify OTP and store tokens
  static async verifyOtp(email, otp) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp
      });
      
      if (response.data.status && response.data.data) {
        const { access, refresh, role, user_id, email: userEmail } = response.data.data;
        
        // Store tokens and user info
        TokenService.setTokens(access, refresh);
        TokenService.setUserInfo({
          role,
          user_id,
          email: userEmail
        });
        
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
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed. Please try again.',
        error: error.response?.data || error.message
      };
    }
  }

  // Refresh token manually
  static async refreshToken() {
    try {
      const refreshToken = TokenService.getRefreshToken();
      
      if (!refreshToken) {
        return {
          success: false,
          message: 'No refresh token available. Please login again.',
          error: 'REFRESH_TOKEN_MISSING'
        };
      }

      const response = await api.post(ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken
      });

      const { access, refresh } = response.data;
      
      // Update tokens
      TokenService.setTokens(access, refresh);

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

  // Logout
  static async logout() {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenService.clearTokens();
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return TokenService.isAuthenticated();
  }

  // Get user info
  static getUserInfo() {
    return TokenService.getUserInfo();
  }

  // Get user role
  static getUserRole() {
    const userInfo = TokenService.getUserInfo();
    return userInfo?.role || null;
  }

  // Get user ID
  static getUserId() {
    const userInfo = TokenService.getUserInfo();
    return userInfo?.user_id || null;
  }

  // Check if user has specific role
  static hasRole(requiredRole) {
    const userRole = this.getUserRole();
    return userRole === requiredRole;
  }
}

export default AuthService;
