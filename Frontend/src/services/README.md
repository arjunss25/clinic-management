# API Services & Token Management

This directory contains the API integration setup for the Clinic Management System, including axios configuration, token management, and centralized API services.

## Structure

```
src/
├── config/
│   ├── axios.js          # Axios configuration with interceptors
│   └── environment.js    # Environment configuration
├── services/
│   ├── tokenService.js   # Token management service
│   ├── apiService.js     # Centralized API services
│   └── index.js          # Service exports
├── hooks/
│   └── useApi.js         # Custom hooks for API calls
└── utils/
    └── errorHandler.js   # Error handling utilities
```

## Features

### 🔐 Token Management
- **Access Token**: Stored in localStorage for persistence
- **Refresh Token**: Stored in sessionStorage for security
- **Automatic Refresh**: Handles token expiration automatically
- **Token Validation**: Checks token expiration and validity

### 🌐 API Configuration
- **Base URL**: Configurable via environment variables
- **Request Interceptors**: Automatically adds auth headers
- **Response Interceptors**: Handles token refresh and error responses
- **Timeout Handling**: Configurable request timeouts

### 📡 API Services
- **Authentication**: Login, register, logout, profile management
- **Patients**: CRUD operations for patient management
- **Appointments**: Appointment scheduling and management
- **Doctors**: Doctor profile and availability management
- **Medical Records**: Patient medical history
- **Billing**: Invoice and payment management
- **Dashboard**: Statistics and analytics

### 🎣 Custom Hooks
- **useApi**: Generic API call hook with loading/error states
- **useApiOperation**: Hook for specific API operations
- **useCrud**: Hook for CRUD operations with full state management

### ⚠️ Error Handling
- **Standardized Errors**: Consistent error format across the app
- **User-Friendly Messages**: Human-readable error messages
- **Retry Mechanism**: Automatic retry for failed requests
- **Error Boundaries**: React error boundary support

## Usage

### Basic API Call
```javascript
import { authAPI } from '../services';

// Login
const handleLogin = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Using Custom Hooks
```javascript
import { useCrud } from '../hooks/useApi';
import { patientsAPI } from '../services';

const PatientList = () => {
  const { loading, error, data, getAll } = useCrud(patientsAPI);

  useEffect(() => {
    getAll();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
};
```

### Token Management
```javascript
import { 
  getAccessToken, 
  setAccessToken, 
  isAuthenticated,
  removeTokens 
} from '../services';

// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
}

// Get current token
const token = getAccessToken();

// Clear tokens on logout
removeTokens();
```

## Environment Variables

Create a `.env` file in your project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Environment
VITE_NODE_ENV=development
```

## Error Handling

The system includes comprehensive error handling:

```javascript
import { handleError, parseError } from '../utils/errorHandler';

try {
  await apiService.someOperation();
} catch (error) {
  const parsedError = parseError(error);
  
  // Handle specific error types
  if (parsedError.status === 401) {
    // Handle unauthorized
  } else if (parsedError.status === 404) {
    // Handle not found
  }
  
  // Show user-friendly message
  console.error(parsedError.message);
}
```

## Security Features

- **Token Storage**: Access tokens in localStorage, refresh tokens in sessionStorage
- **Automatic Refresh**: Seamless token refresh without user intervention
- **Secure Logout**: Proper token cleanup on logout
- **Error Handling**: Graceful handling of authentication failures

## Best Practices

1. **Always use the provided hooks** for API calls to ensure consistent error handling
2. **Handle loading states** in your components
3. **Use error boundaries** for catching unexpected errors
4. **Validate tokens** before making authenticated requests
5. **Implement proper logout** to clear all tokens
6. **Use environment variables** for configuration

## Troubleshooting

### Common Issues

1. **Token not being sent**: Check if `getAccessToken()` returns a valid token
2. **401 errors**: Verify token expiration and refresh mechanism
3. **CORS issues**: Ensure backend allows requests from your frontend domain
4. **Network errors**: Check API base URL and network connectivity

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

This will log all API requests and responses to the console.


