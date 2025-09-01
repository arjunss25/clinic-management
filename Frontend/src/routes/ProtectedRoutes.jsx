import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';

// Role-based route mapping
const ROLE_ROUTES = {
  'SuperAdmin': '/superadmin',
  'Clinic': '/clinic',
  'Doctor': '/doctor',
  'Patient': '/patient'
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const isAuth = useAppSelector(selectIsAuthenticated);
  
  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole) {
    const userRole = user?.role;
    
    if (!userRole || userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's role
      const userRoute = ROLE_ROUTES[userRole];
      if (userRoute) {
        return <Navigate to={userRoute} replace />;
      } else {
        // If role is not recognized, redirect to login
        return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

// Specific protected route components for each role
export const SuperAdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="SuperAdmin">
    {children}
  </ProtectedRoute>
);

export const ClinicRoute = ({ children }) => (
  <ProtectedRoute requiredRole="Clinic">
    {children}
  </ProtectedRoute>
);

export const DoctorRoute = ({ children }) => (
  <ProtectedRoute requiredRole="Doctor">
    {children}
  </ProtectedRoute>
);

export const PatientRoute = ({ children }) => (
  <ProtectedRoute requiredRole="Patient">
    {children}
  </ProtectedRoute>
);

// General protected route (any authenticated user)
export const AuthenticatedRoute = ({ children }) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
