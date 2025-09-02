import api from '../config/axios';
import { removeTokens } from './tokenService';

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Tokens are now stored as HTTP-only cookies, no need to manually store them
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove any local tokens as fallback
      removeTokens();
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  }
};

// Patients API calls
export const patientsAPI = {
  // Get all patients
  getAll: async (params = {}) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  // Get patient by ID
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  create: async (patientData) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  // Update patient
  update: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  delete: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  // Search patients
  search: async (query) => {
    const response = await api.get('/patients/search', { params: { q: query } });
    return response.data;
  }
};

// Appointments API calls
export const appointmentsAPI = {
  // Get all appointments
  getAll: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Get appointment by ID
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete appointment
  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  // Get appointments by date range
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/appointments/date-range', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  }
};

// Doctors API calls
export const doctorsAPI = {
  // Get all doctors
  getAll: async (params = {}) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  // Get doctor by ID
  getById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Register new doctor
  register: async (doctorData) => {
    const response = await api.post('/register-doctor/', doctorData);
    return response.data;
  },

  // Create new doctor (legacy)
  create: async (doctorData) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },

  // Update doctor
  update: async (id, doctorData) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  // Delete doctor
  delete: async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  }
};

// Medical Records API calls
export const medicalRecordsAPI = {
  // Get all medical records
  getAll: async (params = {}) => {
    const response = await api.get('/medical-records', { params });
    return response.data;
  },

  // Get medical record by ID
  getById: async (id) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },

  // Get medical records by patient ID
  getByPatientId: async (patientId) => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  },

  // Create new medical record
  create: async (recordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  // Update medical record
  update: async (id, recordData) => {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  },

  // Delete medical record
  delete: async (id) => {
    const response = await api.delete(`/medical-records/${id}`);
    return response.data;
  }
};

// Billing API calls
export const billingAPI = {
  // Get all bills
  getAll: async (params = {}) => {
    const response = await api.get('/bills', { params });
    return response.data;
  },

  // Get bill by ID
  getById: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  // Get bills by patient ID
  getByPatientId: async (patientId) => {
    const response = await api.get(`/bills/patient/${patientId}`);
    return response.data;
  },

  // Create new bill
  create: async (billData) => {
    const response = await api.post('/bills', billData);
    return response.data;
  },

  // Update bill
  update: async (id, billData) => {
    const response = await api.put(`/bills/${id}`, billData);
    return response.data;
  },

  // Delete bill
  delete: async (id) => {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },

  // Mark bill as paid
  markAsPaid: async (id) => {
    const response = await api.patch(`/bills/${id}/pay`);
    return response.data;
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const response = await api.get('/dashboard/recent-activities');
    return response.data;
  },

  // Get revenue data
  getRevenueData: async (period = 'month') => {
    const response = await api.get('/dashboard/revenue', { params: { period } });
    return response.data;
  }
};

// Export all API services
export default {
  auth: authAPI,
  patients: patientsAPI,
  appointments: appointmentsAPI,
  doctors: doctorsAPI,
  medicalRecords: medicalRecordsAPI,
  billing: billingAPI,
  dashboard: dashboardAPI
};
