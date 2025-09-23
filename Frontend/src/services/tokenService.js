// Clean token service for managing authentication tokens in localStorage
class TokenService {
  // Store tokens in localStorage
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
    localStorage.removeItem('user_info');
  }

  // Store user info
  static setUserInfo(userInfo) {
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  }

  // Get user info
  static getUserInfo() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const { accessToken } = this.getTokens();
    return !!accessToken;
  }

  // Get access token
  static getAccessToken() {
    return localStorage.getItem('clinic_access_token');
  }

  // Get refresh token
  static getRefreshToken() {
    return localStorage.getItem('clinic_refresh_token');
  }

  // Check if token is expired
  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Get token expiration time
  static getTokenExpiration(token) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch (error) {
      return null;
    }
  }

  // Get user info from token
  static getUserFromToken(token) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        user_id: payload.user_id,
        role: payload.role,
        email: payload.email
      };
    } catch (error) {
      return null;
    }
  }

}

// Export individual functions for easier imports
export const getAccessToken = () => TokenService.getAccessToken();
export const setAccessToken = (token) => TokenService.setTokens(token, null);
export const getRefreshToken = () => TokenService.getRefreshToken();
export const setRefreshToken = (token) => TokenService.setTokens(null, token);
export const removeTokens = () => TokenService.clearTokens();
export const isAuthenticated = () => TokenService.isAuthenticated();
export const isTokenExpired = (token) => TokenService.isTokenExpired(token);
export const getUserFromToken = (token) => TokenService.getUserFromToken(token);
export const getUserInfo = () => TokenService.getUserInfo();
export const setUserInfo = (userInfo) => TokenService.setUserInfo(userInfo);
export const clearTokens = () => TokenService.clearTokens();

export default TokenService;


