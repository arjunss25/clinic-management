import axios from '../config/axios';

const doctorApiService = {
  // Get doctor profile
  getDoctorProfile: async () => {
    try {
      const response = await axios.get('/get-dcotor-profile/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Doctor profile fetched successfully'
      };
    } catch (error) {
      console.error('Get doctor profile error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'Doctor profile not found', data: null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view this doctor profile.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch doctor profile', data: null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching doctor profile', data: null };
      }
    }
  },

  // Update doctor profile
  updateDoctorProfile: async (doctorData) => {
    try {
      const response = await axios.patch('/update-doctor-profile/', doctorData);
      return {
        success: true,
        data: response.data,
        message: 'Doctor profile updated successfully'
      };
    } catch (error) {
      console.error('Update doctor profile error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid doctor data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to update this doctor profile.', data: null };
        } else if (status === 404) {
          return { success: false, message: 'Doctor profile not found', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to update doctor profile', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while updating doctor profile', data: null };
      }
    }
  },

  // Get doctor working hours
  getDoctorWorkingHours: async () => {
    try {
      const response = await axios.get('/get-doctor-working-hours/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Doctor working hours fetched successfully'
      };
    } catch (error) {
      console.error('Get doctor working hours error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No working hours found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view working hours.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch working hours', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching working hours', data: [] };
      }
    }
  },

  // Update doctor working hours
  updateDoctorWorkingHours: async (workingHoursData) => {
    try {
      // Transform the data to match the expected API payload structure
      const payload = {
        working_hours: workingHoursData
      };
      
      const response = await axios.patch('/update-doctor-working-hours/', payload);
      return {
        success: true,
        data: response.data,
        message: 'Doctor working hours updated successfully'
      };
    } catch (error) {
      console.error('Update doctor working hours error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid working hours data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to update working hours.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to update working hours', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while updating working hours', data: null };
      }
    }
  },

  // Get doctor appointments
  getDoctorAppointments: async () => {
    try {
      const response = await axios.get('/get-doctor-appointments/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Doctor appointments fetched successfully'
      };
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No appointments found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view appointments.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch appointments', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching appointments', data: [] };
      }
    }
  },

  // Get doctor patients
  getDoctorPatients: async () => {
    try {
      const response = await axios.get('/get-doctor-patients/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Doctor patients fetched successfully'
      };
    } catch (error) {
      console.error('Get doctor patients error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No patients found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view patients.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch patients', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching patients', data: null };
      }
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await axios.patch(`/update-appointment-status/${appointmentId}/`, { status });
      return {
        success: true,
        data: response.data,
        message: 'Appointment status updated successfully'
      };
    } catch (error) {
      console.error('Update appointment status error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid status provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to update appointment status.', data: null };
        } else if (status === 404) {
          return { success: false, message: 'Appointment not found', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to update appointment status', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while updating appointment status', data: null };
      }
    }
  },

  // Add consultation notes
  addConsultationNotes: async (appointmentId, notes) => {
    try {
      const response = await axios.post(`/add-consultation-notes/${appointmentId}/`, { notes });
      return {
        success: true,
        data: response.data,
        message: 'Consultation notes added successfully'
      };
    } catch (error) {
      console.error('Add consultation notes error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid notes provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to add consultation notes.', data: null };
        } else if (status === 404) {
          return { success: false, message: 'Appointment not found', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to add consultation notes', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while adding consultation notes', data: null };
      }
    }
  },

  // Set doctor availability
  setDoctorAvailability: async (availabilityData) => {
    try {
      const response = await axios.post('/set-doctor-availability/', availabilityData);
      return {
        success: true,
        data: response.data,
        message: 'Doctor availability set successfully'
      };
    } catch (error) {
      console.error('Set doctor availability error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid availability data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to set availability.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to set doctor availability', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while setting doctor availability', data: null };
      }
    }
  },

  // Update doctor availability
  updateDoctorAvailability: async (availabilityData) => {
    try {
      const response = await axios.patch('/update-doctor-availability/', availabilityData);
      return {
        success: true,
        data: response.data,
        message: 'Doctor availability updated successfully'
      };
    } catch (error) {
      console.error('Update doctor availability error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid availability data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to update availability.', data: null };
        } else if (status === 404) {
          return { success: false, message: 'Availability record not found', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to update doctor availability', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while updating doctor availability', data: null };
      }
    }
  },

  // Get doctor availability for a specific date
  getDoctorAvailability: async (doctorId, date) => {
    try {
      const response = await axios.get(`/list-doctor-availability/${doctorId}/${date}/`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Doctor availability fetched successfully'
      };
    } catch (error) {
      console.error('Get doctor availability error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No availability found for this date', data: { slots: [] } };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: { slots: [] } };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view availability.', data: { slots: [] } };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch doctor availability', data: { slots: [] } };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: { slots: [] } };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching doctor availability', data: { slots: [] } };
      }
    }
  },

  // Block a slot
  blockSlot: async (slotData) => {
    try {
      const response = await axios.post('/slots-block-unblock/', slotData);
      return {
        success: true,
        data: response.data,
        message: 'Slot blocked successfully'
      };
    } catch (error) {
      console.error('Block slot error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid slot data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to block slots.', data: null };
        } else if (status === 404) {
          return { success: false, message: 'Slot not found', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to block slot', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while blocking slot', data: null };
      }
    }
  },

  // Unblock/Delete a slot
  unblockSlot: async (slotData) => {
    try {
      const response = await axios.delete('/slots-block-unblock/', { data: slotData });
      return {
        success: true,
        data: response.data,
        message: 'Slot unblocked successfully'
      };
    } catch (error) {
      console.error('Unblock slot error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid slot data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to unblock slots.', data: null };
        } else if (status === 404) {
          return { success: false, message: 'Slot not found', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to unblock slot', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while unblocking slot', data: null };
      }
    }
  }
};

export default doctorApiService;
