// Error handling utility
export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Error codes mapping
export const ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
};

// Error messages mapping
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action',
  [ERROR_CODES.FORBIDDEN]: 'Access denied. You don\'t have permission for this action',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please login again',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required',
  [ERROR_CODES.INVALID_FORMAT]: 'Invalid format provided',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.ALREADY_EXISTS]: 'This resource already exists',
  [ERROR_CODES.CONFLICT]: 'There is a conflict with the current state',
  [ERROR_CODES.INTERNAL_ERROR]: 'An internal server error occurred',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection',
  [ERROR_CODES.CONNECTION_ERROR]: 'Unable to connect to the server',
};

// Parse error from axios response
export const parseError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR];
    const code = data?.code || ERROR_CODES.INTERNAL_ERROR;
    
    return new ApiError(message, status, code, data?.details);
  } else if (error.request) {
    // Request was made but no response received
    return new ApiError(
      ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      0,
      ERROR_CODES.NETWORK_ERROR
    );
  } else {
    // Something else happened
    return new ApiError(
      error.message || ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
      0,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};

// Get user-friendly error message
export const getErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR];
};

// Check if error is retryable
export const isRetryableError = (error) => {
  if (error instanceof ApiError) {
    return [500, 502, 503, 504].includes(error.status);
  }
  
  if (error.response) {
    return [500, 502, 503, 504].includes(error.response.status);
  }
  
  return false;
};

// Check if error is authentication related
export const isAuthError = (error) => {
  if (error instanceof ApiError) {
    return [401, 403].includes(error.status);
  }
  
  if (error.response) {
    return [401, 403].includes(error.response.status);
  }
  
  return false;
};

// Handle specific error types
export const handleError = (error, options = {}) => {
  const {
    showNotification = true,
    redirectToLogin = false,
    customHandler = null,
  } = options;

  const parsedError = parseError(error);
  
  // Custom error handler
  if (customHandler) {
    customHandler(parsedError);
    return parsedError;
  }

  // Authentication errors
  if (isAuthError(parsedError)) {
    if (redirectToLogin) {
      // Redirect to login page
      window.location.href = '/login';
    }
  }

  // Show notification if enabled
  if (showNotification) {
    // You can integrate with your notification system here
    console.error('Error:', parsedError.message);
  }

  return parsedError;
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// Error boundary helper
export const withErrorBoundary = (Component, fallback = null) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return fallback || <div>Something went wrong.</div>;
      }

      return <Component {...this.props} />;
    }
  };
};

