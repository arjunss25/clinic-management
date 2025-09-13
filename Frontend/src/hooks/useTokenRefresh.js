import { useEffect, useRef } from 'react';
import { refreshToken } from '../services/tokenService';

// Hook for automatic token refresh
export const useTokenRefresh = (isAuthenticated, refreshInterval = 14 * 60 * 1000) => { // 14 minutes default
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only set up token refresh if user is authenticated
    if (isAuthenticated) {
      console.log('🔄 Setting up automatic token refresh for authenticated user');
      
      // Set up periodic token refresh
      const refreshTokens = async () => {
        try {
          // Check if we have cookies before attempting refresh
          const hasAnyCookies = document.cookie && document.cookie.length > 0;
          if (!hasAnyCookies) {
            console.log('🔍 No cookies found, skipping automatic refresh');
            return;
          }
          
          const result = await refreshToken();
          if (!result.success) {
            console.warn('Automatic token refresh failed:', result.message);
          }
        } catch (error) {
          console.error('Error during automatic token refresh:', error);
        }
      };

      // Initial refresh check
      refreshTokens();

      // Set up interval for periodic refresh
      intervalRef.current = setInterval(refreshTokens, refreshInterval);

      // Handle page visibility changes (user switching tabs, coming back to app)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // User came back to the app, refresh token
          refreshTokens();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Handle focus events (user clicking back into the window)
      const handleFocus = () => {
        refreshTokens();
      };

      window.addEventListener('focus', handleFocus);

      // Handle network status changes (user coming back online)
      const handleOnline = () => {
        refreshTokens();
      };

      window.addEventListener('online', handleOnline);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('online', handleOnline);
      };
    } else {
      // Clear interval if user is not authenticated
      console.log('🔍 User not authenticated, clearing token refresh interval');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isAuthenticated, refreshInterval]);

  // Return function to manually trigger refresh
  const manualRefresh = async () => {
    try {
      const result = await refreshToken();
      return result;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return { success: false, message: error.message };
    }
  };

  return { manualRefresh };
};
