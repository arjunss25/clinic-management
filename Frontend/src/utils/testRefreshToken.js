// Test script for refresh token functionality
// Run this in browser console after logging in

export const debugRefreshToken = async () => {
  console.log('🔍 Debugging Refresh Token Issue...');
  console.log('=====================================');
  
  // Check current cookies
  console.log('Current cookies:', document.cookie);
  
  // Test 1: Direct fetch (like Postman)
  try {
    console.log('🧪 Testing direct fetch request...');
    const response = await fetch('http://127.0.0.1:8000/api/refresh-token/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    console.log('Fetch response status:', response.status);
    console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()));
    const data = await response.text();
    console.log('Fetch response body:', data);
    console.log('Cookies after fetch:', document.cookie);
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
  
  // Test 2: Axios request
  try {
    console.log('🧪 Testing axios request...');
    const { default: api } = await import('../config/axios.js');
    const response = await api.post('/refresh-token/', {}, {
      withCredentials: true
    });
    
    console.log('Axios response status:', response.status);
    console.log('Axios response data:', response.data);
    console.log('Cookies after axios:', document.cookie);
    
  } catch (error) {
    console.error('Axios error:', error);
  }
  
  // Test 3: TokenService
  try {
    console.log('🧪 Testing TokenService...');
    const { refreshToken } = await import('../services/tokenService.js');
    const result = await refreshToken();
    console.log('TokenService result:', result);
    console.log('Cookies after TokenService:', document.cookie);
    
  } catch (error) {
    console.error('TokenService error:', error);
  }
};

// Complete test flow
export const testCompleteFlow = async () => {
  console.log('🧪 Testing Complete Authentication Flow...');
  console.log('=====================================');
  
  // Step 1: Check current state
  console.log('1. Current cookies:', document.cookie);
  
  // Step 2: Test refresh token
  console.log('2. Testing refresh token...');
  await debugRefreshToken();
  
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
  
  console.log('=====================================');
  console.log('🏁 Complete Flow Test Finished');
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.debugRefreshToken = debugRefreshToken;
  window.testCompleteFlow = testCompleteFlow;
}

export default {
  debugRefreshToken,
  testCompleteFlow
};
