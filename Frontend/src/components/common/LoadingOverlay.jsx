import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ 
  isLoading, 
  title = "Loading...", 
  message = "Please wait while we process your request",
  spinnerSize = "xl",
  className = ""
}) => {
  if (!isLoading) return null;

  return (
    <div className={`absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm ${className}`}>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <LoadingSpinner size={spinnerSize} />
        </div>
        <p className="text-xl font-semibold mb-3" style={{ color: '#111827' }}>
          {title}
        </p>
        <p className="text-base" style={{ color: '#6B7280' }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
