# Authentication System Changes: From JSON Tokens to HTTP-Only Cookies

## Overview
This document explains the major changes made to the authentication system, transitioning from JSON token responses to HTTP-only cookies for enhanced security.

## What Changed?

### Before (JSON Token Format)
```json
// Response from /verify-otp/ endpoint
{
  "status": true,
  "message": "OTP verified successfully",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "SuperAdmin",
    "user_id": 1,
    "email": "arjun.notech@gmail.com"
  }
}
```

### After (HTTP-Only Cookies)
```json
// Response from /verify-otp/ endpoint
{
  "status": true,
  "message": "OTP verified successfully",
  "data": {
    "role": "SuperAdmin",
    "user_id": 1,
    "email": "arjun.notech@gmail.com"
  }
}
```

**Plus HTTP-Only Cookies in Response Headers:**
```
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; Path=/; Domain=127.0.0.1; Expires=Sun, 31 Aug 2025 08:...
Set-Cookie: refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; Path=/; Domain=127.0.0.1; Expires=Sun, 07 Sep 2025 08:...
```

## Token Storage Changes

### Before: Local Storage
```javascript
// Tokens were stored in browser storage
localStorage.setItem('clinic_access_token', accessToken);
sessionStorage.setItem('clinic_refresh_token', refreshToken);

// Retrieved manually for each request
const token = localStorage.getItem('clinic_access_token');
config.headers.Authorization = `Bearer ${token}`;
```

### After: HTTP-Only Cookies
```javascript
// Tokens are stored as HTTP-only cookies by the server
// No manual storage needed in JavaScript

// Cookies are automatically sent with requests
// No need to manually add Authorization header
```

## Where Are Tokens Stored Now?

### 1. **Server-Side Cookie Storage**
- **Location**: HTTP-only cookies set by the server
- **Access**: Only accessible by the server, not JavaScript
- **Security**: Protected from XSS attacks
- **Automatic**: Sent with every request to the same domain

### 2. **Browser Cookie Storage**
- **Location**: Browser's cookie storage (not localStorage/sessionStorage)
- **Access**: Automatically managed by the browser
- **Visibility**: Can be seen in browser DevTools → Application → Cookies
- **Security**: HttpOnly flag prevents JavaScript access

### 3. **No More Local Storage**
- **Before**: `localStorage.getItem('clinic_access_token')`
- **After**: Tokens are not accessible via JavaScript
- **Benefit**: Prevents XSS attacks from stealing tokens

## Token Refresh Logic

### How Refresh Works with HTTP-Only Cookies

#### 1. **Automatic Refresh (Axios Interceptor)**
```javascript
// When a request returns 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        // Call refresh token endpoint
        await api.post('/refresh-token/');
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        removeTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

#### 2. **Manual Refresh**
```javascript
// Manual token refresh
const result = await AuthService.refreshToken();
if (result.success) {
  // Token refreshed successfully
  console.log('Token refreshed');
} else {
  // Refresh failed, redirect to login
  window.location.href = '/login';
}
```

#### 3. **Refresh Token Endpoint**
```javascript
// POST /api/refresh-token/
// Server automatically:
// 1. Reads refresh token from HTTP-only cookie
// 2. Validates the refresh token
// 3. Issues new access and refresh tokens as HTTP-only cookies
// 4. Returns success response
```

### Refresh Token Flow

1. **Access Token Expires**: User makes request with expired access token
2. **Server Returns 401**: Server responds with 401 Unauthorized
3. **Axios Interceptor Triggers**: Automatically calls refresh token endpoint
4. **Server Validates Refresh Token**: Server reads refresh token from HTTP-only cookie
5. **New Tokens Issued**: Server sets new access and refresh tokens as HTTP-only cookies
6. **Original Request Retried**: Axios retries the original failed request
7. **User Continues**: User experience is seamless

## Code Changes Made

### 1. Axios Configuration (`src/config/axios.js`)
```javascript
// Before
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// After
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  withCredentials: true, // ← NEW: Enable cookie sending
  headers: {
    'Content-Type': 'application/json',
  },
});

// Before: Manual token handling
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// After: Automatic cookie handling + refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        await api.post('/refresh-token/');
        return api(originalRequest);
      } catch (refreshError) {
        removeTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 2. Authentication Service (`src/services/authService.js`)
```javascript
// Before: Manual token storage
static async verifyOtp(email, otp) {
  const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
  const { access, refresh, role, user_id, email: userEmail } = response.data.data;
  
  // Store tokens manually
  setAccessToken(access);
  setRefreshToken(refresh);
  
  return { success: true, data: { role, user_id, email: userEmail, access, refresh } };
}

// After: Server handles token storage + refresh method
static async verifyOtp(email, otp) {
  const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
  const { role, user_id, email: userEmail } = response.data.data;
  
  // Tokens are stored as HTTP-only cookies by server
  // No manual storage needed
  
  return { success: true, data: { role, user_id, email: userEmail } };
}

// NEW: Manual refresh token method
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
```

### 3. Token Service (`src/services/tokenService.js`)
```javascript
// Before: Local storage operations
static getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

static setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

// After: Server-side validation + refresh method
static async isAuthenticated() {
  try {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// NEW: Manual refresh token method
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

// Legacy methods with deprecation warnings
static getAccessToken() {
  console.warn('getAccessToken is deprecated. Tokens are now stored as HTTP-only cookies.');
  return null;
}
```

## Security Benefits

### 1. **XSS Protection**
- **Before**: Tokens in localStorage could be stolen by malicious scripts
- **After**: HTTP-only cookies cannot be accessed by JavaScript

### 2. **Automatic Token Management**
- **Before**: Manual token storage, retrieval, and cleanup
- **After**: Browser automatically handles cookie sending

### 3. **Server-Side Control**
- **Before**: Client controlled token storage
- **After**: Server controls token lifecycle and security

### 4. **Automatic Token Refresh**
- **Before**: Manual refresh token logic needed
- **After**: Automatic refresh via axios interceptor

## How Authentication Works Now

### 1. **Login Process**
```javascript
// 1. User submits credentials
const result = await dispatch(login({ email, password }));

// 2. Server responds with success (no tokens yet)
// 3. OTP modal appears for verification
```

### 2. **OTP Verification**
```javascript
// 1. User enters OTP
const result = await dispatch(verifyOtp({ email, otp }));

// 2. Server responds with:
//    - User data in JSON response
//    - HTTP-only cookies in response headers
// 3. Browser automatically stores cookies
// 4. User is redirected to dashboard
```

### 3. **Subsequent Requests**
```javascript
// 1. Browser automatically sends cookies with requests
// 2. Server validates cookies
// 3. No manual token handling needed
```

### 4. **Token Refresh (Automatic)**
```javascript
// 1. Request fails with 401
// 2. Axios interceptor automatically calls /refresh-token/
// 3. Server validates refresh token from cookie
// 4. Server sets new tokens as HTTP-only cookies
// 5. Original request is retried automatically
// 6. User experience is seamless
```

### 5. **Logout Process**
```javascript
// 1. Call logout endpoint
await api.post(ENDPOINTS.AUTH.LOGOUT);

// 2. Server clears cookies
// 3. Browser removes cookies automatically
```

## Backward Compatibility

### 1. **Legacy Methods**
```javascript
// These still exist but are deprecated
getAccessToken() // Returns null, logs warning
setAccessToken() // Does nothing, logs warning
getRefreshToken() // Returns null, logs warning
setRefreshToken() // Does nothing, logs warning
```

### 2. **Fallback Mechanisms**
```javascript
// If server is unavailable, fallback to localStorage
static async getUserRole() {
  try {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.data?.role;
  } catch (error) {
    // Fallback to localStorage if available
    const token = localStorage.getItem('clinic_access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    }
    return null;
  }
}
```

## Testing the New System

### 1. **Check Cookie Storage**
1. Open browser DevTools
2. Go to Application → Cookies
3. Look for `access_token` and `refresh_token` cookies
4. Verify they have `HttpOnly` and `Secure` flags

### 2. **Verify Automatic Sending**
1. Open Network tab in DevTools
2. Make any authenticated request
3. Check request headers - cookies should be sent automatically
4. No `Authorization: Bearer` header should be present

### 3. **Test Token Refresh**
1. Wait for access token to expire (or manually expire it on server)
2. Make an authenticated request
3. Check Network tab - should see:
   - Original request returns 401
   - Automatic call to `/refresh-token/`
   - Original request retried successfully
4. User should not notice any interruption

### 4. **Test Logout**
1. Call logout endpoint
2. Check that cookies are cleared from browser storage
3. Verify subsequent requests return 401

## File Changes Summary

| File | Changes |
|------|---------|
| `src/config/axios.js` | Added `withCredentials: true`, automatic refresh logic, removed manual token handling |
| `src/services/authService.js` | Removed token storage, added server-side validation, added refreshToken method |
| `src/services/tokenService.js` | Complete refactor for cookie-based auth, added refreshToken method |
| `src/store/slices/authSlice.js` | Updated for async authentication checks |
| `src/config/endpoints.js` | Added logout, user info, and refresh token endpoints |
| `src/services/apiService.js` | Removed token storage from login |
| `src/services/AUTHENTICATION_README.md` | Updated documentation |

## Benefits Summary

✅ **Enhanced Security**: HTTP-only cookies prevent XSS attacks  
✅ **Simplified Code**: No manual token management needed  
✅ **Automatic Handling**: Browser manages cookie sending  
✅ **Server Control**: Server controls token lifecycle  
✅ **Automatic Refresh**: Seamless token refresh without user intervention  
✅ **Backward Compatible**: Legacy code still works with fallbacks  
✅ **Better UX**: Seamless authentication flow  

## Migration Notes

- **No Breaking Changes**: Existing components continue to work
- **Gradual Migration**: Legacy methods available with warnings
- **Enhanced Security**: Immediate security improvements
- **Simplified Maintenance**: Less code to maintain and debug
- **Automatic Refresh**: No need to handle token expiration manually
