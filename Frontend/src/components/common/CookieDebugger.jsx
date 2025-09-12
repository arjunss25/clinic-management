import React, { useState } from 'react';
import { getAvailableCookies, refreshToken, checkAuthentication } from '../../services/tokenService';
import { testRefreshTokenLikePostman, testCompleteAuthFlow } from '../../utils/authDebug';

const CookieDebugger = () => {
  const [cookies, setCookies] = useState({});
  const [refreshResult, setRefreshResult] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [postmanTestResult, setPostmanTestResult] = useState(null);
  const [completeFlowResult, setCompleteFlowResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkCookies = () => {
    const cookieData = getAvailableCookies();
    setCookies(cookieData);
  };

  const testRefresh = async () => {
    setLoading(true);
    try {
      const result = await refreshToken();
      setRefreshResult(result);
    } catch (error) {
      setRefreshResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const result = await checkAuthentication();
      setAuthStatus(result);
    } catch (error) {
      setAuthStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testPostmanLike = async () => {
    setLoading(true);
    try {
      const result = await testRefreshTokenLikePostman();
      setPostmanTestResult(result);
    } catch (error) {
      setPostmanTestResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCompleteFlow = async () => {
    setLoading(true);
    try {
      const result = await testCompleteAuthFlow();
      setCompleteFlowResult(result);
    } catch (error) {
      setCompleteFlowResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Cookie Debugger</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={checkCookies}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Available Cookies
          </button>
          
          {Object.keys(cookies).length > 0 && (
            <div className="mt-2">
              <h4 className="font-medium">Available Cookies:</h4>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(cookies, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={testRefresh}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Refresh Token'}
          </button>
          
          {refreshResult && (
            <div className="mt-2">
              <h4 className="font-medium">Refresh Result:</h4>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(refreshResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={checkAuth}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Authentication'}
          </button>
          
          {authStatus && (
            <div className="mt-2">
              <h4 className="font-medium">Auth Status:</h4>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(authStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={testPostmanLike}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Like Postman'}
          </button>
          
          {postmanTestResult && (
            <div className="mt-2">
              <h4 className="font-medium">Postman-like Test Result:</h4>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(postmanTestResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={testCompleteFlow}
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Complete Flow'}
          </button>
          
          {completeFlowResult && (
            <div className="mt-2">
              <h4 className="font-medium">Complete Flow Test Result:</h4>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(completeFlowResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium">Raw Cookie String:</h4>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {document.cookie || 'No cookies found'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CookieDebugger;


