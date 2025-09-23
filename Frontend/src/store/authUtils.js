// Authentication utility functions and constants

// User roles constants
export const USER_ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  STAFF: 'Staff',
};

// Check if user has specific role
export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

// Check if user has any of the specified roles
export const hasAnyRole = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

// Check if user has all of the specified roles (for future multi-role support)
export const hasAllRoles = (userRole, requiredRoles) => {
  return requiredRoles.every(role => userRole === role);
};

// Get user-friendly role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.DOCTOR]: 'Doctor',
    [USER_ROLES.PATIENT]: 'Patient',
    [USER_ROLES.STAFF]: 'Staff',
  };
  return roleNames[role] || role;
};

// Check if user can access specific features based on role
export const canAccessFeature = (userRole, feature) => {
  const featurePermissions = {
    'clinic-registration': [USER_ROLES.SUPER_ADMIN],
    'doctor-management': [USER_ROLES.SUPER_ADMIN],
    'patient-management': [USER_ROLES.SUPER_ADMIN, USER_ROLES.DOCTOR, USER_ROLES.STAFF],
    'appointment-management': [USER_ROLES.DOCTOR, USER_ROLES.STAFF],
    'medical-records': [USER_ROLES.DOCTOR, USER_ROLES.STAFF],
    'analytics': [USER_ROLES.SUPER_ADMIN],
    'settings': [USER_ROLES.SUPER_ADMIN],
  };
  
  const allowedRoles = featurePermissions[feature] || [];
  return hasAnyRole(userRole, allowedRoles);
};

// Get user's accessible features
export const getAccessibleFeatures = (userRole) => {
  const allFeatures = [
    'clinic-registration',
    'doctor-management', 
    'patient-management',
    'appointment-management',
    'medical-records',
    'analytics',
    'settings'
  ];
  
  return allFeatures.filter(feature => canAccessFeature(userRole, feature));
};

// Validate user data structure
export const validateUserData = (userData) => {
  if (!userData) return false;
  
  const requiredFields = ['role', 'user_id', 'email'];
  return requiredFields.every(field => userData.hasOwnProperty(field));
};

// Format user data for storage/display
export const formatUserData = (apiResponse) => {
  if (!apiResponse?.data) return null;
  
  return {
    role: apiResponse.data.role,
    id: apiResponse.data.user_id,
    email: apiResponse.data.email,
    isAuthenticated: true
  };
};

// Check if user session is expired (you can customize this logic)
export const isSessionExpired = (lastActivity) => {
  if (!lastActivity) return true;
  
  const now = Date.now();
  const lastActivityTime = new Date(lastActivity).getTime();
  const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (now - lastActivityTime) > sessionTimeout;
};

// Get user's dashboard route based on role
export const getUserDashboardRoute = (userRole) => {
  const dashboardRoutes = {
    [USER_ROLES.SUPER_ADMIN]: '/superadmin/dashboard',
    [USER_ROLES.DOCTOR]: '/doctor/dashboard',
    [USER_ROLES.PATIENT]: '/patient/dashboard',
    [USER_ROLES.STAFF]: '/staff/dashboard',
  };
  
  return dashboardRoutes[userRole] || '/dashboard';
};

// Get user's navigation menu items based on role
export const getUserNavigationItems = (userRole) => {
  const navigationItems = {
    [USER_ROLES.SUPER_ADMIN]: [
      { label: 'Dashboard', path: '/superadmin/dashboard' },
      { label: 'Clinics', path: '/superadmin/clinics' },
      { label: 'Doctors', path: '/superadmin/doctors' },
      { label: 'Analytics', path: '/superadmin/analytics' },
      { label: 'Settings', path: '/superadmin/settings' },
    ],
    [USER_ROLES.DOCTOR]: [
      { label: 'Dashboard', path: '/doctor/dashboard' },
      { label: 'Patients', path: '/doctor/patients' },
      { label: 'Appointments', path: '/doctor/appointments' },
      { label: 'Medical Records', path: '/doctor/medical-records' },
    ],
    [USER_ROLES.PATIENT]: [
      { label: 'Dashboard', path: '/patient/dashboard' },
      { label: 'Appointments', path: '/patient/appointments' },
      { label: 'Medical Records', path: '/patient/medical-records' },
      { label: 'Health Tips', path: '/patient/health-tips' },
    ],
    [USER_ROLES.STAFF]: [
      { label: 'Dashboard', path: '/staff/dashboard' },
      { label: 'Patients', path: '/staff/patients' },
      { label: 'Appointments', path: '/staff/appointments' },
    ],
  };
  
  return navigationItems[userRole] || [];
};
