import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clinicAPI from '../../services/clinicApiService';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ResultModal from '../../components/common/ResultModal';
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaTint,
  FaUserFriends,
  FaEye,
  FaPlus,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

// Theme colors (matching Appointments.jsx)
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
};

// Sample patient data - Move to constants file in real app
const SAMPLE_PATIENTS = [
  {
    id: 'PAT-2024-001',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    lastVisit: '15 Mar 2024',
    status: 'Active',
    bloodGroup: 'O+',
    emergencyContact: 'Sarah Doe (Wife)',
  },
  {
    id: 'PAT-2024-002',
    name: 'Jane Smith',
    age: 28,
    gender: 'Female',
    phone: '+1 (555) 234-5678',
    email: 'jane.smith@email.com',
    lastVisit: '12 Mar 2024',
    status: 'Active',
    bloodGroup: 'A+',
    emergencyContact: 'Mike Smith (Husband)',
  },
  {
    id: 'PAT-2024-003',
    name: 'Robert Johnson',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 345-6789',
    email: 'robert.johnson@email.com',
    lastVisit: '10 Mar 2024',
    status: 'Active',
    bloodGroup: 'B+',
    emergencyContact: 'Lisa Johnson (Sister)',
  },
  {
    id: 'PAT-2024-004',
    name: 'Emily Davis',
    age: 32,
    gender: 'Female',
    phone: '+1 (555) 456-7890',
    email: 'emily.davis@email.com',
    lastVisit: '08 Mar 2024',
    status: 'Active',
    bloodGroup: 'AB+',
    emergencyContact: 'David Davis (Brother)',
  },
  {
    id: 'PAT-2024-005',
    name: 'Michael Wilson',
    age: 52,
    gender: 'Male',
    phone: '+1 (555) 567-8901',
    email: 'michael.wilson@email.com',
    lastVisit: '05 Mar 2024',
    status: 'Active',
    bloodGroup: 'O-',
    emergencyContact: 'Jennifer Wilson (Daughter)',
  },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const FILTER_OPTIONS = [
  { value: 'all', label: 'All Patients' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'recent', label: 'Recent Visits' },
];

// Initial form state (matching API structure)
const INITIAL_PATIENT_STATE = {
  full_name: '',
  age: '',
  gender: '',
  phone_number: '',
  email: '',
  blood_group: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  address: '',
  known_allergies: '',
};

// Custom hooks for form management
const usePatientForm = () => {
  const [newPatient, setNewPatient] = useState(INITIAL_PATIENT_STATE);
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModal, setResultModal] = useState({ type: '', title: '', message: '' });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddAllergy = useCallback(() => {
    if (newAllergy.trim()) {
      setAllergies(prev => [...prev, newAllergy.trim()]);
      setNewAllergy('');
    }
  }, [newAllergy]);

  const handleRemoveAllergy = useCallback((index) => {
    setAllergies(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetForm = useCallback(() => {
    setNewPatient(INITIAL_PATIENT_STATE);
    setAllergies([]);
    setNewAllergy('');
    setError(null);
  }, []);

  const showSuccessModal = useCallback((title, message) => {
    setResultModal({ type: 'success', title, message });
    setShowResultModal(true);
  }, []);

  const showErrorModal = useCallback((title, message) => {
    setResultModal({ type: 'error', title, message });
    setShowResultModal(true);
  }, []);

  const closeResultModal = useCallback(() => {
    setShowResultModal(false);
    setResultModal({ type: '', title: '', message: '' });
  }, []);

  return {
    newPatient,
    allergies,
    newAllergy,
    setNewAllergy,
    isLoading,
    setLoading: setIsLoading,
    error,
    setError,
    handleInputChange,
    handleAddAllergy,
    handleRemoveAllergy,
    resetForm,
    showResultModal,
    resultModal,
    showSuccessModal,
    showErrorModal,
    closeResultModal,
  };
};

// Memoized components
const StatusBadge = React.memo(({ status }) => (
  <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
    {status}
  </span>
));

const PatientIcon = React.memo(() => (
  <div
    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0"
    style={{
      background: `${COLORS.primary}1A`,
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}33`,
    }}
  >
    <FaUser className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
  </div>
));

const EmptyState = React.memo(() => (
  <div className="text-center py-8 sm:py-12 px-4">
    <div className="text-base sm:text-lg font-medium mb-2" style={{ color: COLORS.textMuted }}>
      No patients found
    </div>
    <div className="text-sm" style={{ color: COLORS.textMuted }}>
      Try adjusting your search or filter criteria
    </div>
  </div>
));

// Input components for reusability
const FormInput = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  placeholder,
  ...props 
}) => (
  <div>
    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
      {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm border-2"
      style={{
        background: COLORS.white,
        border: `2px solid ${COLORS.border}`,
        color: COLORS.text,
        outline: 'none',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = COLORS.primary;
        e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = COLORS.border;
        e.target.style.boxShadow = 'none';
      }}
      placeholder={placeholder}
      {...props}
    />
  </div>
));

const FormSelect = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false, 
  placeholder = "Select option" 
}) => (
  <div className="relative">
    <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
      {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 rounded-lg transition-all text-sm border-2 appearance-none cursor-pointer"
        style={{
          background: COLORS.white,
          border: `2px solid ${COLORS.border}`,
          color: COLORS.text,
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = COLORS.primary;
          e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = COLORS.border;
          e.target.style.boxShadow = 'none';
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        style={{ color: COLORS.textMuted }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
));

const AllergyTag = React.memo(({ allergy, onRemove, index }) => (
  <div
    className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm"
    style={{
      background: `${COLORS.primary}10`,
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}30`,
    }}
  >
    <span>{allergy}</span>
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: COLORS.white,
        color: COLORS.textMuted,
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#EF4444';
        e.target.style.color = COLORS.white;
      }}
      onMouseLeave={(e) => {
        e.target.style.background = COLORS.white;
        e.target.style.color = COLORS.textMuted;
      }}
    >
      <FaTimes className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
    </button>
  </div>
));

// Mobile Patient Card Component
const MobilePatientCard = React.memo(({ patient, onViewPatient }) => (
  <div
    className="bg-white rounded-lg border p-4 space-y-3"
    style={{ borderColor: COLORS.border }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 flex-1">
        <PatientIcon />
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold truncate" style={{ color: COLORS.text }}>
            {patient.name}
          </div>
          <div className="text-xs text-gray-500">
            ID: {patient.id}
          </div>
          <div className="text-xs text-gray-500">
            {patient.age} years • {patient.gender}
          </div>
        </div>
      </div>
      <StatusBadge status={patient.status} />
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <FaPhone className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.textMuted }} />
        <span className="truncate" style={{ color: COLORS.text }}>
          {patient.phone}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FaEnvelope className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.textMuted }} />
        <span className="truncate" style={{ color: COLORS.textMuted }}>
          {patient.email}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FaTint className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.textMuted }} />
        <span style={{ color: COLORS.text }}>
          Blood: {patient.bloodGroup}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FaCalendarAlt className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.textMuted }} />
        <span style={{ color: COLORS.text }}>
          Last Visit: {patient.lastVisit}
        </span>
      </div>
    </div>
    
    <button 
      onClick={() => onViewPatient(patient)}
      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
      style={{
        background: `${COLORS.primary}1A`,
        color: COLORS.primary,
        border: `1px solid ${COLORS.primary}33`,
      }}
    >
      <FaEye className="w-3 h-3" />
      View Details
    </button>
  </div>
));

// Desktop Patient Row Component

const PatientRow = React.memo(({ patient, onViewPatient }) => (
  <tr 
    className="transition-all duration-200 hover:shadow-sm"
    style={{ 
      background: COLORS.white,
      borderColor: COLORS.border,
    }}
  >
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
      <div className="flex items-center gap-2 sm:gap-3">
        <PatientIcon />
        <div className="min-w-0">
          <div className="text-sm sm:text-base font-semibold truncate" style={{ color: COLORS.text }}>
            {patient.name}
          </div>
          <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
            ID: {patient.id}
          </div>
          <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
            {patient.age} years • {patient.gender}
          </div>
        </div>
      </div>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
          <span className="text-xs sm:text-sm md:text-base truncate" style={{ color: COLORS.text }}>
            {patient.phone}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
          <span className="text-xs sm:text-sm truncate" style={{ color: COLORS.textMuted }}>
            {patient.email}
          </span>
        </div>
      </div>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FaTint className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
          <span className="text-xs sm:text-sm md:text-base" style={{ color: COLORS.text }}>
            Blood: {patient.bloodGroup}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUserFriends className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
          <span className="text-xs sm:text-sm truncate" style={{ color: COLORS.textMuted }}>
            {patient.emergencyContact}
          </span>
        </div>
      </div>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
        <span className="text-xs sm:text-sm md:text-base" style={{ color: COLORS.text }}>
          {patient.lastVisit}
        </span>
      </div>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
      <StatusBadge status={patient.status} />
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
      <button 
        onClick={() => onViewPatient(patient)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition shadow-sm"
        style={{
          background: `${COLORS.primary}1A`,
          color: COLORS.primary,
          border: `1px solid ${COLORS.primary}33`,
        }}
      >
        <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">View</span>
      </button>
    </td>
  </tr>
));

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const {
    newPatient,
    allergies,
    newAllergy,
    setNewAllergy,
    isLoading,
    setLoading,
    error,
    setError,
    handleInputChange,
    handleAddAllergy,
    handleRemoveAllergy,
    resetForm,
    showResultModal,
    resultModal,
    showSuccessModal,
    showErrorModal,
    closeResultModal,
  } = usePatientForm();

  // Memoized filtered patients
  const filteredPatients = useMemo(() => {
    return SAMPLE_PATIENTS.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'all') return matchesSearch;
      if (selectedFilter === 'male') return matchesSearch && patient.gender === 'Male';
      if (selectedFilter === 'female') return matchesSearch && patient.gender === 'Female';
      if (selectedFilter === 'recent') {
        const lastVisitDate = new Date(patient.lastVisit);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && lastVisitDate >= weekAgo;
      }
      return matchesSearch;
    });
  }, [searchTerm, selectedFilter]);

  // Event handlers
  const handleViewPatient = useCallback((patient) => {
    navigate(`/clinic/patients/${patient.id}`);
  }, [navigate]);

  const handleAddPatient = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the payload according to the API specification
      const patientPayload = {
        full_name: newPatient.full_name,
        age: newPatient.age,
        gender: newPatient.gender,
        phone_number: newPatient.phone_number,
        blood_group: newPatient.blood_group,
        emergency_contact_name: newPatient.emergency_contact_name,
        emergency_contact_phone: newPatient.emergency_contact_phone,
        address: newPatient.address,
        known_allergies: allergies.join(', '), // Convert array to comma-separated string
        email: newPatient.email,
      };

      console.log('Registering patient with payload:', patientPayload);
      
      const response = await clinicAPI.registerPatient(patientPayload);
      
      if (response.success) {
        console.log('Patient registered successfully:', response);
        
        // Close add patient modal first
        setShowAddModal(false);
        resetForm();
        
        // Show success modal
        showSuccessModal(
          'Patient Registered Successfully!',
          `${newPatient.full_name} has been successfully added to your patient directory. They can now book appointments.`
        );
      } else {
        console.error('Failed to register patient:', response.message);
        
        // Close add patient modal first
        setShowAddModal(false);
        
        // Show error modal
        showErrorModal(
          'Registration Failed',
          response.message || 'Failed to register patient. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error registering patient:', error);
      
      // Close add patient modal first
      setShowAddModal(false);
      
      // Show error modal
      showErrorModal(
        'Registration Failed',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [newPatient, allergies, resetForm, setLoading, showSuccessModal, showErrorModal]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    resetForm();
  }, [resetForm]);

  const handleAllergyKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAllergy();
    }
  }, [handleAddAllergy]);

  // Close filter dropdown when clicking outside
  const handleClickOutside = useCallback((e) => {
    if (isFilterOpen && !e.target.closest('.filter-dropdown')) {
      setIsFilterOpen(false);
    }
  }, [isFilterOpen]);

  // Add click outside listener
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
          <div className="space-y-1">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
              style={{ color: COLORS.text }}
            >
              Patient Directory
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: COLORS.textMuted }}
            >
              View and manage patient information
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="hidden sm:inline">Active</span>
              </span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: COLORS.secondary }}
                />
                <span className="hidden sm:inline">Recent</span>
              </span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm font-medium transition shadow-sm w-full sm:w-auto justify-center"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                color: COLORS.white,
              }}
            >
              <FaPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div
          className="rounded-xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="p-4 sm:p-6">
            {/* Mobile Search and Filter */}
            <div className="block lg:hidden space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: COLORS.textMuted }}
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition text-sm"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Mobile Filter Toggle */}
              <div className="relative filter-dropdown">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-sm"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FaFilter className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                    <span>Filter: {FILTER_OPTIONS.find(f => f.value === selectedFilter)?.label}</span>
                  </div>
                  {isFilterOpen ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                    {FILTER_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition ${
                          selectedFilter === option.value 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Search and Filter */}
            <div className="hidden lg:flex gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: COLORS.textMuted }}
                />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition text-sm"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="w-48 relative">
                <FaFilter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: COLORS.textMuted }}
                />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition text-sm appearance-none"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                    outline: 'none',
                  }}
                >
                  {FILTER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List/Table */}
        <div
          className="rounded-xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {/* Mobile View - Cards */}
          <div className="block lg:hidden">
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <MobilePatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onViewPatient={handleViewPatient} 
                  />
                ))}
              </div>
              {filteredPatients.length === 0 && <EmptyState />}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <tr>
                  {['Patient Info', 'Contact', 'Medical Info', 'Last Visit', 'Status', 'Actions'].map((header) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ background: COLORS.white, borderColor: COLORS.border }}>
                {filteredPatients.map((patient) => (
                  <PatientRow 
                    key={patient.id} 
                    patient={patient} 
                    onViewPatient={handleViewPatient} 
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && <div className="hidden lg:block"><EmptyState /></div>}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Overlay */}
            <LoadingOverlay 
              isLoading={isLoading}
              title="Registering Patient..."
              message="Please wait while we process your request"
              spinnerSize="xl"
            />
            {/* Modal Header */}
            <div
              className="px-4 sm:px-6 py-4 sm:py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <div>
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: COLORS.text }}>
                  Add New Patient
                </h3>
                <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                  Enter patient information to add them to your directory
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: COLORS.white,
                  color: COLORS.textMuted,
                  border: `1px solid ${COLORS.border}`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `${COLORS.primary}15`;
                  e.target.style.borderColor = COLORS.primary;
                  e.target.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = COLORS.white;
                  e.target.style.borderColor = COLORS.border;
                  e.target.style.color = COLORS.textMuted;
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPatient} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <FormInput
                    label="Full Name"
                    name="full_name"
                    value={newPatient.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter patient's full name"
                  />
                </div>

                <FormInput
                  label="Age"
                  name="age"
                  type="number"
                  value={newPatient.age}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="150"
                  placeholder="Enter age"
                />

                <FormSelect
                  label="Gender"
                  name="gender"
                  value={newPatient.gender}
                  onChange={handleInputChange}
                  options={GENDER_OPTIONS}
                  required
                  placeholder="Select Gender"
                />

                <FormInput
                  label="Phone Number"
                  name="phone_number"
                  type="tel"
                  value={newPatient.phone_number}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={newPatient.email}
                  onChange={handleInputChange}
                  placeholder="patient@email.com"
                />

                <FormSelect
                  label="Blood Group"
                  name="blood_group"
                  value={newPatient.blood_group}
                  onChange={handleInputChange}
                  options={BLOOD_GROUPS}
                  placeholder="Select Blood Group"
                />

                <FormInput
                  label="Emergency Contact Name"
                  name="emergency_contact_name"
                  value={newPatient.emergency_contact_name}
                  onChange={handleInputChange}
                  placeholder="John Doe (Spouse)"
                />

                <FormInput
                  label="Emergency Contact Phone"
                  name="emergency_contact_phone"
                  type="tel"
                  value={newPatient.emergency_contact_phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 987-6543"
                />

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={newPatient.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm resize-none border-2"
                    style={{
                      background: COLORS.white,
                      border: `2px solid ${COLORS.border}`,
                      color: COLORS.text,
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary;
                      e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter patient's full address"
                  />
                </div>

                {/* Allergies Section */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.text }}>
                    Known Allergies
                  </label>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        onKeyPress={handleAllergyKeyPress}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm border-2"
                        style={{
                          background: COLORS.white,
                          border: `2px solid ${COLORS.border}`,
                          color: COLORS.text,
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = COLORS.primary;
                          e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = COLORS.border;
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter allergy (e.g., Penicillin, Peanuts, etc.)"
                      />
                      <button
                        type="button"
                        onClick={handleAddAllergy}
                        disabled={!newAllergy.trim()}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: '#10B981', color: COLORS.white }}
                        onMouseEnter={(e) => !e.target.disabled && (e.target.style.background = '#059669')}
                        onMouseLeave={(e) => !e.target.disabled && (e.target.style.background = '#10B981')}
                      >
                        Add
                      </button>
                    </div>
                    
                    {allergies.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium" style={{ color: COLORS.textMuted }}>
                          Added Allergies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allergies.map((allergy, index) => (
                            <AllergyTag 
                              key={`${allergy}-${index}`}
                              allergy={allergy}
                              index={index}
                              onRemove={handleRemoveAllergy}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `2px solid ${COLORS.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = `${COLORS.textMuted}10`;
                    e.target.style.borderColor = COLORS.textMuted;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = COLORS.white;
                    e.target.style.borderColor = COLORS.border;
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    color: COLORS.white,
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Patients;
