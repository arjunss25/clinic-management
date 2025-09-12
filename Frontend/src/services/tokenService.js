import api from '../config/axios';
import { ENDPOINTS } from '../config/endpoints';
import AuthFallback from './authFallback';

// Token service for managing authentication with HTTP-only cookies
class TokenService {
  // Check if user is authenticated by making a request to the server
  static async isAuthenticated() {
    // First check if we have any cookies at all
    const hasAnyCookies = document.cookie && document.cookie.length > 0;
    if (!hasAnyCookies) {
      console.log('🔍 No cookies found, user not authenticated');
      return false;
    }

    // Try fallback authentication first
    const fallbackAuth = await AuthFallback.isAuthenticated();
    if (fallbackAuth) {
      return true;
    }

    // Fallback to cookie-based authentication
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME, {
        withCredentials: true
      });
      return response.status === 200;
    } catch (error) {
      console.log('🔍 Authentication check failed:', error.response?.status);
      return false;
    }
  }

  // Check if user is authenticated by making a request to /me endpoint
  static async checkAuthentication() {
    try {
      console.log('🔍 Checking authentication status...');
      
      // First check if we have any cookies at all
      const hasAnyCookies = document.cookie && document.cookie.length > 0;
      if (!hasAnyCookies) {
        console.log('🔍 No cookies found, user not authenticated');
        return {
          success: false,
          isAuthenticated: false,
          message: 'No authentication cookies found'
        };
      }
      
      const response = await api.get(ENDPOINTS.AUTH.ME, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        console.log('✅ User is authenticated');
        return {
          success: true,
          isAuthenticated: true,
          userInfo: response.data,
          message: 'User is authenticated'
        };
      } else {
        console.log('❌ User is not authenticated');
        return {
          success: false,
          isAuthenticated: false,
          message: 'User is not authenticated'
        };
      }
    } catch (error) {
      console.log('❌ Authentication check failed:', error.response?.status);
      return {
        success: false,
        isAuthenticated: false,
        message: 'Authentication check failed',
        error: error.response?.data || error.message
      };
    }
  }

  // Get user info from server
  static async getUserInfo() {
    // Try fallback authentication first
    const fallbackUserInfo = await AuthFallback.getUserInfo();
    if (fallbackUserInfo) {
      return fallbackUserInfo;
    }

    // Fallback to cookie-based authentication
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Refresh token manually
  static async refreshToken() {
    try {
      console.log('🔄 Attempting to refresh access token...');
      
      // Since refresh token is HTTP-only, we can't directly check it
      // But we can check if we have any cookies (indicating potential auth state)
      const hasAnyCookies = document.cookie && document.cookie.length > 0;
      
      if (!hasAnyCookies) {
        console.warn('⚠️ No cookies found - likely no refresh token available');
        return {
          success: false,
          message: 'No refresh token available. Please login again.',
          error: 'REFRESH_TOKEN_MISSING',
          requiresLogin: true
        };
      }

      console.log('🍪 Cookies available:', document.cookie);
      
      // Try axios first, then fallback to fetch if it fails
      let response;
      try {
        // Make refresh request - HTTP-only cookies are automatically sent
        response = await api.post(ENDPOINTS.AUTH.REFRESH, {}, {
          withCredentials: true
        });
        console.log('✅ Token refresh successful (axios):', response.data);
      } catch (axiosError) {
        console.warn('⚠️ Axios refresh failed, trying fetch fallback:', axiosError.message);
        
        // Fallback to fetch (like Postman)
        const fetchResponse = await fetch(ENDPOINTS.AUTH.REFRESH, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
          },
          body: JSON.stringify({})
        });
        
        if (!fetchResponse.ok) {
          throw new Error(`Fetch refresh failed: ${fetchResponse.status} ${fetchResponse.statusText}`);
        }
        
        const fetchData = await fetchResponse.json();
        console.log('✅ Token refresh successful (fetch):', fetchData);
        
        response = {
          data: fetchData,
          status: fetchResponse.status
        };
      }

      console.log('🍪 New cookies set:', document.cookie);
      
      return {
        success: true,
        data: response.data,
        message: 'Token refreshed successfully'
      };

    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Refresh token expired. Please login again.',
          error: 'REFRESH_TOKEN_EXPIRED',
          requiresLogin: true
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Refresh token endpoint not found.',
          error: 'REFRESH_ENDPOINT_NOT_FOUND'
        };
      } else if (error.response?.data?.message?.includes('Refresh token missing')) {
        return {
          success: false,
          message: 'Refresh token missing. Please login again.',
          error: 'REFRESH_TOKEN_MISSING',
          requiresLogin: true
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

  // Check what cookies are available
  static getAvailableCookies() {
    const cookies = document.cookie;
    console.log('Available cookies:', cookies);
    
    if (cookies) {
      const cookieArray = cookies.split(';').map(cookie => cookie.trim());
      console.log('Cookie array:', cookieArray);
      
      const cookieMap = {};
      cookieArray.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name && value) {
          cookieMap[name.trim()] = value.trim();
        }
      });
      console.log('Cookie map:', cookieMap);
      return cookieMap;
    }
    
    return {};
  }

  // Debug method to check authentication status
  static async debugAuthStatus() {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Current URL:', window.location.href);
    console.log('Available cookies:', this.getAvailableCookies());
    
    try {
      const isAuth = await this.isAuthenticated();
      console.log('Is authenticated:', isAuth);
      
      if (isAuth) {
        const userInfo = await this.getUserInfo();
        console.log('User info:', userInfo);
      }
    } catch (error) {
      console.log('Auth check error:', error);
    }
    
    console.log('=== END AUTH DEBUG ===');
  }

  // Attempt to refresh token and check authentication
  static async attemptRefreshAndAuth() {
    try {
      // First try to refresh the token
      const refreshResult = await this.refreshToken();
      
      if (refreshResult.success) {
        // If refresh successful, check if user is now authenticated
        const isAuth = await this.isAuthenticated();
        if (isAuth) {
          const userInfo = await this.getUserInfo();
          return {
            success: true,
            isAuthenticated: true,
            userInfo: userInfo,
            message: 'Token refreshed and user authenticated successfully'
          };
        } else {
          return {
            success: false,
            isAuthenticated: false,
            message: 'Token refreshed but user authentication failed'
          };
        }
      } else {
        // Handle specific refresh token errors
        if (refreshResult.error === 'REFRESH_TOKEN_MISSING' || 
            refreshResult.error === 'REFRESH_TOKEN_EXPIRED') {
          return {
            success: false,
            isAuthenticated: false,
            message: refreshResult.message,
            error: refreshResult.error,
            requiresLogin: true
          };
        }
        
        return {
          success: false,
          isAuthenticated: false,
          message: refreshResult.message || 'Token refresh failed',
          error: refreshResult.error
        };
      }
    } catch (error) {
      console.error('Error during token refresh attempt:', error);
      return {
        success: false,
        isAuthenticated: false,
        message: 'Error during token refresh attempt',
        error: error.message,
        requiresLogin: true
      };
    }
  }

  // Initialize authentication with automatic token refresh
  static async initializeAuth() {
    try {
      console.log('🚀 Initializing authentication...');
      
      // First check if we have any cookies at all
      const hasAnyCookies = document.cookie && document.cookie.length > 0;
      if (!hasAnyCookies) {
        console.log('🔍 No cookies found, user needs to login');
        return {
          success: false,
          isAuthenticated: false,
          message: 'No authentication cookies found. Please login.',
          requiresLogin: true
        };
      }
      
      // First, check if user is already authenticated
      const authCheck = await this.checkAuthentication();
      
      if (authCheck.success && authCheck.isAuthenticated) {
        console.log('✅ User already authenticated');
        return {
          success: true,
          isAuthenticated: true,
          userInfo: authCheck.userInfo,
          message: 'User already authenticated'
        };
      }

      // If not authenticated, try to refresh token
      console.log('🔄 User not authenticated, attempting token refresh...');
      const refreshResult = await this.refreshToken();
      
      if (refreshResult.success) {
        // Token refreshed successfully, check authentication again
        const reAuthCheck = await this.checkAuthentication();
        
        if (reAuthCheck.success && reAuthCheck.isAuthenticated) {
          console.log('✅ Token refreshed and user authenticated');
          return {
            success: true,
            isAuthenticated: true,
            userInfo: reAuthCheck.userInfo,
            message: 'Token refreshed and user authenticated successfully'
          };
        } else {
          console.log('❌ Token refreshed but user still not authenticated');
          return {
            success: false,
            isAuthenticated: false,
            message: 'Token refreshed but authentication failed'
          };
        }
      } else {
        // Refresh failed
        console.log('❌ Token refresh failed:', refreshResult.message);
        
        // If refresh indicates login is required, clear any stale data
        if (refreshResult.requiresLogin) {
          console.log('Login required, clearing stale authentication data');
          this.clearStaleAuthData();
        }
        
        return {
          success: false,
          isAuthenticated: false,
          message: refreshResult.message,
          error: refreshResult.error,
          requiresLogin: refreshResult.requiresLogin || false
        };
      }
    } catch (error) {
      console.error('❌ Authentication initialization error:', error);
      this.clearStaleAuthData();
      return {
        success: false,
        isAuthenticated: false,
        message: 'Authentication initialization failed',
        error: error.message,
        requiresLogin: true
      };
    }
  }

  // Clear stale authentication data without calling logout endpoint
  static clearStaleAuthData() {
    console.log('Clearing stale authentication data');
    
    // Clear any local storage as fallback
    localStorage.removeItem('clinic_access_token');
    sessionStorage.removeItem('clinic_refresh_token');
    
    // Clear any other auth-related data
    localStorage.removeItem('user');
    localStorage.removeItem('auth_state');
    sessionStorage.clear();
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
    this.clearStaleAuthData();
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
export const getAvailableCookies = () => TokenService.getAvailableCookies();
export const attemptRefreshAndAuth = () => TokenService.attemptRefreshAndAuth();
export const initializeAuth = () => TokenService.initializeAuth();
export const debugAuthStatus = () => TokenService.debugAuthStatus();
export const checkAuthentication = () => TokenService.checkAuthentication();

export default TokenService;


