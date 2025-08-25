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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.background }}>
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8" style={{ background: COLORS.background }}>
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
                      {clinic.totalStaff} staff
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaBuilding className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      {clinic.totalBeds} beds
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
              <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Professional Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaHospital className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      About {clinic.name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {clinic.description}
                    </p>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                        <FaStethoscope className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {clinic.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: COLORS.gray50, color: COLORS.primary }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                        <FaCertificate className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                        Accreditations
                      </h4>
                      <div className="space-y-2">
                        {clinic.accreditation.map((acc, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <FaCertificate size={14} style={{ color: COLORS.success }} />
                            <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>{acc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                      <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                        <FaChartLine className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                        Monthly Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                          <div className="text-lg font-bold" style={{ color: COLORS.primary }}>
                            {clinic.statistics.patientsPerMonth}
                          </div>
                          <div className="text-xs" style={{ color: COLORS.textMuted }}>Patients</div>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                          <div className="text-lg font-bold" style={{ color: COLORS.primary }}>
                            {clinic.statistics.surgeriesPerMonth}
                          </div>
                          <div className="text-xs" style={{ color: COLORS.textMuted }}>Surgeries</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Medical Facilities */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Medical Facilities
                    </h3>
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
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Patient Amenities
                    </h3>
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
                <div className="space-y-4 sm:space-y-6">
                  {/* Operating Hours */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaClock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Operating Hours
                    </h3>
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

                  {/* Emergency Services */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaAmbulance className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Emergency Services
                    </h3>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                      <div className="flex items-center space-x-3">
                        <FaAmbulance size={20} style={{ color: COLORS.danger }} />
                        <div>
                          <div className="font-semibold text-sm sm:text-base" style={{ color: COLORS.text }}>24/7 Emergency Services</div>
                          <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                            Emergency Contact: {clinic.contactInfo.emergency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Contact Information
                      </h3>
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
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Address
                      </h3>
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

                  {/* Insurance & Payment */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaDollarSign className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Insurance & Payment
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base" style={{ color: COLORS.text }}>Accepted Insurance</h4>
                        <div className="flex flex-wrap gap-2">
                          {clinic.insurance.map((ins, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded text-xs"
                              style={{ backgroundColor: COLORS.gray50, color: COLORS.textMuted }}
                            >
                              {ins}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base" style={{ color: COLORS.text }}>Payment Methods</h4>
                        <div className="flex flex-wrap gap-2">
                          {clinic.paymentMethods.map((method, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded text-xs"
                              style={{ backgroundColor: COLORS.gray50, color: COLORS.textMuted }}
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4 sm:space-y-6">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.4)' }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold" style={{ color: COLORS.text }}>
                Edit Clinic Profile
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
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
                    value={editForm.email || ''}
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

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.specialties?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('specialties', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 sm:px-4 py-2 text-white rounded-lg font-medium text-sm"
                style={{ background: COLORS.primary }}
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
