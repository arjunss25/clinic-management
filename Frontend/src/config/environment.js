// Environment configuration
const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000,
    retryAttempts: 3,
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'clinic_access_token',
    refreshTokenKey: 'clinic_refresh_token',
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes in milliseconds
  },

  // App Configuration
  app: {
    name: 'Clinic Management System',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },

  // Feature Flags
  features: {
    enableNotifications: true,
    enableOfflineMode: false,
    enableAnalytics: import.meta.env.MODE === 'production',
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 5,
  },
};

// Development specific overrides
if (import.meta.env.MODE === 'development') {
  config.api.baseURL = 'http://localhost:8000/api';
  config.features.enableAnalytics = false;
}

// Production specific overrides
if (import.meta.env.MODE === 'production') {
  config.api.baseURL = import.meta.env.VITE_API_BASE_URL;
  config.features.enableAnalytics = true;
}

export default config;


