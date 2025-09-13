import { useDispatch, useSelector } from 'react-redux';
import { 
  selectUser, 
  selectIsAuthenticated, 
  selectLoading, 
  selectError, 
  selectLoginLoading, 
  selectOtpLoading,
  selectUserRole,
  selectUserId,
  selectUserEmail,
  selectIsSuperAdmin,
  selectIsDoctor,
  selectIsPatient,
  selectIsStaff
} from './slices/authSlice';
import { 
  login, 
  verifyOtp, 
  logout, 
  initializeAuth, 
  clearError, 
  setUser, 
  clearUser 
} from './slices/authSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Authentication hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  return {
    // State
    user: useAppSelector(selectUser),
    isAuthenticated: useAppSelector(selectIsAuthenticated),
    loading: useAppSelector(selectLoading),
    error: useAppSelector(selectError),
    loginLoading: useAppSelector(selectLoginLoading),
    otpLoading: useAppSelector(selectOtpLoading),
    
    // User properties
    userRole: useAppSelector(selectUserRole),
    userId: useAppSelector(selectUserId),
    userEmail: useAppSelector(selectUserEmail),
    isSuperAdmin: useAppSelector(selectIsSuperAdmin),
    isDoctor: useAppSelector(selectIsDoctor),
    isPatient: useAppSelector(selectIsPatient),
    isStaff: useAppSelector(selectIsStaff),
    
    // Actions
    login: (credentials) => dispatch(login(credentials)),
    verifyOtp: (otpData) => dispatch(verifyOtp(otpData)),
    logout: () => dispatch(logout()),
    initializeAuth: () => dispatch(initializeAuth()),
    clearError: () => dispatch(clearError()),
    setUser: (userData) => dispatch(setUser(userData)),
    clearUser: () => dispatch(clearUser()),
  };
};

// Individual hooks for specific use cases
export const useUser = () => useAppSelector(selectUser);
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated);
export const useUserRole = () => useAppSelector(selectUserRole);
export const useUserId = () => useAppSelector(selectUserId);
export const useUserEmail = () => useAppSelector(selectUserEmail);
export const useIsSuperAdmin = () => useAppSelector(selectIsSuperAdmin);
export const useIsDoctor = () => useAppSelector(selectIsDoctor);
export const useIsPatient = () => useAppSelector(selectIsPatient);
export const useIsStaff = () => useAppSelector(selectIsStaff);
export const useAuthLoading = () => useAppSelector(selectLoading);
export const useAuthError = () => useAppSelector(selectError);
