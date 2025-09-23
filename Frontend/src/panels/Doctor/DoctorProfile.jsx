import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaCertificate,
  FaStar,
  FaCheckCircle,
  FaDollarSign,
  FaBuilding,
  FaIdCard,
  FaAward,
  FaChartLine,
  FaAmbulance,
  FaWifi,
  FaParking,
  FaWheelchair,
  FaCreditCard,
  FaShieldAlt,
  FaStethoscope,
  FaExclamationTriangle,
} from 'react-icons/fa';
import ResultModal from '../../components/common/ResultModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingOverlay from '../../components/common/LoadingOverlay';

// Theme colors (matching project theme)
const COLORS = {
  primary: '#0F1ED1',
  secondary: '#1B56FD',
  white: '#ffffff',
  background: '#F7F8FA',
  surface: '#ffffff',
  border: '#ECEEF2',
  text: '#111827',
  textMuted: '#6B7280',
  gray50: '#F9FAFB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeEditSection, setActiveEditSection] = useState('');
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [newQualification, setNewQualification] = useState('');
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [newExperience, setNewExperience] = useState('');
  const [addingExperience, setAddingExperience] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOperatingHoursModal, setShowOperatingHoursModal] = useState(false);
  const [workingHours, setWorkingHours] = useState([]);
  const [loadingWorkingHours, setLoadingWorkingHours] = useState(false);
  const [updatingWorkingHours, setUpdatingWorkingHours] = useState(false);
  const [workingHoursForm, setWorkingHoursForm] = useState({
    Monday: { day_of_week: 'Monday', opening_time: '08:00', closing_time: '20:00', is_available: true },
    Tuesday: { day_of_week: 'Tuesday', opening_time: '08:00', closing_time: '20:00', is_available: true },
    Wednesday: { day_of_week: 'Wednesday', opening_time: '08:00', closing_time: '20:00', is_available: true },
    Thursday: { day_of_week: 'Thursday', opening_time: '08:00', closing_time: '20:00', is_available: true },
    Friday: { day_of_week: 'Friday', opening_time: '08:00', closing_time: '20:00', is_available: true },
    Saturday: { day_of_week: 'Saturday', opening_time: '09:00', closing_time: '18:00', is_available: true },
    Sunday: { day_of_week: 'Sunday', opening_time: '10:00', closing_time: '16:00', is_available: false }
  });
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [newService, setNewService] = useState('');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [addingService, setAddingService] = useState(false);
  const [pendingQualifications, setPendingQualifications] = useState([]);
  const [qualificationToDelete, setQualificationToDelete] = useState(null);
  const [showServiceDeleteConfirmModal, setShowServiceDeleteConfirmModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModal, setResultModal] = useState({ type: '', title: '', message: '' });

  // Helper functions for result modals
  const showSuccessModal = (title, message) => {
    setResultModal({ type: 'success', title, message });
    setShowResultModal(true);
  };

  const showErrorModal = (title, message) => {
    setResultModal({ type: 'error', title, message });
    setShowResultModal(true);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setResultModal({ type: '', title: '', message: '' });
  };

  useEffect(() => {
    fetchDoctorProfile();
    fetchQualifications();
    fetchExperiences();
    fetchServices();
    fetchWorkingHours();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Import the doctor API service
      const doctorAPI = await import('../../services/doctorApiService');
      
      const response = await doctorAPI.default.getDoctorProfile();
      
      if (response.success) {
        setDoctor(response.data);
      } else {
        setError(response.message);
        setDoctor(null);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      setError('An unexpected error occurred while loading doctor profile');
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchQualifications = async () => {
    try {
      // Import the doctor API service
      const doctorAPI = await import('../../services/doctorApiService');
      
      // Extract qualifications from the doctor profile data
      // The API response includes additional_qualification with fellowships and certifications
      if (doctor && doctor.additional_qualification) {
        const qualifications = [];
        
        // Add education as a qualification
        if (doctor.education) {
          qualifications.push({
            id: 'education',
            name: doctor.education,
            type: 'Education',
            institution: 'Medical School'
          });
        }
        
        // Add fellowships
        if (doctor.additional_qualification.fellowships) {
          doctor.additional_qualification.fellowships.forEach((fellowship, index) => {
            qualifications.push({
              id: `fellowship-${index}`,
              name: fellowship,
              type: 'Fellowship',
              institution: 'Medical Institution'
            });
          });
        }
        
        // Add certifications
        if (doctor.additional_qualification.certifications) {
          doctor.additional_qualification.certifications.forEach((certification, index) => {
            qualifications.push({
              id: `certification-${index}`,
              name: certification,
              type: 'Certification',
              institution: 'Certifying Body'
            });
          });
        }
        
        setDoctor(prev => ({
          ...prev,
          qualifications: qualifications
        }));
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      // Keep existing qualifications on error
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoadingExperiences(true);
      // Import the doctor API service
      const doctorAPI = await import('../../services/doctorApiService');
      
      // For now, we'll use mock data since we don't have a specific experiences endpoint
      // In a real implementation, you would have an endpoint like getDoctorExperiences
      const mockExperiences = [
        { id: 1, position: 'Senior Cardiologist', hospital: 'City Hospital', duration: '2018-2023' },
        { id: 2, position: 'Cardiologist', hospital: 'General Hospital', duration: '2015-2018' }
      ];
      
      setExperiences(mockExperiences);
      setDoctor(prev => ({
        ...prev,
        experiences: mockExperiences
      }));
    } catch (error) {
      console.error('Error fetching experiences:', error);
      // Keep existing experiences on error
    } finally {
      setLoadingExperiences(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      // Import the doctor API service
      const doctorAPI = await import('../../services/doctorApiService');
      
      // For now, we'll use mock data since we don't have a specific services endpoint
      // In a real implementation, you would have an endpoint like getDoctorServices
      const mockServices = [
        { id: 1, name: 'Cardiac Consultation', price: '$150' },
        { id: 2, name: 'ECG Testing', price: '$75' },
        { id: 3, name: 'Echocardiogram', price: '$200' }
      ];
      
      setServices(mockServices);
      setDoctor(prev => ({
        ...prev,
        services: mockServices
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      // Keep existing services on error
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchWorkingHours = async () => {
    try {
      setLoadingWorkingHours(true);
      
      // Since there's no working hours endpoint in the doctor app yet,
      // we'll use default working hours for now
      const defaultWorkingHours = [
        { day_of_week: 'Monday', opening_time: '08:00', closing_time: '20:00', is_available: true },
        { day_of_week: 'Tuesday', opening_time: '08:00', closing_time: '20:00', is_available: true },
        { day_of_week: 'Wednesday', opening_time: '08:00', closing_time: '20:00', is_available: true },
        { day_of_week: 'Thursday', opening_time: '08:00', closing_time: '20:00', is_available: true },
        { day_of_week: 'Friday', opening_time: '08:00', closing_time: '20:00', is_available: true },
        { day_of_week: 'Saturday', opening_time: '09:00', closing_time: '18:00', is_available: true },
        { day_of_week: 'Sunday', opening_time: '09:00', closing_time: '18:00', is_available: false }
      ];
      
      setWorkingHours(defaultWorkingHours);
      
      // Update the form with default data
      const formData = {};
      defaultWorkingHours.forEach(workingHour => {
        const day = workingHour.day_of_week;
        if (day) {
          formData[day] = {
            day_of_week: day,
            opening_time: workingHour.opening_time,
            closing_time: workingHour.closing_time,
            is_available: workingHour.is_available
          };
        }
      });
      setWorkingHoursForm(prev => ({ ...prev, ...formData }));
      
      // Also update the doctor state for backward compatibility
      setDoctor(prev => ({
        ...prev,
        operatingHours: defaultWorkingHours
      }));
      
    } catch (error) {
      console.error('Error setting up working hours:', error);
      // Keep existing working hours on error
    } finally {
      setLoadingWorkingHours(false);
    }
  };

  const handleEdit = () => {
    setActiveEditSection('basic');
    // Ensure all doctor data is properly copied to edit form
    setEditForm({
      ...doctor,
      // Ensure we have all the necessary fields with fallbacks
      doctor_name: doctor.doctor_name || doctor.name || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      address: doctor.address || '',
      city: doctor.city || '',
      state: doctor.state || '',
      zipCode: doctor.zipCode || '',
      bio: doctor.bio || '',
      specialization: doctor.specialization || '',
      experience_years: doctor.experience_years || 0,
      education: doctor.education || '',
      appointment_amount: doctor.appointment_amount || '0.00'
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      // Import the doctor API service
      const doctorAPI = await import('../../services/doctorApiService');
      
      // Transform the data to match API expectations
      const transformedData = {
        ...editForm,
        // Ensure qualifications are in the correct format
        qualifications: editForm.qualifications ? editForm.qualifications.map(qual => {
          if (typeof qual === 'string') {
            return qual;
          }
          return qual.id || qual.pk || qual;
        }) : []
      };
      
      const response = await doctorAPI.default.updateDoctorProfile(transformedData);
      
      if (response.success) {
        setDoctor(editForm);
        setShowEditModal(false);
        showSuccessModal('Profile Updated', 'Doctor profile updated successfully!');
      } else {
        showErrorModal('Update Failed', response.message || 'Failed to update doctor profile');
      }
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      showErrorModal('Update Failed', 'An error occurred while updating the doctor profile');
    }
  };

  const handleCancel = () => {
    // Reset edit form to original doctor data
    setEditForm({
      ...doctor,
      doctor_name: doctor.doctor_name || doctor.name || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      address: doctor.address || '',
      city: doctor.city || '',
      state: doctor.state || '',
      zipCode: doctor.zipCode || '',
      bio: doctor.bio || '',
      specialization: doctor.specialization || '',
      experience_years: doctor.experience_years || 0,
      education: doctor.education || '',
      appointment_amount: doctor.appointment_amount || '0.00'
    });
    setShowEditModal(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleEditSection = (section) => {
    setActiveEditSection(section);
    setEditForm(doctor);
    setShowEditModal(true);
  };

  const handleAddSpecialty = async () => {
    if (newSpecialty.trim()) {
      try {
        const newSpecialtyObj = { name: newSpecialty.trim() };
        const updatedSpecialties = [...(clinic.specialties || []), newSpecialtyObj];
        
        // Import the clinic API service
        const clinicAPI = await import('../../services/clinicApiService');
        
        const response = await clinicAPI.default.updateSpecialties(updatedSpecialties);
        
        if (response.success) {
          setClinic(prev => ({
            ...prev,
            specialties: updatedSpecialties
          }));
          setNewSpecialty('');
          setShowSpecialtyModal(false);
        } else {
          alert(`Failed to add specialty: ${response.message}`);
        }
      } catch (error) {
        console.error('Error adding specialty:', error);
        alert('An error occurred while adding the specialty');
      }
    }
  };

  const handleRemoveSpecialty = async (index) => {
    try {
      const updatedSpecialties = (clinic.specialties || []).filter((_, i) => i !== index);
      
      // Import the clinic API service
      const clinicAPI = await import('../../services/clinicApiService');
      
      const response = await clinicAPI.default.updateSpecialties(updatedSpecialties);
      
      if (response.success) {
        setClinic(prev => ({
          ...prev,
          specialties: updatedSpecialties
        }));
      } else {
        alert(`Failed to remove specialty: ${response.message}`);
      }
    } catch (error) {
      console.error('Error removing specialty:', error);
      alert('An error occurred while removing the specialty');
    }
  };



  const handleContactUpdate = (field, value) => {
    setClinic(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleSaveContact = async () => {
    try {
      const clinicAPI = await import('../../services/clinicApiService');
      
      const response = await clinicAPI.default.updateContactInfo(clinic.contactInfo);
      
      if (response.success) {
        setShowContactModal(false);
        alert('Contact information updated successfully!');
      } else {
        alert(`Update failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert('An error occurred while updating contact information');
    }
  };

  const handleAddressUpdate = (field, value) => {
    setClinic(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSaveAddress = async () => {
    try {
      const clinicAPI = await import('../../services/clinicApiService');
      
      const addressData = {
        address: clinic.address,
        city: clinic.city,
        state: clinic.state,
        zipCode: clinic.zipCode,
        country: clinic.country
      };
      
      const response = await clinicAPI.default.updateAddress(addressData);
      
      if (response.success) {
        setShowAddressModal(false);
        alert('Address updated successfully!');
      } else {
        alert(`Update failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('An error occurred while updating address');
    }
  };

  const handleOperatingHoursUpdate = (day, field, value) => {
    setWorkingHoursForm(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveOperatingHours = async () => {
    setUpdatingWorkingHours(true);
    try {
      // Since there's no working hours update endpoint in the doctor app yet,
      // we'll just update the local state for now
      const workingHoursArray = Object.values(workingHoursForm).map(dayData => ({
        day_of_week: dayData.day_of_week,
        opening_time: dayData.opening_time,
        closing_time: dayData.closing_time,
        is_available: dayData.is_available
      }));
      
      // Update local state
      setWorkingHours(workingHoursArray);
      setDoctor(prev => ({
        ...prev,
        operatingHours: workingHoursArray
      }));
      
      setShowOperatingHoursModal(false);
      showSuccessModal('Working Hours Updated', 'Doctor working hours have been updated successfully! (Note: This is saved locally until the backend endpoint is available)');
      
    } catch (error) {
      console.error('Error updating operating hours:', error);
      showErrorModal('Update Failed', 'An error occurred while updating working hours');
    } finally {
      setUpdatingWorkingHours(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p style={{ color: COLORS.textMuted }}>Loading doctor profile...</p>
        </div>
      </div>
    );
  }


  if (!doctor && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.background }}>
        <div className="text-center max-w-md">
          <FaUserMd className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.textMuted }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
            {error ? 'Error Loading Doctor Profile' : 'No Data Available'}
          </h2>
          <p style={{ color: COLORS.textMuted }} className="mb-6">
            {error || 'No doctor profile data is available at the moment.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fetchDoctorProfile()}
              className="px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              style={{ background: COLORS.primary, color: COLORS.white }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              style={{ 
                background: COLORS.white, 
                color: COLORS.text,
                border: `1px solid ${COLORS.border}` 
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUserMd },
    { id: 'qualifications', label: 'Qualifications', icon: FaCertificate },
    { id: 'schedule', label: 'Schedule', icon: FaClock },
    { id: 'contact', label: 'Contact', icon: FaPhone },
    { id: 'reviews', label: 'Reviews', icon: FaStar },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-1 px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors duration-200 hover:shadow-sm text-sm sm:text-base"
            style={{ 
              background: COLORS.white, 
              color: COLORS.text,
              border: `1px solid ${COLORS.border}` 
            }}
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Topbar - Clinic Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              {/* Clinic Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Profile Image */}
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto sm:mx-0"
                  style={{ 
                    background: `${COLORS.primary}1A`, 
                    color: COLORS.primary,
                    border: `2px solid ${COLORS.primary}33` 
                  }}
                >
                  <FaUserMd size={24} />
                </div>
                
                {/* Name and Basic Info */}
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
                    Dr. {doctor.doctor_name || doctor.name || 'Doctor Name'}
                  </h1>
                  <p className="text-base sm:text-lg mb-2" style={{ color: COLORS.textMuted }}>
                    {doctor.specialization || 'Specialist'} • {doctor.experience_years || 0} years experience
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      <FaCheckCircle className="w-3 h-3" />
                      Available
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaStar className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.warning }} />
                      {doctor.rating || 0}/5.0
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      <span className="hidden sm:inline">${doctor.appointment_amount || '0'}/consultation</span>
                      <span className="sm:hidden">${doctor.appointment_amount || '0'}</span>
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaUsers className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      <span className="hidden sm:inline">{doctor.totalPatients || 0} patients</span>
                      <span className="sm:hidden">{doctor.totalPatients || 0}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 text-xs sm:text-sm order-3 lg:order-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate">{doctor.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate">{doctor.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate max-w-[200px] sm:max-w-xs">{doctor.location || doctor.address || 'N/A'}</span>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex-shrink-0 order-2 lg:order-3">
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm text-sm sm:text-base"
                  style={{ background: COLORS.primary, color: COLORS.white }}
                >
                  <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-2 sm:px-4 lg:px-6 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    title={tab.label}
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 lg:p-6">
              {activeTab === 'overview' && (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Professional Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 lg:p-6 border border-blue-100">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaHospital className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      About {doctor.clinic_name || doctor.doctor_name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {doctor.bio || 'No description available.'}
                    </p>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-3 lg:p-4 relative">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold flex items-center gap-2 text-xs sm:text-sm lg:text-base" style={{ color: COLORS.text }}>
                          <FaStethoscope className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                          Specialties
                        </h4>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setShowSpecialtyModal(true)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Add Specialty"
                          >
                            <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(doctor.specialties || []).map((specialty, index) => (
                          <span
                            key={specialty.id || index}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: '#E3F2FD', 
                              color: '#1976D2' 
                            }}
                          >
                            {typeof specialty === 'string' ? specialty : specialty.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 relative">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                          <FaCertificate className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                          Qualifications
                        </h4>
                        <button
                          onClick={() => setShowQualificationModal(true)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Manage Qualifications"
                        >
                          <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {doctor && doctor.additional_qualification ? (
                          <>
                            {/* Education */}
                            {doctor.education && (
                              <div className="flex items-center space-x-2">
                                <FaCertificate size={14} style={{ color: COLORS.success }} />
                                <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                                  Education: {doctor.education}
                                </span>
                              </div>
                            )}
                            
                            {/* Fellowships */}
                            {doctor.additional_qualification.fellowships && doctor.additional_qualification.fellowships.map((fellowship, index) => (
                              <div key={`fellowship-${index}`} className="flex items-center space-x-2">
                                <FaAward size={14} style={{ color: COLORS.info }} />
                                <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                                  Fellowship: {fellowship}
                                </span>
                              </div>
                            ))}
                            
                            {/* Certifications */}
                            {doctor.additional_qualification.certifications && doctor.additional_qualification.certifications.map((certification, index) => (
                              <div key={`certification-${index}`} className="flex items-center space-x-2">
                                <FaCertificate size={14} style={{ color: COLORS.warning }} />
                                <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                                  Certification: {certification}
                                </span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center py-2">
                            <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>No qualifications added yet</span>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>
                </div>
              )}


              {activeTab === 'schedule' && (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Operating Hours */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaClock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Operating Hours
                      </h3>
                      <button
                        onClick={() => setShowOperatingHoursModal(true)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit Operating Hours"
                      >
                        <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {loadingWorkingHours ? (
                        <div className="col-span-full flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: COLORS.primary }}></div>
                          <span className="ml-2 text-sm" style={{ color: COLORS.textMuted }}>Loading working hours...</span>
                        </div>
                      ) : workingHours.length > 0 ? (
                        workingHours.map((workingHour, index) => (
                          <div key={workingHour.id || workingHour.pk || index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="font-medium capitalize text-xs sm:text-sm" style={{ color: COLORS.text }}>
                                {workingHour.day || workingHour.day_name || 'Day'}
                              </span>
                              {workingHour.available ? (
                                <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.success }} />
                              ) : (
                                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.danger }} />
                              )}
                            </div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                              {workingHour.available ? `${workingHour.start_time || workingHour.start} - ${workingHour.end_time || workingHour.end}` : 'Not Available'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-4">
                          <span className="text-sm" style={{ color: COLORS.textMuted }}>No working hours set</span>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                          <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                          Contact Information
                        </h3>
                        <button
                          onClick={() => setShowContactModal(true)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Edit Contact Information"
                        >
                          <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <FaPhone size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>General</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{doctor.phone || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaCalendarAlt size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Appointments</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{doctor.phone || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaEnvelope size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Email</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{doctor.email || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaGlobe size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Website</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{doctor.website || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                          <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                          Address
                        </h3>
                        <button
                          onClick={() => setShowAddressModal(true)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Edit Address Information"
                        >
                          <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                        </button>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                        <div className="flex items-start space-x-3">
                          <FaMapMarkerAlt size={16} style={{ color: COLORS.primary }} className="mt-1" />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>{doctor.clinic_name || doctor.doctor_name}</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                              {doctor.address || 'N/A'}<br />
                              {doctor.location || doctor.city || 'N/A'}<br />
                              {doctor.country || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
                      {doctor.rating || 0}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          style={{ color: star <= Math.floor(doctor.rating || 0) ? '#F59E0B' : COLORS.border }}
                        />
                      ))}
                    </div>
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>
                      Based on {doctor.totalReviews || 0} reviews
                    </p>
                  </div>

                  <div className="text-center py-8">
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>
                      Reviews feature coming soon...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-1 sm:p-2 lg:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  {activeEditSection === 'basic' && 'Edit Basic Information'}
                  {activeEditSection === 'contact' && 'Edit Contact Information'}
                  {!activeEditSection && 'Edit Clinic Profile'}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Update clinic information and details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
              {activeEditSection === 'basic' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Clinic Name</label>
                      <input
                        type="text"
                        value={editForm.clinic_name || editForm.name || ''}
                        onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Clinic Type</label>
                      <input
                        type="text"
                        value={editForm.type || ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Phone</label>
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Email</label>
                      <input
                        type="text"
                        value={editForm.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Address</label>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>City</label>
                      <input
                        type="text"
                        value={editForm.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>State</label>
                      <input
                        type="text"
                        value={editForm.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>ZIP Code</label>
                      <input
                        type="text"
                        value={editForm.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: '#ffffff',
                          border: '2px solid #ECEEF2',
                          color: '#111827',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0F1ED1';
                          e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ECEEF2';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm resize-none border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </>
              )}





              {!activeEditSection && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Clinic Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Clinic Type</label>
                      <input
                        type="text"
                        value={editForm.type || ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Phone</label>
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Email</label>
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Address</label>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>City</label>
                      <input
                        type="text"
                        value={editForm.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>State</label>
                      <input
                        type="text"
                        value={editForm.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>ZIP Code</label>
                      <input
                        type="text"
                        value={editForm.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Form Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specialty Modal */}
      {showSpecialtyModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowSpecialtyModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  Manage Specialties
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Add or remove clinic specialties
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecialtyModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Existing Specialties */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#111827' }}>Current Specialties</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(clinic.specialties || []).map((specialty, index) => (
                    <span
                      key={specialty.id || index}
                      className="px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 group"
                      style={{ 
                        backgroundColor: '#E3F2FD', 
                        color: '#1976D2',
                        border: `1px solid #1976D233` 
                      }}
                    >
                      {typeof specialty === 'string' ? specialty : specialty.name}
                      <button
                        onClick={() => handleRemoveSpecialty(index)}
                        className="opacity-70 hover:opacity-100 hover:text-red-500 transition-all duration-200"
                        title="Remove specialty"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(clinic.specialties || []).length === 0 && (
                    <p className="text-sm" style={{ color: '#6B7280' }}>No specialties added yet</p>
                  )}
                </div>
              </div>

              {/* Add New Specialty */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Add New Specialty</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Enter specialty name..."
                    className="flex-1 px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                  />
                  <button
                    onClick={handleAddSpecialty}
                    disabled={!newSpecialty.trim()}
                    className="px-6 py-3 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: newSpecialty.trim() ? 'linear-gradient(135deg, #0F1ED1, #1B56FD)' : '#6B7280',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (newSpecialty.trim()) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newSpecialty.trim()) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowSpecialtyModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowSpecialtyModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Facilities Modal */}
      {false && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowFacilitiesModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  Manage Medical Facilities
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Add or remove clinic facilities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFacilitiesModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
              {/* Existing Facilities */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#111827' }}>Current Facilities</label>
                <div className="space-y-2">
                  {loadingFacilities ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: '#0F1ED1' }}></div>
                      <span className="ml-2 text-sm" style={{ color: '#6B7280' }}>Loading facilities...</span>
                    </div>
                  ) : facilities.length > 0 ? (
                    facilities.map((facility, index) => (
                      <div
                        key={facility.id || facility.pk || index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        style={{
                          backgroundColor: '#F9FAFB',
                          borderColor: '#ECEEF2',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <FaCheckCircle size={14} style={{ color: '#10B981' }} />
                          <span className="text-sm" style={{ color: '#111827' }}>
                            {typeof facility === 'string' ? facility : (facility.name || facility)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFacility(facility, index)}
                          className="p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                          title="Remove facility"
                        >
                          <FaTimes className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: '#6B7280' }}>No facilities added yet</p>
                  )}
                </div>
              </div>

              {/* Add New Facility */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Add New Facility</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Enter facility name..."
                    className="flex-1 px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFacility()}
                  />
                  <button
                    onClick={handleAddFacility}
                    disabled={!newFacility.trim() || addingFacility}
                    className="px-6 py-3 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: (newFacility.trim() && !addingFacility) ? 'linear-gradient(135deg, #0F1ED1, #1B56FD)' : '#6B7280',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (newFacility.trim() && !addingFacility) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newFacility.trim() && !addingFacility) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {addingFacility ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowFacilitiesModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowFacilitiesModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                Done
              </button>
            </div>
          </div>
          
          {/* Loading Overlay */}
          <LoadingOverlay isLoading={addingFacility} />
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '80vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  Edit Contact Information
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Update clinic contact details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>General Contact</label>
                  <input
                    type="text"
                    value={clinic.contactInfo?.general || ''}
                    onChange={(e) => handleContactUpdate('general', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Appointments</label>
                  <input
                    type="text"
                    value={clinic.contactInfo?.appointment || ''}
                    onChange={(e) => handleContactUpdate('appointment', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Emergency</label>
                  <input
                    type="text"
                    value={clinic.contactInfo?.emergency || ''}
                    onChange={(e) => handleContactUpdate('emergency', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Billing</label>
                  <input
                    type="text"
                    value={clinic.contactInfo?.billing || ''}
                    onChange={(e) => handleContactUpdate('billing', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveContact}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
          
          {/* Loading Overlay */}
          <LoadingOverlay isLoading={updatingWorkingHours} />
        </div>
      )}


      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '80vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  Edit Address Information
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Update clinic address details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Street Address</label>
                  <input
                    type="text"
                    value={clinic.address}
                    onChange={(e) => handleAddressUpdate('address', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>City</label>
                  <input
                    type="text"
                    value={clinic.city || ''}
                    onChange={(e) => handleAddressUpdate('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>State/Province</label>
                  <input
                    type="text"
                    value={clinic.state || ''}
                    onChange={(e) => handleAddressUpdate('state', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={clinic.zipCode || ''}
                    onChange={(e) => handleAddressUpdate('zipCode', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Country</label>
                  <input
                    type="text"
                    value={clinic.country || ''}
                    onChange={(e) => handleAddressUpdate('country', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAddress}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operating Hours Modal */}
      {showOperatingHoursModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowOperatingHoursModal(false)}
        >
          <div
            className="w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '80vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  Edit Operating Hours
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Update clinic operating hours for each day
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOperatingHoursModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(workingHoursForm).map(([day, hours]) => (
                  <div
                    key={day}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderColor: '#ECEEF2',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold capitalize" style={{ color: '#111827' }}>
                        {day}
                      </h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hours.is_available}
                          onChange={(e) => handleOperatingHoursUpdate(day, 'is_available', e.target.checked)}
                          className="w-4 h-4 rounded border-2 transition-all"
                          style={{
                            borderColor: '#ECEEF2',
                            accentColor: '#0F1ED1',
                          }}
                        />
                        <span className="text-sm" style={{ color: '#6B7280' }}>Available</span>
                      </label>
                    </div>
                    
                    {hours.is_available && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Opening Time</label>
                          <input
                            type="time"
                            value={hours.opening_time}
                            onChange={(e) => handleOperatingHoursUpdate(day, 'opening_time', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg transition-all text-sm border-2"
                            style={{
                              background: '#ffffff',
                              border: '2px solid #ECEEF2',
                              color: '#111827',
                              outline: 'none',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#0F1ED1';
                              e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#ECEEF2';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Closing Time</label>
                          <input
                            type="time"
                            value={hours.closing_time}
                            onChange={(e) => handleOperatingHoursUpdate(day, 'closing_time', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg transition-all text-sm border-2"
                            style={{
                              background: '#ffffff',
                              border: '2px solid #ECEEF2',
                              color: '#111827',
                              outline: 'none',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#0F1ED1';
                              e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#ECEEF2';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {!hours.is_available && (
                      <div className="text-center py-4">
                        <p className="text-sm" style={{ color: '#6B7280' }}>Not Available</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowOperatingHoursModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOperatingHours}
                disabled={updatingWorkingHours}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: updatingWorkingHours ? '#6B7280' : 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!updatingWorkingHours) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow =
                      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!updatingWorkingHours) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {updatingWorkingHours ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}


      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onClose={closeResultModal}
      />
    </div>
  );
};

export default DoctorProfile;
