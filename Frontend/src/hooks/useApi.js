import { useState, useCallback } from 'react';
import { isAuthenticated } from '../services/tokenService';

// Custom hook for API calls
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Generic API call function
  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      // Check authentication if needed
      if (!isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    callApi,
    reset,
  };
};

// Hook for specific API operations
export const useApiOperation = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};

// Hook for CRUD operations
export const useCrud = (apiService) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getAll(params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getById(id);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const create = useCallback(async (itemData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.create(itemData);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const update = useCallback(async (id, itemData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.update(id, itemData);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.delete(id);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    getAll,
    getById,
    create,
    update,
    remove,
    reset,
  };
};

