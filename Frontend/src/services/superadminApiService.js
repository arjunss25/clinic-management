import axios from '../config/axios';

const superadminAPI = {
  // Clinic registration endpoint
  registerClinic: async (clinicData) => {
    try {
      // Transform the data to match the required payload structure
      const payload = {
        clinic_name: clinicData.name,
        license_number: clinicData.license,
        location: clinicData.location,
        address: clinicData.address,
        phone: clinicData.phone,
        email: clinicData.email,
        specialties: clinicData.specialties.map(specialty => ({ name: specialty })),
        documents: null
      };

      console.log('Sending clinic registration payload:', payload);

      const response = await axios.post('/register-clinic/', payload);
      
      return {
        success: true,
        data: response.data,
        message: 'Clinic registered successfully'
      };
    } catch (error) {
      console.error('Clinic registration error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data?.message || error.response.data?.error || 'Registration failed',
          errors: error.response.data?.errors || null
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.'
        };
      } else {
        // Other error
        return {
          success: false,
          message: error.message || 'An unexpected error occurred'
        };
      }
    }
  },

  // Get all clinics
  getClinics: async () => {
    try {
      const response = await axios.get('/clinics/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get clinics error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch clinics'
      };
    }
  },

  // Get clinic by ID
  getClinicById: async (clinicId) => {
    try {
      const response = await axios.get(`/clinics/${clinicId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get clinic error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch clinic details'
      };
    }
  },

  // Update clinic
  updateClinic: async (clinicId, clinicData) => {
    try {
      const payload = {
        clinic_name: clinicData.name,
        license_number: clinicData.license,
        location: clinicData.location,
        address: clinicData.address,
        phone: clinicData.phone,
        email: clinicData.email,
        specialties: clinicData.specialties.map(specialty => ({ name: specialty })),
        documents: clinicData.documents || null
      };

      const response = await axios.put(`/clinics/${clinicId}/`, payload);
      return {
        success: true,
        data: response.data,
        message: 'Clinic updated successfully'
      };
    } catch (error) {
      console.error('Update clinic error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update clinic'
      };
    }
  },

  // Delete clinic
  deleteClinic: async (clinicId) => {
    try {
      await axios.delete(`/clinics/${clinicId}/`);
      return {
        success: true,
        message: 'Clinic deleted successfully'
      };
    } catch (error) {
      console.error('Delete clinic error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete clinic'
      };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/dashboard/stats/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  },

  // Get expiring subscriptions
  getExpiringSubscriptions: async () => {
    try {
      const response = await axios.get('/subscriptions/expiring/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get expiring subscriptions error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expiring subscriptions'
      };
    }
  }
};

export default superadminAPI;
