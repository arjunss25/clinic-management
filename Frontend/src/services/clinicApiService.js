import axios from '../config/axios';

const clinicAPI = {
  // Get clinic profile details
  getClinicProfile: async () => {
    try {
      const response = await axios.get('/get-clinic-profile/');
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Clinic profile retrieved successfully'
      };
    } catch (error) {
      console.error('Get clinic profile error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        
        if (status === 404) {
          return {
            success: false,
            message: 'Clinic profile not found',
            data: null
          };
        } else if (status === 401) {
          return {
            success: false,
            message: 'Unauthorized access. Please login again.',
            data: null
          };
        } else if (status === 403) {
          return {
            success: false,
            message: 'Access denied. You do not have permission to view this clinic profile.',
            data: null
          };
        } else {
          return {
            success: false,
            message: error.response.data?.message || error.response.data?.error || 'Failed to retrieve clinic profile',
            data: null
          };
        }
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: null
        };
      } else {
        // Other error
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while retrieving clinic profile',
          data: null
        };
      }
    }
  },

  // Update clinic profile
  updateClinicProfile: async (clinicData) => {
    try {
      const response = await axios.patch('/update-clinic-profile/', clinicData);
      
      return {
        success: true,
        data: response.data,
        message: 'Clinic profile updated successfully'
      };
    } catch (error) {
      console.error('Update clinic profile error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || error.response.data?.error || 'Failed to update clinic profile',
          errors: error.response.data?.errors || null
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating clinic profile'
        };
      }
    }
  },

  // Update clinic specialties
  updateSpecialties: async (specialties) => {
    try {
      // Transform specialties to the format expected by the API (pk values only)
      const formattedSpecialties = specialties.map(specialty => {
        if (typeof specialty === 'string') {
          return specialty; // If it's a string, it might be an ID
        }
        return specialty.id || specialty.pk || specialty; // Extract ID or use the specialty object
      });
      
      const response = await axios.put('/update-clinic-specialties/', { specialties: formattedSpecialties });
      
      return {
        success: true,
        data: response.data,
        message: 'Specialties updated successfully'
      };
    } catch (error) {
      console.error('Update specialties error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update specialties'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating specialties'
        };
      }
    }
  },

  // List all facilities
  listFacilities: async () => {
    try {
      const response = await axios.get('/list-facilities/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Facilities fetched successfully'
      };
    } catch (error) {
      console.error('List facilities error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No facilities found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view facilities.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch facilities', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching facilities', data: [] };
      }
    }
  },

  // Delete facility by ID
  deleteFacility: async (facilityId) => {
    try {
      const response = await axios.delete(`/delete-facility/${facilityId}/`);
      return {
        success: true,
        data: response.data,
        message: 'Facility deleted successfully'
      };
    } catch (error) {
      console.error('Delete facility error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'Facility not found', data: null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to delete facilities.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to delete facility', data: null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while deleting facility', data: null };
      }
    }
  },

  // Add new facility
  addFacility: async (facilityData) => {
    try {
      const response = await axios.post('/add-facility/', facilityData);
      return {
        success: true,
        data: response.data,
        message: 'Facility added successfully'
      };
    } catch (error) {
      console.error('Add facility error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid facility data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to add facilities.', data: null };
        } else if (status === 409) {
          return { success: false, message: 'Facility with this name already exists', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to add facility', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while adding facility', data: null };
      }
    }
  },

  // List all patient amenities
  listPatientAmenities: async () => {
    try {
      const response = await axios.get('/list-patient-amenity/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Patient amenities fetched successfully'
      };
    } catch (error) {
      console.error('List patient amenities error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No patient amenities found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view patient amenities.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch patient amenities', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching patient amenities', data: [] };
      }
    }
  },

  // Add new patient amenity
  addPatientAmenity: async (amenityData) => {
    try {
      // Transform the data to match the expected API payload structure
      const payload = {
        patient_amenities: amenityData.name || amenityData
      };
      
      const response = await axios.post('/add-patient-amenity/', payload);
      return {
        success: true,
        data: response.data,
        message: 'Patient amenity added successfully'
      };
    } catch (error) {
      console.error('Add patient amenity error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid amenity data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to add patient amenities.', data: null };
        } else if (status === 409) {
          return { success: false, message: 'Patient amenity with this name already exists', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to add patient amenity', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while adding patient amenity', data: null };
      }
    }
  },

  // Delete patient amenity by ID
  deletePatientAmenity: async (amenityId) => {
    try {
      const response = await axios.delete(`/delete-patient-amenity/${amenityId}/`);
      return {
        success: true,
        data: response.data,
        message: 'Patient amenity deleted successfully'
      };
    } catch (error) {
      console.error('Delete patient amenity error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'Patient amenity not found', data: null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to delete patient amenities.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to delete patient amenity', data: null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while deleting patient amenity', data: null };
      }
    }
  },

  // List clinic working hours
  listClinicWorkingHours: async () => {
    try {
      const response = await axios.get('/list-clinic-working-hours/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Clinic working hours fetched successfully'
      };
    } catch (error) {
      console.error('List clinic working hours error:', error);
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

  // Update clinic working hours
  updateClinicWorkingHours: async (workingHoursData) => {
    try {
      // Transform the data to match the expected API payload structure
      const payload = {
        working_hours: workingHoursData
      };
      
      const response = await axios.patch('/clinic-working-hours/', payload);
      return {
        success: true,
        data: response.data,
        message: 'Clinic working hours updated successfully'
      };
    } catch (error) {
      console.error('Update clinic working hours error:', error);
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

  // Update clinic facilities
  updateFacilities: async (facilities) => {
    try {
      const response = await axios.put('/update-clinic-facilities/', { facilities });
      
      return {
        success: true,
        data: response.data,
        message: 'Facilities updated successfully'
      };
    } catch (error) {
      console.error('Update facilities error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update facilities'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating facilities'
        };
      }
    }
  },

  // Update clinic amenities
  updateAmenities: async (amenities) => {
    try {
      const response = await axios.put('/update-clinic-amenities/', { amenities });
      
      return {
        success: true,
        data: response.data,
        message: 'Amenities updated successfully'
      };
    } catch (error) {
      console.error('Update amenities error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update amenities'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating amenities'
        };
      }
    }
  },

  // Update clinic accreditations
  updateAccreditations: async (accreditations) => {
    try {
      const response = await axios.put('/update-clinic-accreditations/', { accreditations });
      
      return {
        success: true,
        data: response.data,
        message: 'Accreditations updated successfully'
      };
    } catch (error) {
      console.error('Update accreditations error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update accreditations'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating accreditations'
        };
      }
    }
  },

  // Update clinic operating hours
  updateOperatingHours: async (operatingHours) => {
    try {
      const response = await axios.put('/update-clinic-operating-hours/', { operatingHours });
      
      return {
        success: true,
        data: response.data,
        message: 'Operating hours updated successfully'
      };
    } catch (error) {
      console.error('Update operating hours error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update operating hours'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating operating hours'
        };
      }
    }
  },

  // Update clinic contact information
  updateContactInfo: async (contactInfo) => {
    try {
      const response = await axios.put('/update-clinic-contact-info/', { contactInfo });
      
      return {
        success: true,
        data: response.data,
        message: 'Contact information updated successfully'
      };
    } catch (error) {
      console.error('Update contact info error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update contact information'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating contact information'
        };
      }
    }
  },

  // Update clinic address
  updateAddress: async (addressData) => {
    try {
      const response = await axios.put('/update-clinic-address/', addressData);
      
      return {
        success: true,
        data: response.data,
        message: 'Address updated successfully'
      };
    } catch (error) {
      console.error('Update address error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to update address'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while updating address'
        };
      }
    }
  },

  // Get clinic specializations
  getClinicSpecializations: async () => {
    try {
      const response = await axios.get('/list-clinic-specializations/');
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Clinic specializations retrieved successfully'
      };
    } catch (error) {
      console.error('Get clinic specializations error:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 404) {
          return {
            success: false,
            message: 'No specializations found',
            data: []
          };
        } else if (status === 401) {
          return {
            success: false,
            message: 'Unauthorized access. Please login again.',
            data: []
          };
        } else if (status === 403) {
          return {
            success: false,
            message: 'Access denied. You do not have permission to view specializations.',
            data: []
          };
        } else {
          return {
            success: false,
            message: error.response.data?.message || error.response.data?.error || 'Failed to retrieve specializations',
            data: []
          };
        }
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: []
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while retrieving specializations',
          data: []
        };
      }
    }
  },

  // Register a new doctor
  registerDoctor: async (doctorData) => {
    try {
      const response = await axios.post('/register-doctor/', doctorData);
      
      return {
        success: true,
        data: response.data,
        message: 'Doctor registered successfully'
      };
    } catch (error) {
      console.error('Register doctor error:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 400) {
          return {
            success: false,
            message: error.response.data?.message || 'Invalid doctor data provided',
            errors: error.response.data?.errors || null
          };
        } else if (status === 401) {
          return {
            success: false,
            message: 'Unauthorized access. Please login again.',
            data: null
          };
        } else if (status === 403) {
          return {
            success: false,
            message: 'Access denied. You do not have permission to register doctors.',
            data: null
          };
        } else if (status === 409) {
          return {
            success: false,
            message: 'Doctor with this email already exists',
            data: null
          };
        } else {
          return {
            success: false,
            message: error.response.data?.message || error.response.data?.error || 'Failed to register doctor',
            errors: error.response.data?.errors || null
          };
        }
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: null
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred while registering doctor',
          data: null
        };
      }
    }
  },

  // Get all doctors
  listAllDoctors: async () => {
    try {
      const response = await axios.get('/list-all-doctors/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Doctors fetched successfully'
      };
    } catch (error) {
      console.error('List all doctors error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No doctors found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view doctors.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch doctors', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching doctors', data: [] };
      }
    }
  },

  // Search doctors
  searchDoctors: async (query) => {
    try {
      const response = await axios.get(`/search-doctors/?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Doctors search completed successfully'
      };
    } catch (error) {
      console.error('Search doctors error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No doctors found matching your search', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to search doctors.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to search doctors', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while searching doctors', data: [] };
      }
    }
  },

  // Register a new patient
  registerPatient: async (patientData) => {
    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Add all patient fields to FormData
      formData.append('full_name', patientData.full_name || '');
      formData.append('age', patientData.age || '');
      formData.append('gender', patientData.gender || '');
      formData.append('phone_number', patientData.phone_number || '');
      formData.append('blood_group', patientData.blood_group || '');
      formData.append('emergency_contact_name', patientData.emergency_contact_name || '');
      formData.append('emergency_contact_phone', patientData.emergency_contact_phone || '');
      formData.append('address', patientData.address || '');
      formData.append('known_allergies', patientData.known_allergies || '');
      formData.append('email', patientData.email || '');

      const response = await axios.post('/patients/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Patient registered successfully'
      };
    } catch (error) {
      console.error('Register patient error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid patient data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to register patients.', data: null };
        } else if (status === 409) {
          return { success: false, message: 'Patient with this email or phone already exists', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to register patient', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while registering patient', data: null };
      }
    }
  },

  // Get doctors by specialization
  listDoctorsBySpecialization: async (specialization) => {
    try {
      const response = await axios.get(`/list-doctor-by-specialization/${encodeURIComponent(specialization)}/`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Doctors fetched successfully'
      };
    } catch (error) {
      console.error('List doctors by specialization error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No doctors found for this specialization', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view doctors.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch doctors by specialization', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching doctors by specialization', data: [] };
      }
    }
  },

  // Get doctor profile
  getDoctorProfile: async (doctorId) => {
    try {
      const response = await axios.get(`/doctor-profile/${doctorId}/`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Doctor profile fetched successfully'
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

  // Get doctor details
  getDoctorDetails: async (doctorId) => {
    try {
      const response = await axios.get(`/doctor-details/${doctorId}/`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Doctor details fetched successfully'
      };
    } catch (error) {
      console.error('Get doctor details error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'Doctor details not found', data: null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view this doctor details.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch doctor details', data: null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching doctor details', data: null };
      }
    }
  },

  // Update doctor profile
  updateDoctorProfile: async (doctorId, doctorData) => {
    try {
      const response = await axios.patch(`/doctor-profile/${doctorId}/`, doctorData);
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
  getDoctorWorkingHours: async (doctorId) => {
    try {
      const response = await axios.get(`/doctor-working-hours/${doctorId}/`);
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
  updateDoctorWorkingHours: async (doctorId, workingHoursData) => {
    try {
      // Transform the data to match the expected API payload structure
      const payload = {
        working_hours: workingHoursData
      };
      
      const response = await axios.patch(`/doctor-working-hours/${doctorId}/`, payload);
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

  // Get dashboard counts
  getDashboardCounts: async () => {
    try {
      const response = await axios.get('/dashboard-counts/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Dashboard counts fetched successfully'
      };
    } catch (error) {
      console.error('Get dashboard counts error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view dashboard counts.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch dashboard counts', data: null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching dashboard counts', data: null };
      }
    }
  },

  // Add new accreditation
  addAccreditation: async (accreditationData) => {
    try {
      const response = await axios.post('/add-accreditation/', accreditationData);
      return {
        success: true,
        data: response.data,
        message: 'Accreditation added successfully'
      };
    } catch (error) {
      console.error('Add accreditation error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          return { success: false, message: error.response.data?.message || 'Invalid accreditation data provided', errors: error.response.data?.errors || null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to add accreditations.', data: null };
        } else if (status === 409) {
          return { success: false, message: 'Accreditation with this name already exists', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to add accreditation', errors: error.response.data?.errors || null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while adding accreditation', data: null };
      }
    }
  },

  // List all accreditations
  listAccreditations: async () => {
    try {
      const response = await axios.get('/list-accreditations/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Accreditations fetched successfully'
      };
    } catch (error) {
      console.error('List accreditations error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'No accreditations found', data: [] };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: [] };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to view accreditations.', data: [] };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to fetch accreditations', data: [] };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: [] };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while fetching accreditations', data: [] };
      }
    }
  },

  // Delete accreditation
  deleteAccreditation: async (accreditationId) => {
    try {
      const response = await axios.delete(`/delete-accreditation/${accreditationId}/`);
      return {
        success: true,
        data: response.data,
        message: 'Accreditation deleted successfully'
      };
    } catch (error) {
      console.error('Delete accreditation error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { success: false, message: 'Accreditation not found', data: null };
        } else if (status === 401) {
          return { success: false, message: 'Unauthorized access. Please login again.', data: null };
        } else if (status === 403) {
          return { success: false, message: 'Access denied. You do not have permission to delete accreditations.', data: null };
        } else {
          return { success: false, message: error.response.data?.message || error.response.data?.error || 'Failed to delete accreditation', data: null };
        }
      } else if (error.request) {
        return { success: false, message: 'Network error. Please check your connection and try again.', data: null };
      } else {
        return { success: false, message: error.message || 'An unexpected error occurred while deleting accreditation', data: null };
      }
    }
  }
};

export default clinicAPI;
