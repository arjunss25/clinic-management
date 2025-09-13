// Authentication debugging utility
import AuthFallback from '../services/authFallback';
import { debugAuthStatus, checkAuthentication, refreshToken } from '../services/tokenService';

export const runAuthDebug = async () => {
  console.log('🔍 Starting Authentication Debug...');
  console.log('=====================================');
  
  // Check localStorage tokens
  const { accessToken, refreshToken } = AuthFallback.getTokens();
  console.log('📦 LocalStorage Tokens:');
  console.log('  Access Token:', accessToken ? '✅ Present' : '❌ Missing');
  console.log('  Refresh Token:', refreshToken ? '✅ Present' : '❌ Missing');
  
  // Check cookies
  const cookies = document.cookie;
  console.log('🍪 Browser Cookies:');
  console.log('  Raw cookies:', cookies || 'No cookies found');
  
  if (cookies) {
    const cookieArray = cookies.split(';').map(cookie => cookie.trim());
    console.log('  Parsed cookies:', cookieArray);
  }
  
  // Test authentication status
  console.log('🔐 Authentication Status:');
  try {
    const authCheck = await checkAuthentication();
    console.log('  Cookie-based Auth:', authCheck);
    
    if (authCheck.success && authCheck.isAuthenticated) {
      console.log('  User Info:', authCheck.userInfo);
    }
  } catch (error) {
    console.log('  Auth Check Error:', error.message);
  }
  
  // Test fallback authentication
  try {
    const isAuth = await AuthFallback.isAuthenticated();
    console.log('  Fallback Auth:', isAuth ? '✅ Authenticated' : '❌ Not authenticated');
    
    if (isAuth) {
      const userInfo = await AuthFallback.getUserInfo();
      console.log('  Fallback User Info:', userInfo);
    }
  } catch (error) {
    console.log('  Fallback Auth Error:', error.message);
  }
  
  // Test token service
  try {
    await debugAuthStatus();
  } catch (error) {
    console.log('  Token Service Error:', error.message);
  }
  
  console.log('=====================================');
  console.log('🏁 Authentication Debug Complete');
};

// Test API connectivity
export const testApiConnectivity = async () => {
  console.log('🌐 Testing API Connectivity...');
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('📡 API Response Body:', data);
    
  } catch (error) {
    console.log('❌ API Connectivity Error:', error.message);
  }
};

// Test login flow
export const testLoginFlow = async (email, password) => {
  console.log('🔑 Testing Login Flow...');
  
  try {
    const result = await AuthFallback.login(email, password);
    console.log('🔑 Login Result:', result);
    
    if (result.success) {
      console.log('✅ Login successful!');
      
      // Test authentication after login
      const isAuth = await AuthFallback.isAuthenticated();
      console.log('🔐 Post-login Auth Status:', isAuth ? '✅ Authenticated' : '❌ Not authenticated');
    } else {
      console.log('❌ Login failed:', result.message);
    }
    
  } catch (error) {
    console.log('❌ Login Flow Error:', error.message);
  }
};

// Test refresh token flow
export const testRefreshTokenFlow = async () => {
  console.log('🔄 Testing Refresh Token Flow...');
  console.log('=====================================');
  
  try {
    // Test 1: Check current cookies
    console.log('1. Checking current cookies...');
    console.log('Available cookies:', document.cookie);
    
    // Test 2: Check current auth status
    console.log('2. Checking current authentication...');
    const authStatus = await checkAuthentication();
    console.log('Auth Status:', authStatus);
    
    // Test 3: Try manual refresh
    console.log('3. Testing manual token refresh...');
    const refreshResult = await refreshToken();
    console.log('Refresh Result:', refreshResult);
    
    // Test 4: Check cookies after refresh
    console.log('4. Checking cookies after refresh...');
    console.log('Updated cookies:', document.cookie);
    
    // Test 5: Check auth after refresh
    console.log('5. Checking authentication after refresh...');
    const postRefreshAuth = await checkAuthentication();
    console.log('Post-Refresh Auth:', postRefreshAuth);
    
    console.log('=====================================');
    console.log('🏁 Refresh Token Test Complete');
    
    return {
      initialCookies: document.cookie,
      initialAuth: authStatus,
      refreshResult: refreshResult,
      postRefreshCookies: document.cookie,
      postRefreshAuth: postRefreshAuth
    };
    
  } catch (error) {
    console.log('❌ Refresh Token Test Error:', error.message);
    return { error: error.message };
  }
};

// Test refresh token exactly like Postman
export const testRefreshTokenLikePostman = async () => {
  console.log('🧪 Testing Refresh Token Like Postman...');
  console.log('=====================================');
  
  try {
    // Test 1: Check current cookies
    console.log('1. Current cookies:', document.cookie);
    
    // Test 2: Make direct fetch request (like Postman)
    console.log('2. Making direct fetch request...');
    
    const response = await fetch('http://127.0.0.1:8000/api/refresh-token/', {
      method: 'POST',
      credentials: 'include', // This is crucial for cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify({}) // Empty body like in Postman
    });
    
    console.log('3. Response status:', response.status);
    console.log('4. Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.text();
    console.log('5. Response body:', responseData);
    
    // Test 3: Check cookies after request
    console.log('6. Cookies after request:', document.cookie);
    
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseData,
      cookies: document.cookie
    };
    
  } catch (error) {
    console.log('❌ Postman-like test error:', error.message);
    return { error: error.message };
  }
};

// Complete authentication flow test
export const testCompleteAuthFlow = async () => {
  console.log('🧪 Testing Complete Authentication Flow...');
  console.log('=====================================');
  
  try {
    // Step 1: Check current state
    console.log('1. Current cookies:', document.cookie);
    
    // Step 2: Test refresh token
    console.log('2. Testing refresh token...');
    const refreshResult = await testRefreshTokenLikePostman();
    console.log('Refresh result:', refreshResult);
    
    // Step 3: Test API call
    console.log('3. Testing API call...');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/me/', {
        credentials: 'include'
      });
      console.log('API call status:', response.status);
      const apiData = await response.text();
      console.log('API call response:', apiData);
    } catch (error) {
      console.error('API call error:', error);
    }
    
    return {
      refreshResult,
      cookies: document.cookie
    };
    
  } catch (error) {
    console.log('❌ Complete flow test error:', error.message);
    return { error: error.message };
  }
};

// Export all debug functions
export default {
  runAuthDebug,
  testApiConnectivity,
  testLoginFlow,
  testRefreshTokenFlow,
  testRefreshTokenLikePostman,
  testCompleteAuthFlow
};
