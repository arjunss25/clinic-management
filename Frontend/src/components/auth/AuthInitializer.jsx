import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { initializeAuth } from '../../store/slices/authSlice';
import { useTokenRefresh } from '../../hooks/useTokenRefresh';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Initialize authentication on component mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Set up automatic token refresh
  useTokenRefresh(isAuthenticated);

  return children;
};

export default AuthInitializer;



