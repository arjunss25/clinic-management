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
} from 'react-icons/fa';

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

const ClinicProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeEditSection, setActiveEditSection] = useState('');
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [showAccreditationModal, setShowAccreditationModal] = useState(false);
  const [newAccreditation, setNewAccreditation] = useState('');
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);
  const [newFacility, setNewFacility] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOperatingHoursModal, setShowOperatingHoursModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');

  // Sample clinic data - In real app, this would come from API
  const clinicData = {
    id: 'CLINIC-2024-001',
    name: 'MedCare General Hospital',
    type: 'Multi-Specialty Hospital',
    established: '2010',
    licenseNumber: 'HOSP-2024-001',
    phone: '+1 (555) 123-4567',
    email: 'info@medcarehospital.com',
    website: 'www.medcarehospital.com',
    address: '123 Medical Center Drive, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    description: 'MedCare General Hospital is a leading multi-specialty healthcare facility providing comprehensive medical services with state-of-the-art technology and experienced medical professionals.',
    specialties: [
      'Cardiology',
      'Orthopedics',
      'Neurology',
      'Oncology',
      'Pediatrics',
      'Emergency Medicine',
      'General Surgery',
      'Internal Medicine'
    ],
    facilities: [
      '24/7 Emergency Services',
      'ICU & CCU',
      'Operation Theaters',
      'Diagnostic Imaging',
      'Laboratory Services',
      'Pharmacy',
      'Ambulance Services',
      'Patient Rooms',
      'Cafeteria',
      'Parking'
    ],
    amenities: [
      'Free WiFi',
      'Wheelchair Accessible',
      'Parking Available',
      'Credit Card Accepted',
      'Insurance Accepted',
      'Online Booking',
      'Telemedicine Services'
    ],
    operatingHours: {
      monday: { start: '08:00', end: '20:00', available: true },
      tuesday: { start: '08:00', end: '20:00', available: true },
      wednesday: { start: '08:00', end: '20:00', available: true },
      thursday: { start: '08:00', end: '20:00', available: true },
      friday: { start: '08:00', end: '20:00', available: true },
      saturday: { start: '09:00', end: '18:00', available: true },
      sunday: { start: '09:00', end: '16:00', available: true },
    },
    emergencyHours: '24/7',
    totalDoctors: 45,
    totalPatients: 8500,
    totalStaff: 120,
    totalBeds: 150,
    rating: 4.7,
    totalReviews: 1250,
    accreditation: [
      'Joint Commission Accreditation',
      'ISO 9001:2015 Certified',
      'American Hospital Association Member'
    ],
    insurance: [
      'Blue Cross Blue Shield',
      'Aetna',
      'Cigna',
      'UnitedHealth Group',
      'Medicare',
      'Medicaid'
    ],
    paymentMethods: [
      'Cash',
      'Credit Card',
      'Debit Card',
      'Insurance',
      'Online Payment'
    ],
    statistics: {
      patientsPerMonth: 2500,
      surgeriesPerMonth: 150,
      emergencyCases: 300,
      outpatientVisits: 1800
    },
    achievements: [
      'Best Hospital Award 2023 - New York Medical Association',
      'Excellence in Patient Care 2022',
      'Top 10 Hospitals in New York State 2023',
      'Green Hospital Certification 2023'
    ],
    contactInfo: {
      emergency: '+1 (555) 999-8888',
      appointment: '+1 (555) 123-4567',
      billing: '+1 (555) 123-4568',
      general: '+1 (555) 123-4569'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClinic(clinicData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setActiveEditSection('basic');
    setEditForm(clinic);
    setShowEditModal(true);
  };

  const handleSave = () => {
    setClinic(editForm);
    setShowEditModal(false);
    // In real app, make API call to update clinic data
  };

  const handleCancel = () => {
    setEditForm(clinic);
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
    setEditForm(clinic);
    setShowEditModal(true);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setClinic(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
      setShowSpecialtyModal(false);
    }
  };

  const handleRemoveSpecialty = (index) => {
    setClinic(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const handleAddAccreditation = () => {
    if (newAccreditation.trim()) {
      setClinic(prev => ({
        ...prev,
        accreditation: [...prev.accreditation, newAccreditation.trim()]
      }));
      setNewAccreditation('');
      setShowAccreditationModal(false);
    }
  };

  const handleRemoveAccreditation = (index) => {
    setClinic(prev => ({
      ...prev,
      accreditation: prev.accreditation.filter((_, i) => i !== index)
    }));
  };

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setClinic(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
      setShowFacilitiesModal(false);
    }
  };

  const handleRemoveFacility = (index) => {
    setClinic(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
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

  const handleAddressUpdate = (field, value) => {
    setClinic(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleOperatingHoursUpdate = (day, field, value) => {
    setClinic(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setClinic(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
      setShowAmenitiesModal(false);
    }
  };

  const handleRemoveAmenity = (index) => {
    setClinic(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p style={{ color: COLORS.textMuted }}>Loading clinic profile...</p>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.background }}>
        <div className="text-center max-w-md">
          <FaHospital className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.textMuted }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>Clinic Not Found</h2>
          <p style={{ color: COLORS.textMuted }}>The requested clinic profile could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{ background: COLORS.primary, color: COLORS.white }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaHospital },
    { id: 'facilities', label: 'Facilities', icon: FaBuilding },
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
                  <FaHospital size={24} />
                </div>
                
                {/* Name and Basic Info */}
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
                    {clinic.name}
                  </h1>
                  <p className="text-base sm:text-lg mb-2" style={{ color: COLORS.textMuted }}>
                    {clinic.type} • Established {clinic.established}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      <FaCheckCircle className="w-3 h-3" />
                      Active
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaStar className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.warning }} />
                      {clinic.rating}/5.0
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaUserMd className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      <span className="hidden sm:inline">{clinic.totalDoctors} doctors</span>
                      <span className="sm:hidden">{clinic.totalDoctors}</span>
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaUsers className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      <span className="hidden sm:inline">{clinic.totalPatients} patients</span>
                      <span className="sm:hidden">{clinic.totalPatients}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 text-xs sm:text-sm order-3 lg:order-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate">{clinic.phone}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate">{clinic.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate max-w-[200px] sm:max-w-xs">{clinic.address}</span>
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
                      About {clinic.name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {clinic.description}
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
                        {clinic.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: '#E3F2FD', 
                              color: '#1976D2' 
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 relative">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                          <FaCertificate className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                          Accreditations
                        </h4>
                        <button
                          onClick={() => setShowAccreditationModal(true)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Manage Accreditations"
                        >
                          <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {clinic.accreditation.map((acc, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <FaCertificate size={14} style={{ color: COLORS.success }} />
                            <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{acc}</span>
                          </div>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Medical Facilities */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Medical Facilities
                      </h3>
                      <button
                        onClick={() => setShowFacilitiesModal(true)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="Manage Facilities"
                      >
                        <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {clinic.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                          <FaCheckCircle size={16} style={{ color: COLORS.success }} />
                          <span className="text-xs sm:text-sm font-medium" style={{ color: COLORS.text }}>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patient Amenities */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Patient Amenities
                      </h3>
                      <button
                        onClick={() => setShowAmenitiesModal(true)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="Manage Amenities"
                      >
                        <FaEdit className="w-3 h-3" style={{ color: COLORS.primary }} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {clinic.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                          <FaCheckCircle size={16} style={{ color: COLORS.success }} />
                          <span className="text-xs sm:text-sm font-medium" style={{ color: COLORS.text }}>{amenity}</span>
                        </div>
                      ))}
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
                      {Object.entries(clinic.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center justify-between p-2 sm:p-3 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="font-medium capitalize text-xs sm:text-sm" style={{ color: COLORS.text }}>{day}</span>
                            {hours.available ? (
                              <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.success }} />
                            ) : (
                              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.danger }} />
                            )}
                          </div>
                          <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                            {hours.available ? `${hours.start} - ${hours.end}` : 'Not Available'}
                          </div>
                        </div>
                      ))}
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
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{clinic.contactInfo.general}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaCalendarAlt size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Appointments</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{clinic.contactInfo.appointment}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaEnvelope size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Email</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{clinic.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaGlobe size={16} style={{ color: COLORS.primary }} />
                          <div>
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Website</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{clinic.website}</div>
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
                            <div className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>{clinic.name}</div>
                            <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                              {clinic.address}<br />
                              {clinic.city}, {clinic.state} {clinic.zipCode}<br />
                              {clinic.country}
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
                      {clinic.rating}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          style={{ color: star <= Math.floor(clinic.rating) ? '#F59E0B' : COLORS.border }}
                        />
                      ))}
                    </div>
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>
                      Based on {clinic.totalReviews} reviews
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
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
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
                  {clinic.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 group"
                      style={{ 
                        backgroundColor: '#E3F2FD', 
                        color: '#1976D2',
                        border: `1px solid #1976D233` 
                      }}
                    >
                      {specialty}
                      <button
                        onClick={() => handleRemoveSpecialty(index)}
                        className="opacity-70 hover:opacity-100 hover:text-red-500 transition-all duration-200"
                        title="Remove specialty"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {clinic.specialties.length === 0 && (
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

      {/* Accreditation Modal */}
      {showAccreditationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowAccreditationModal(false)}
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
                  Manage Accreditations
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Add or remove clinic accreditations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAccreditationModal(false)}
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
              {/* Existing Accreditations */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#111827' }}>Current Accreditations</label>
                <div className="space-y-2">
                  {clinic.accreditation.map((acc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderColor: '#ECEEF2',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaCertificate size={14} style={{ color: '#10B981' }} />
                        <span className="text-sm" style={{ color: '#111827' }}>{acc}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAccreditation(index)}
                        className="p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                        title="Remove accreditation"
                      >
                        <FaTimes className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                  {clinic.accreditation.length === 0 && (
                    <p className="text-sm" style={{ color: '#6B7280' }}>No accreditations added yet</p>
                  )}
                </div>
              </div>

              {/* Add New Accreditation */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Add New Accreditation</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAccreditation}
                    onChange={(e) => setNewAccreditation(e.target.value)}
                    placeholder="Enter accreditation name..."
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAccreditation()}
                  />
                  <button
                    onClick={handleAddAccreditation}
                    disabled={!newAccreditation.trim()}
                    className="px-6 py-3 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: newAccreditation.trim() ? 'linear-gradient(135deg, #0F1ED1, #1B56FD)' : '#6B7280',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (newAccreditation.trim()) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newAccreditation.trim()) {
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
                onClick={() => setShowAccreditationModal(false)}
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
                onClick={() => setShowAccreditationModal(false)}
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
      {showFacilitiesModal && (
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
                  {clinic.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderColor: '#ECEEF2',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaCheckCircle size={14} style={{ color: '#10B981' }} />
                        <span className="text-sm" style={{ color: '#111827' }}>{facility}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFacility(index)}
                        className="p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                        title="Remove facility"
                      >
                        <FaTimes className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                  {clinic.facilities.length === 0 && (
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
                    disabled={!newFacility.trim()}
                    className="px-6 py-3 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: newFacility.trim() ? 'linear-gradient(135deg, #0F1ED1, #1B56FD)' : '#6B7280',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (newFacility.trim()) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newFacility.trim()) {
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
                    value={clinic.contactInfo.general}
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
                    value={clinic.contactInfo.appointment}
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
                    value={clinic.contactInfo.emergency}
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
                    value={clinic.contactInfo.billing}
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
                onClick={() => setShowContactModal(false)}
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

      {/* Amenities Modal */}
      {showAmenitiesModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowAmenitiesModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
                  Manage Patient Amenities
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Add or remove patient amenities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAmenitiesModal(false)}
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
              {/* Existing Amenities */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#111827' }}>Current Amenities</label>
                <div className="space-y-2">
                  {clinic.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderColor: '#ECEEF2',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaCheckCircle size={14} style={{ color: '#10B981' }} />
                        <span className="text-sm" style={{ color: '#111827' }}>{amenity}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAmenity(index)}
                        className="p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                        title="Remove amenity"
                      >
                        <FaTimes className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                  {clinic.amenities.length === 0 && (
                    <p className="text-sm" style={{ color: '#6B7280' }}>No amenities added yet</p>
                  )}
                </div>
              </div>

              {/* Add New Amenity */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Add New Amenity</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Enter amenity name..."
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                  />
                  <button
                    onClick={handleAddAmenity}
                    disabled={!newAmenity.trim()}
                    className="px-6 py-3 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: newAmenity.trim() ? 'linear-gradient(135deg, #0F1ED1, #1B56FD)' : '#6B7280',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (newAmenity.trim()) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newAmenity.trim()) {
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
                onClick={() => setShowAmenitiesModal(false)}
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
                onClick={() => setShowAmenitiesModal(false)}
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
                    value={clinic.city}
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
                    value={clinic.state}
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
                    value={clinic.zipCode}
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
                    value={clinic.country}
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
                onClick={() => setShowAddressModal(false)}
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
                {Object.entries(clinic.operatingHours).map(([day, hours]) => (
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
                          checked={hours.available}
                          onChange={(e) => handleOperatingHoursUpdate(day, 'available', e.target.checked)}
                          className="w-4 h-4 rounded border-2 transition-all"
                          style={{
                            borderColor: '#ECEEF2',
                            accentColor: '#0F1ED1',
                          }}
                        />
                        <span className="text-sm" style={{ color: '#6B7280' }}>Available</span>
                      </label>
                    </div>
                    
                    {hours.available && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>Start Time</label>
                          <input
                            type="time"
                            value={hours.start}
                            onChange={(e) => handleOperatingHoursUpdate(day, 'start', e.target.value)}
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
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>End Time</label>
                          <input
                            type="time"
                            value={hours.end}
                            onChange={(e) => handleOperatingHoursUpdate(day, 'end', e.target.value)}
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
                    
                    {!hours.available && (
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
                onClick={() => setShowOperatingHoursModal(false)}
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
    </div>
  );
};

export default ClinicProfile;
