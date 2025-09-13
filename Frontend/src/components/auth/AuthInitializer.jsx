import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initializeAuth } from '../../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};

export default AuthInitializer;

