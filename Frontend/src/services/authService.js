import api from '../config/axios';
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

  // Verify OTP
  static async verifyOtp(email, otp) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp
      });
      
      if (response.data.status && response.data.data) {
        const { role, user_id, email: userEmail } = response.data.data;
        
        // Tokens are now stored as HTTP-only cookies, no need to manually store them
        
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

  // Logout
  static async logout() {
    try {
      // Call logout endpoint to clear cookies on server
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Also clear any local storage if needed
    this.clearLocalStorage();
  }

  // Clear local storage
  static clearLocalStorage() {
    localStorage.removeItem('clinic_access_token');
    sessionStorage.removeItem('clinic_refresh_token');
  }

  // Get user role from server or local storage fallback
  static async getUserRole() {
    try {
      // Try to get user info from server
      const response = await api.get(ENDPOINTS.AUTH.ME);
      return response.data?.role;
    } catch (error) {
      // Fallback to local storage if available
      try {
        const token = localStorage.getItem('clinic_access_token');
        if (!token) return null;
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
      } catch (parseError) {
        console.error('Error parsing token:', parseError);
        return null;
      }
    }
  }

  // Check if user has specific role
  static async hasRole(requiredRole) {
    const userRole = await this.getUserRole();
    return userRole === requiredRole;
  }

  // Get user ID from server or local storage fallback
  static async getUserId() {
    try {
      // Try to get user info from server
      const response = await api.get(ENDPOINTS.AUTH.ME);
      return response.data?.user_id;
    } catch (error) {
      // Fallback to local storage if available
      try {
        const token = localStorage.getItem('clinic_access_token');
        if (!token) return null;
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
      } catch (parseError) {
        console.error('Error parsing token:', parseError);
        return null;
      }
    }
  }

  // Check if user is authenticated by making a request to the server
  static async isAuthenticated() {
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default AuthService;
