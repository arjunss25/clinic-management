import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaStethoscope,
  FaCertificate,
  FaEye,
  FaPlus,
  FaTimes,
  FaGraduationCap,
} from 'react-icons/fa';
import clinicAPI from '../../services/clinicApiService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ResultModal from '../../components/common/ResultModal';

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

// Fallback empty array for when API fails
const EMPTY_DOCTORS = [];

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Gynecology',
  'Psychiatry',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine',
  'Internal Medicine',
  'Surgery',
  'Oncology',
  'Ophthalmology',
  'ENT',
];

const QUALIFICATIONS = [
  'MBBS',
  'MD',
  'MS',
  'DM',
  'MCh',
  'DNB',
  'FRCS',
  'MRCP',
  'FACC',
  'FAAP',
  'FAAD',
];

// Base filter options (non-specialization filters)
const BASE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Doctors' },
  { value: 'recent', label: 'Recently Joined' },
];

// Initial form state
const INITIAL_DOCTOR_STATE = {
  doctor_name: '',
  specialization: '',
  phone: '',
  email: '',
  bio: '',
  experince_years: '',
  education: '',
  additional_qualification: {
    fellowships: [],
    certifications: []
  }
};

// Custom hooks for form management
const useDoctorForm = () => {
  const [newDoctor, setNewDoctor] = useState(INITIAL_DOCTOR_STATE);
  const [fellowships, setFellowships] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [newFellowship, setNewFellowship] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModal, setResultModal] = useState({ type: '', title: '', message: '' });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddFellowship = useCallback(() => {
    if (newFellowship.trim()) {
      setFellowships((prev) => [...prev, newFellowship.trim()]);
      setNewFellowship('');
    }
  }, [newFellowship]);

  const handleRemoveFellowship = useCallback((index) => {
    setFellowships((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddCertification = useCallback(() => {
    if (newCertification.trim()) {
      setCertifications((prev) => [...prev, newCertification.trim()]);
      setNewCertification('');
    }
  }, [newCertification]);

  const handleRemoveCertification = useCallback((index) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetForm = useCallback(() => {
    setNewDoctor(INITIAL_DOCTOR_STATE);
    setFellowships([]);
    setCertifications([]);
    setNewFellowship('');
    setNewCertification('');
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
    newDoctor,
    fellowships,
    certifications,
    newFellowship,
    newCertification,
    setNewFellowship,
    setNewCertification,
    isLoading,
    setLoading: setIsLoading,
    error,
    setError,
    handleInputChange,
    handleAddFellowship,
    handleRemoveFellowship,
    handleAddCertification,
    handleRemoveCertification,
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

const DoctorIcon = React.memo(() => (
  <div
    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base font-semibold flex-shrink-0"
    style={{
      background: `${COLORS.primary}1A`,
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}33`,
    }}
  >
    <FaUserMd className="w-4 h-4 sm:w-5 sm:h-5" />
  </div>
));

const EmptyState = React.memo(() => (
  <div className="text-center py-12 px-4 sm:px-6">
    <div
      className="text-lg font-medium mb-2"
      style={{ color: COLORS.textMuted }}
    >
      No doctors found
    </div>
    <div className="text-sm" style={{ color: COLORS.textMuted }}>
      Try adjusting your search or filter criteria
    </div>
  </div>
));

// Input components for reusability
const FormInput = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    required = false,
    placeholder,
    disabled = false,
    ...props
  }) => (
    <div>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: COLORS.text }}
      >
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: COLORS.white,
          border: `2px solid ${COLORS.border}`,
          color: COLORS.text,
          outline: 'none',
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = COLORS.primary;
            e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = COLORS.border;
          e.target.style.boxShadow = 'none';
        }}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
);

const FormSelect = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    placeholder = 'Select option',
  }) => (
    <div className="relative">
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: COLORS.text }}
      >
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 pr-12 rounded-lg transition-all text-sm border-2 appearance-none cursor-pointer"
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
          className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          style={{ color: COLORS.textMuted }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  )
);

const QualificationTag = React.memo(({ qualification, onRemove, index, type = 'default' }) => {
  const getTagStyle = () => {
    if (type === 'fellowship') {
      return {
        background: `${COLORS.primary}10`,
        color: COLORS.primary,
        border: `1px solid ${COLORS.primary}30`,
      };
    } else if (type === 'certification') {
      return {
        background: `${COLORS.secondary}10`,
        color: COLORS.secondary,
        border: `1px solid ${COLORS.secondary}30`,
      };
    }
    return {
      background: `${COLORS.primary}10`,
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}30`,
    };
  };

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-sm"
      style={getTagStyle()}
    >
      <span>{qualification}</span>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110"
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
        <FaTimes className="w-2.5 h-2.5" />
      </button>
    </div>
  );
});

const DoctorRow = React.memo(({ doctor, onViewDoctor }) => (
  <tr
    className="transition-all duration-200 hover:shadow-sm"
    style={{
      background: COLORS.white,
      borderColor: COLORS.border,
    }}
  >
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <DoctorIcon />
        <div>
          <div
            className="text-sm sm:text-base font-semibold"
            style={{ color: COLORS.text }}
          >
            {doctor.name}
          </div>
          <div
            className="text-xs sm:text-sm"
            style={{ color: COLORS.textMuted }}
          >
            ID: {doctor.id}
          </div>
          <div
            className="text-xs sm:text-sm"
            style={{ color: COLORS.textMuted }}
          >
            {doctor.experience} years exp.
          </div>
        </div>
      </div>
    </td>
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FaStethoscope
            className="w-3 h-3 sm:w-4 sm:h-4"
            style={{ color: COLORS.textMuted }}
          />
          <span
            className="text-sm sm:text-base font-medium"
            style={{ color: COLORS.text }}
          >
            {doctor.specialization}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaCertificate
            className="w-3 h-3 sm:w-4 sm:h-4"
            style={{ color: COLORS.textMuted }}
          />
          <span
            className="text-xs sm:text-sm"
            style={{ color: COLORS.textMuted }}
          >
            {doctor.qualification}
          </span>
        </div>
      </div>
    </td>
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FaPhone
            className="w-3 h-3 sm:w-4 sm:h-4"
            style={{ color: COLORS.textMuted }}
          />
          <span className="text-sm sm:text-base" style={{ color: COLORS.text }}>
            {doctor.phone}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope
            className="w-3 h-3 sm:w-4 sm:h-4"
            style={{ color: COLORS.textMuted }}
          />
          <span
            className="text-xs sm:text-sm"
            style={{ color: COLORS.textMuted }}
          >
            {doctor.email}
          </span>
        </div>
      </div>
    </td>

    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <FaCalendarAlt
          className="w-3 h-3 sm:w-4 sm:h-4"
          style={{ color: COLORS.textMuted }}
        />
        <span className="text-sm sm:text-base" style={{ color: COLORS.text }}>
          {doctor.joinedDate}
        </span>
      </div>
    </td>
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <StatusBadge status={doctor.status} />
    </td>
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => onViewDoctor(doctor)}
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

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filterOptions, setFilterOptions] = useState(BASE_FILTER_OPTIONS);
  const [filtering, setFiltering] = useState(false);
  const navigate = useNavigate();

  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    newDoctor,
    fellowships,
    certifications,
    newFellowship,
    newCertification,
    setNewFellowship,
    setNewCertification,
    isLoading,
    setLoading,
    error,
    setError,
    handleInputChange,
    handleAddFellowship,
    handleRemoveFellowship,
    handleAddCertification,
    handleRemoveCertification,
    resetForm,
    showResultModal,
    resultModal,
    showSuccessModal,
    showErrorModal,
    closeResultModal,
  } = useDoctorForm();

  // Fetch specializations from API
  const fetchSpecializations = useCallback(async () => {
    setLoadingSpecializations(true);
    try {
      const result = await clinicAPI.getClinicSpecializations();
      if (result.success) {
        // Transform the data to match the expected format
        const transformedSpecializations = result.data.map(spec => 
          typeof spec === 'string' ? spec : (spec.name || spec)
        );
        setSpecializations(transformedSpecializations);
        
        // Update filter options to include specializations
        const specializationFilters = transformedSpecializations.map(spec => ({
          value: spec.toLowerCase(),
          label: spec
        }));
        setFilterOptions([...BASE_FILTER_OPTIONS, ...specializationFilters]);
      } else {
        console.error('Failed to fetch specializations:', result.message);
        // Fallback to hardcoded specializations if API fails
        setSpecializations(SPECIALIZATIONS);
        const specializationFilters = SPECIALIZATIONS.map(spec => ({
          value: spec.toLowerCase(),
          label: spec
        }));
        setFilterOptions([...BASE_FILTER_OPTIONS, ...specializationFilters]);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      // Fallback to hardcoded specializations if API fails
      setSpecializations(SPECIALIZATIONS);
      const specializationFilters = SPECIALIZATIONS.map(spec => ({
        value: spec.toLowerCase(),
        label: spec
      }));
      setFilterOptions([...BASE_FILTER_OPTIONS, ...specializationFilters]);
    } finally {
      setLoadingSpecializations(false);
    }
  }, []);

  // Transform doctor data from API
  const transformDoctorData = useCallback((doctorData) => {
    return doctorData.map((doctor, index) => ({
      id: doctor.id, // Use the original numeric ID from API
      name: doctor.doctor_name,
      specialization: doctor.specialization,
      qualification: doctor.education,
      experience: doctor.experince_years,
      phone: doctor.phone,
      email: doctor.email,
      joinedDate: new Date(doctor.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Active',
      bio: doctor.bio,
      profilePicture: doctor.profile_picture,
      appointmentAmount: doctor.appointment_amount,
      additionalQualification: doctor.additional_qualification,
      licenseNumber: `MD${doctor.phone.slice(-6)}`, // Generate license number from phone
    }));
  }, []);

  // Fetch doctors from API
  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const result = await clinicAPI.listAllDoctors();
      if (result.success) {
        const transformedDoctors = transformDoctorData(result.data);
        setDoctors(transformedDoctors);
      } else {
        console.error('Failed to fetch doctors:', result.message);
        setDoctors(EMPTY_DOCTORS);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors(EMPTY_DOCTORS);
    } finally {
      setLoadingDoctors(false);
    }
  }, [transformDoctorData]);

  // Search doctors from API
  const searchDoctors = useCallback(async (query) => {
    if (!query.trim()) {
      // If search is empty, fetch all doctors
      fetchDoctors();
      return;
    }

    setSearching(true);
    try {
      const result = await clinicAPI.searchDoctors(query);
      if (result.success) {
        const transformedDoctors = transformDoctorData(result.data);
        setDoctors(transformedDoctors);
      } else {
        console.error('Failed to search doctors:', result.message);
        setDoctors(EMPTY_DOCTORS);
      }
    } catch (error) {
      console.error('Error searching doctors:', error);
      setDoctors(EMPTY_DOCTORS);
    } finally {
      setSearching(false);
    }
  }, [fetchDoctors, transformDoctorData]);

  // Fetch doctors by specialization
  const fetchDoctorsBySpecialization = useCallback(async (specialization) => {
    setFiltering(true);
    try {
      const result = await clinicAPI.listDoctorsBySpecialization(specialization);
      if (result.success) {
        const transformedDoctors = transformDoctorData(result.data);
        setDoctors(transformedDoctors);
      } else {
        console.error('Failed to fetch doctors by specialization:', result.message);
        setDoctors(EMPTY_DOCTORS);
      }
    } catch (error) {
      console.error('Error fetching doctors by specialization:', error);
      setDoctors(EMPTY_DOCTORS);
    } finally {
      setFiltering(false);
    }
  }, [transformDoctorData]);

  // Fetch specializations and doctors when component mounts
  useEffect(() => {
    fetchSpecializations();
    fetchDoctors();
  }, [fetchSpecializations, fetchDoctors]);

  // Handle debounced search
  useEffect(() => {
    searchDoctors(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchDoctors]);

  // Handle filter changes
  useEffect(() => {
    if (selectedFilter === 'all') {
      fetchDoctors();
    } else if (selectedFilter === 'recent') {
      // For recent filter, we'll handle it client-side after fetching all doctors
      fetchDoctors();
    } else {
      // For specialization filters, fetch from API
      fetchDoctorsBySpecialization(selectedFilter);
    }
  }, [selectedFilter, fetchDoctors, fetchDoctorsBySpecialization]);

  // Memoized filtered doctors (now only for recent filter, since others are handled by API)
  const filteredDoctors = useMemo(() => {
    if (selectedFilter === 'recent') {
      return doctors.filter((doctor) => {
        const joinedDate = new Date(doctor.joinedDate);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return joinedDate >= sixMonthsAgo;
      });
    }
    return doctors; // For 'all' and specialization filters, return doctors as-is since they're already filtered by API
  }, [doctors, selectedFilter]);

  // Event handlers
  const handleViewDoctor = useCallback(
    (doctor) => {
      navigate(`/clinic/doctors/${doctor.id}`);
    },
    [navigate]
  );

  const handleAddDoctor = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        // Prepare the payload according to the API specification
        const doctorPayload = {
          doctor_name: newDoctor.doctor_name,
          specialization: newDoctor.specialization,
          phone: newDoctor.phone,
          email: newDoctor.email,
          bio: newDoctor.bio,
          experince_years: parseInt(newDoctor.experince_years),
          education: newDoctor.education,
          additional_qualification: {
            fellowships: fellowships,
            certifications: certifications
          }
        };

        console.log('Registering doctor with payload:', doctorPayload);
        
        const response = await clinicAPI.registerDoctor(doctorPayload);
        
        if (response.success) {
          console.log('Doctor registered successfully:', response);
          
          // Close add doctor modal first
          setShowAddModal(false);
          resetForm();
          
          // Show success modal
          showSuccessModal(
            'Doctor Registered Successfully!',
            `Dr. ${newDoctor.doctor_name} has been successfully added to your medical staff. They can now start accepting appointments.`
          );
          
          // Refresh the doctors list to show the newly added doctor
          fetchDoctors();
        } else {
          console.error('Failed to register doctor:', response.message);
          
          // Close add doctor modal first
          setShowAddModal(false);
          
          // Show error modal
          showErrorModal(
            'Registration Failed',
            response.message || 'Failed to register doctor. Please try again.'
          );
        }
        
      } catch (error) {
        console.error('Error registering doctor:', error);
        
        // Close add doctor modal first
        setShowAddModal(false);
        
        // Show error modal
        showErrorModal(
          'Registration Error',
          'An unexpected error occurred. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [newDoctor, fellowships, certifications, setLoading, setError, resetForm, showSuccessModal, showErrorModal]
  );

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    resetForm();
  }, [resetForm]);



  return (
    <div className="min-h-screen">
      <div className="sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
          <div className="space-y-1">
            <h1
              className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight"
              style={{ color: COLORS.text }}
            >
              Doctors Directory
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: COLORS.textMuted }}
            >
              View and manage doctor information
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
                <span className="hidden sm:inline">Specialists</span>
              </span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-medium transition shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                color: COLORS.white,
              }}
            >
              <FaPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Add Doctor
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div
          className="rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: COLORS.textMuted }}
                />
                <input
                  type="text"
                  placeholder="Search by name, ID, specialization, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition text-sm sm:text-base"
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
              <div className="md:w-48 relative">
                <FaFilter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: COLORS.textMuted }}
                />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition text-sm sm:text-base appearance-none"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                    outline: 'none',
                  }}
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div
          className="rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <tr>
                  {[
                    'Doctor Info',
                    'Specialization',
                    'Contact',
                    'Joined',
                    'Status',
                    'Actions',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                {filteredDoctors.map((doctor) => (
                  <DoctorRow
                    key={doctor.id}
                    doctor={doctor}
                    onViewDoctor={handleViewDoctor}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {(loadingDoctors || searching || filtering) ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-sm" style={{ color: COLORS.textMuted }}>
                  {searching ? 'Searching doctors...' : 
                   filtering ? 'Filtering doctors...' : 
                   'Loading doctors...'}
                </p>
              </div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <EmptyState />
          ) : null}
        </div>
      </div>

      {/* Add Doctor Modal */}
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
            className="w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative"
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
              title="Registering Doctor..."
              message="Please wait while we process your request"
              spinnerSize="xl"
            />

            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Add New Doctor
                </h3>
                <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                  Enter doctor information to add them to your medical staff
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
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
            <form onSubmit={handleAddDoctor} className="p-6 space-y-6">

              {/* Error Message */}
              {error && (
                <div className="lg:col-span-2 p-4 rounded-lg border-2" style={{ 
                  background: '#FEF2F2', 
                  borderColor: '#FECACA', 
                  color: '#DC2626' 
                }}>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <FormInput
                    label="Doctor Name"
                    name="doctor_name"
                    value={newDoctor.doctor_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Dr. John Smith"
                    disabled={isLoading}
                  />
                </div>

                <FormSelect
                  label="Specialization"
                  name="specialization"
                  value={newDoctor.specialization}
                  onChange={handleInputChange}
                  options={specializations}
                  required
                  placeholder={loadingSpecializations ? "Loading specializations..." : "Select Specialization"}
                  disabled={loadingSpecializations || isLoading}
                />

                <FormInput
                  label="Years of Experience"
                  name="experince_years"
                  type="number"
                  value={newDoctor.experince_years}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="50"
                  placeholder="10"
                  disabled={isLoading}
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={newDoctor.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91-9876543210"
                  disabled={isLoading}
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={newDoctor.email}
                  onChange={handleInputChange}
                  required
                  placeholder="doctor@clinic.com"
                  disabled={isLoading}
                />

                <FormInput
                  label="Education"
                  name="education"
                  value={newDoctor.education}
                  onChange={handleInputChange}
                  required
                  placeholder="MBBS, MD (Cardiology)"
                  disabled={isLoading}
                />

                <div className="lg:col-span-2">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.text }}
                  >
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={newDoctor.bio}
                    onChange={handleInputChange}
                    rows="3"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm resize-none border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: COLORS.white,
                      border: `2px solid ${COLORS.border}`,
                      color: COLORS.text,
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      if (!isLoading) {
                        e.target.style.borderColor = COLORS.primary;
                        e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Experienced cardiologist specializing in heart diseases."
                    required
                  />
                </div>

                {/* Fellowships Section */}
                <div className="lg:col-span-2">
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: COLORS.text }}
                  >
                    Fellowships
                  </label>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newFellowship}
                        onChange={(e) => setNewFellowship(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFellowship();
                          }
                        }}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-lg transition-all text-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: COLORS.white,
                          border: `2px solid ${COLORS.border}`,
                          color: COLORS.text,
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          if (!isLoading) {
                            e.target.style.borderColor = COLORS.primary;
                            e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = COLORS.border;
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter fellowship (e.g., FACC, FESC, etc.)"
                      />
                      <button
                        type="button"
                        onClick={handleAddFellowship}
                        disabled={!newFellowship.trim() || isLoading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: COLORS.primary, color: COLORS.white }}
                        onMouseEnter={(e) =>
                          !e.target.disabled &&
                          (e.target.style.background = '#0D1BC4')
                        }
                        onMouseLeave={(e) =>
                          !e.target.disabled &&
                          (e.target.style.background = COLORS.primary)
                        }
                      >
                        Add
                      </button>
                    </div>

                    {fellowships.length > 0 && (
                      <div className="space-y-2">
                        <p
                          className="text-xs font-medium"
                          style={{ color: COLORS.textMuted }}
                        >
                          Added Fellowships:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {fellowships.map((fellowship, index) => (
                            <QualificationTag
                              key={`fellowship-${fellowship}-${index}`}
                              qualification={fellowship}
                              index={index}
                              onRemove={handleRemoveFellowship}
                              type="fellowship"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="lg:col-span-2">
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: COLORS.text }}
                  >
                    Certifications
                  </label>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCertification();
                          }
                        }}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-lg transition-all text-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: COLORS.white,
                          border: `2px solid ${COLORS.border}`,
                          color: COLORS.text,
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          if (!isLoading) {
                            e.target.style.borderColor = COLORS.secondary;
                            e.target.style.boxShadow = `0 0 0 4px ${COLORS.secondary}15`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = COLORS.border;
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter certification (e.g., Advanced Cardiac Life Support, etc.)"
                      />
                      <button
                        type="button"
                        onClick={handleAddCertification}
                        disabled={!newCertification.trim() || isLoading}
                        className="px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: COLORS.secondary, color: COLORS.white }}
                        onMouseEnter={(e) =>
                          !e.target.disabled &&
                          (e.target.style.background = '#0A4AE8')
                        }
                        onMouseLeave={(e) =>
                          !e.target.disabled &&
                          (e.target.style.background = COLORS.secondary)
                        }
                      >
                        Add
                      </button>
                    </div>

                    {certifications.length > 0 && (
                      <div className="space-y-2">
                        <p
                          className="text-xs font-medium"
                          style={{ color: COLORS.textMuted }}
                        >
                          Added Certifications:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {certifications.map((certification, index) => (
                            <QualificationTag
                              key={`certification-${certification}-${index}`}
                              qualification={certification}
                              index={index}
                              onRemove={handleRemoveCertification}
                              type="certification"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                style={{ borderColor: COLORS.border }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `2px solid ${COLORS.border}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.background = `${COLORS.textMuted}10`;
                      e.target.style.borderColor = COLORS.textMuted;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.background = COLORS.white;
                      e.target.style.borderColor = COLORS.border;
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    color: COLORS.white,
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow =
                        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow =
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="text-white" />
                      <span>Registering Doctor...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="w-4 h-4" />
                      <span>Add Doctor</span>
                    </>
                  )}
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

export default Doctors;
