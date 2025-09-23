import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/authService';
import TokenService from '../../services/tokenService';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const result = await AuthService.verifyOtp(email, otp);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is authenticated using TokenService
      const isAuthenticated = TokenService.isAuthenticated();
      
      if (isAuthenticated) {
        // Get user info from localStorage
        const userInfo = TokenService.getUserInfo();
        
        if (userInfo) {
          return {
            role: userInfo.role,
            id: userInfo.user_id,
            email: userInfo.email,
            isAuthenticated: true
          };
        }
      }
      
      // User not authenticated
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Auth initialization failed');
    }
  }
);

const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  loginLoading: false,
  otpLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload?.isAuthenticated;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.user = {
          role: action.payload.data.role,
          id: action.payload.data.user_id,
          email: action.payload.data.email,
          isAuthenticated: true
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setLoading, setUser, clearUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;
export const selectLoginLoading = (state) => state.auth.loginLoading;
export const selectOtpLoading = (state) => state.auth.otpLoading;

// Additional selectors for user properties
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserId = (state) => state.auth.user?.id;
export const selectUserEmail = (state) => state.auth.user?.email;
export const selectIsSuperAdmin = (state) => state.auth.user?.role === 'SuperAdmin';
export const selectIsDoctor = (state) => state.auth.user?.role === 'Doctor';
export const selectIsPatient = (state) => state.auth.user?.role === 'Patient';
export const selectIsStaff = (state) => state.auth.user?.role === 'Staff';

export default authSlice.reducer;
