import axios from 'axios';
import { removeTokens } from '../services/tokenService';
import AuthFallback from '../services/authFallback';
import { ENDPOINTS } from './endpoints';

// Create axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - add Authorization header as fallback if cookies don't work
api.interceptors.request.use(
  (config) => {
    // Try to get access token from localStorage as fallback
    const { accessToken } = AuthFallback.getTokens();
    
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 401 detected, attempting token refresh...');
        
        // Try axios first, then fallback to fetch
        let response;
        try {
          // Call refresh token endpoint - HTTP-only cookies are automatically sent
          response = await api.post(ENDPOINTS.AUTH.REFRESH, {}, {
            withCredentials: true
          });
          console.log('✅ Token refresh successful (axios), retrying original request');
        } catch (axiosError) {
          console.warn('⚠️ Axios refresh failed in interceptor, trying fetch fallback:', axiosError.message);
          
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
          console.log('✅ Token refresh successful (fetch), retrying original request');
          
          response = {
            data: fetchData,
            status: fetchResponse.status
          };
        }
        
        console.log('🍪 New cookies after refresh:', document.cookie);
        
        // If refresh successful, retry the original request
        processQueue(null, response.data);
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed in interceptor:', refreshError);
        
        // Handle refresh failures
        if (refreshError.response?.status === 401 || 
            refreshError.response?.data?.message?.includes('Refresh token missing')) {
          
          console.log('🔒 Refresh token expired/missing, redirecting to login');
          processQueue(refreshError, null);
          
          // Clear any local storage
          localStorage.removeItem('clinic_access_token');
          sessionStorage.removeItem('clinic_refresh_token');
          AuthFallback.clearTokens();
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else {
          // For other errors, just reject the request
          processQueue(refreshError, null);
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
