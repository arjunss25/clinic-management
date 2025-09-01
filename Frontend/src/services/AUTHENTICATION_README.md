# Authentication System Documentation

## Overview
This authentication system implements a secure login flow with OTP verification for the clinic management application. It supports role-based access control for SuperAdmin, Clinic, Doctor, and Patient panels. **The system now uses HTTP-only cookies for enhanced security.**

## Features

### 1. Authentication Flow
- **Login**: Email and password authentication
- **OTP Verification**: 6-digit OTP sent to user's email
- **Role-based Routing**: Automatic redirection based on user role
- **Cookie-based Authentication**: HTTP-only cookies for secure token storage
- **Auto-logout**: Automatic logout on authentication failure

### 2. Protected Routes
- **SuperAdmin Routes**: `/superadmin/*`
- **Clinic Routes**: `/clinic/*`
- **Doctor Routes**: `/doctor/*`
- **Patient Routes**: `/patient/*`

### 3. API Endpoints
All endpoints are configured in `src/config/endpoints.js`:

```javascript
AUTH: {
  LOGIN: 'http://127.0.0.1:8000/api/login/',
  VERIFY_OTP: 'http://127.0.0.1:8000/api/verify-otp/',
  LOGOUT: 'http://127.0.0.1:8000/api/logout/',
  ME: 'http://127.0.0.1:8000/api/auth/me/',
}
```

## Implementation Details

### 1. Authentication Service (`src/services/authService.js`)
Handles all authentication-related API calls:
- `login(email, password)`: Sends login credentials
- `verifyOtp(email, otp)`: Verifies OTP and receives user data (tokens stored as cookies)
- `logout()`: Calls logout API to clear cookies
- `getUserRole()`: Gets role from server or fallback to local storage
- `getUserId()`: Gets user ID from server or fallback to local storage
- `isAuthenticated()`: Checks authentication status via server request

### 2. Token Service (`src/services/tokenService.js`)
Manages authentication with HTTP-only cookies:
- **Cookie-based Authentication**: Tokens stored as HTTP-only cookies by the server
- **Server-side Validation**: Authentication status checked via API calls
- **Fallback Support**: Legacy localStorage methods for backward compatibility
- **Secure Logout**: Calls server to clear cookies

### 3. Protected Routes (`src/routes/ProtectedRoutes.jsx`)
Role-based route protection:
- `SuperAdminRoute`: Only SuperAdmin users
- `ClinicRoute`: Only Clinic users
- `DoctorRoute`: Only Doctor users
- `PatientRoute`: Only Patient users
- `AuthenticatedRoute`: Any authenticated user

### 4. Redux Store (`src/store/`)
Global state management using Redux Toolkit:
- **Store Configuration** (`src/store/store.js`): Main Redux store setup
- **Auth Slice** (`src/store/slices/authSlice.js`): Authentication state and async thunks
- **Hooks** (`src/store/hooks.js`): Typed Redux hooks for easier usage
- **Auth Initializer** (`src/components/auth/AuthInitializer.jsx`): Handles initial auth check

### 5. Login Component (`src/panels/Auth/Login.jsx`)
Enhanced login form with:
- Email/password validation
- OTP modal integration
- Error handling
- Loading states
- Automatic redirection

## Usage Examples

### Login Flow
```javascript
// 1. User enters credentials
const result = await dispatch(login({ email, password }));

// 2. If successful, OTP modal appears
if (login.fulfilled.match(result)) {
  setShowOtpModal(true);
}

// 3. User enters OTP
const otpResult = await dispatch(verifyOtp({ email, otp }));

// 4. If successful, user is redirected to appropriate dashboard
if (verifyOtp.fulfilled.match(otpResult)) {
  const { role } = otpResult.payload.data;
  navigate(`/${role.toLowerCase()}`);
}
```

### Protected Route Usage
```javascript
// In Routes.jsx
<Route path="/superadmin" element={
  <SuperAdminRoute>
    <SuperAdminLayout />
  </SuperAdminRoute>
}>
  {/* SuperAdmin routes */}
</Route>
```

### Logout
```javascript
// In any component
const dispatch = useAppDispatch();
await dispatch(logout());
navigate('/login');
```

## Security Features

1. **HTTP-only Cookies**: Tokens stored as secure HTTP-only cookies
2. **Server-side Authentication**: Authentication status validated via API calls
3. **Automatic Cookie Management**: Cookies handled automatically by the browser
4. **Role Validation**: Server-side role verification
5. **Route Protection**: Client-side role-based access control
6. **Secure Logout**: Server-side cookie clearing

## Error Handling

- Network errors with user-friendly messages
- Invalid credentials handling
- OTP verification failures
- Authentication failure handling
- Role mismatch redirects

## File Structure

```
src/
├── config/
│   ├── axios.js              # Axios configuration with cookie support
│   └── endpoints.js          # API endpoints configuration
├── store/
│   ├── store.js              # Redux store configuration
│   ├── hooks.js              # Typed Redux hooks
│   └── slices/
│       └── authSlice.js      # Authentication state and async thunks
├── components/
│   └── auth/
│       └── AuthInitializer.jsx # Initial auth check component
├── routes/
│   ├── ProtectedRoutes.jsx   # Role-based route protection
│   └── Routes.jsx            # Main routing configuration
├── services/
│   ├── authService.js        # Authentication API calls
│   └── tokenService.js       # Cookie-based authentication utilities
└── panels/Auth/
    └── Login.jsx             # Enhanced login component with OTP modal
```

## Testing

To test the authentication system:

1. **Login**: Use the provided credentials
   ```json
   {
     "email": "arjun.notech@gmail.com",
     "password": "Arjun@123"
   }
   ```

2. **OTP Verification**: Enter the 6-digit OTP received via email
   ```json
   {
     "email": "arjun.notech@gmail.com",
     "otp": "343009"
   }
   ```

3. **Role-based Access**: Verify redirection to appropriate dashboard based on role

## Migration from Token-based to Cookie-based Authentication

### Key Changes:
1. **Token Storage**: Removed localStorage/sessionStorage token storage
2. **Axios Configuration**: Added `withCredentials: true` for cookie support
3. **Authentication Checks**: Now use server API calls instead of local token validation
4. **Logout Process**: Calls server endpoint to clear cookies

### Backward Compatibility:
- Legacy token methods are deprecated but still available
- Fallback to localStorage for user info if server is unavailable
- Gradual migration path for existing implementations

## Notes

- The OTP verification component has been replaced with a modal in the Login component
- All endpoints are centralized in the endpoints configuration file
- Redux Toolkit provides global state management with async thunks
- Protected routes automatically redirect unauthorized users
- HTTP-only cookies provide enhanced security against XSS attacks
- Redux DevTools can be used for debugging state changes
- Server-side authentication validation ensures security
