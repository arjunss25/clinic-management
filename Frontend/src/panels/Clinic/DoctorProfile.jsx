import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserMd,
  FaStethoscope,
  FaGraduationCap,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaStar,
  FaUsers,
  FaCertificate,
  FaHospital,
  FaClock,
  FaGlobe,
  FaAward,
  FaBook,
  FaChartLine,
  FaCheckCircle,
  FaDollarSign,
} from 'react-icons/fa';
import clinicAPI from '../../services/clinicApiService';

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
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  // Comprehensive doctor database
  const doctorsDatabase = {
    'DOC-2024-001': {
      id: 'DOC-2024-001',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      qualification: 'MD, FACC',
      experience: 15,
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@clinic.com',
      joinedDate: '15 Jan 2020',
      status: 'Active',
      licenseNumber: 'MD123456',
      address: '123 Medical Center Drive, New York, NY 10001',
      specializations: ['Cardiology', 'Internal Medicine', 'Interventional Cardiology'],
      qualifications: [
        'MD - Harvard Medical School (2009)',
        'Board Certified Cardiologist (2012)',
        'Fellowship in Interventional Cardiology - Mayo Clinic (2013)',
        'FACC - Fellow of American College of Cardiology (2015)',
      ],
      hospital: 'New York Presbyterian Hospital',
      department: 'Cardiology Department',
      languages: ['English', 'Spanish'],
      rating: 4.8,
      totalPatients: 1250,
      education: 'Harvard Medical School',
      certifications: ['Board Certified Cardiologist', 'FACC', 'Interventional Cardiology'],
      achievements: [
        'Best Cardiologist Award 2023 - New York Medical Association',
        'Published 25+ research papers in leading cardiology journals',
        'Speaker at American Heart Association Annual Meeting 2023',
      ],
      schedule: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '10:00', end: '14:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false },
      },
      consultationFee: 150,
      emergencyContact: '+1 (555) 999-8888',
      bio: 'Dr. Sarah Johnson is a highly experienced cardiologist with over 15 years of practice. She specializes in interventional cardiology and has performed over 2000 cardiac procedures. Her research focuses on preventive cardiology and innovative treatment methods.',
      recentPublications: [
        'Advanced Cardiac Imaging Techniques (2023)',
        'Preventive Cardiology in Modern Practice (2022)',
        'Interventional Cardiology Outcomes Study (2021)',
      ],
      awards: [
        'Excellence in Cardiology Award - 2023',
        'Patient Choice Award - 2022',
        'Research Excellence Award - 2021',
      ],
    },
    'DOC-2024-002': {
      id: 'DOC-2024-002',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      qualification: 'MD, PhD',
      experience: 12,
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@clinic.com',
      joinedDate: '22 Mar 2021',
      status: 'Active',
      licenseNumber: 'MD234567',
      address: '456 Healthcare Plaza, Los Angeles, CA 90210',
      specializations: ['Neurology', 'Neurosurgery', 'Movement Disorders'],
      qualifications: [
        'MD - Stanford University (2012)',
        'PhD - Neuroscience - Stanford University (2014)',
        'Board Certified Neurologist (2015)',
        'Fellowship in Movement Disorders - UCLA (2016)',
      ],
      hospital: 'UCLA Medical Center',
      department: 'Neurology Department',
      languages: ['English', 'Mandarin'],
      rating: 4.9,
      totalPatients: 980,
      education: 'Stanford University',
      certifications: ['Board Certified Neurologist', 'PhD Neuroscience', 'Movement Disorders Specialist'],
      achievements: [
        'Leading researcher in Parkinson\'s disease treatment',
        'Developed innovative diagnostic protocols for movement disorders',
        'Mentored 15+ neurology residents',
      ],
      schedule: {
        monday: { start: '08:00', end: '16:00', available: true },
        tuesday: { start: '08:00', end: '16:00', available: true },
        wednesday: { start: '08:00', end: '16:00', available: true },
        thursday: { start: '08:00', end: '16:00', available: true },
        friday: { start: '08:00', end: '16:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false },
      },
      consultationFee: 180,
      emergencyContact: '+1 (555) 777-6666',
      bio: 'Dr. Michael Chen is a distinguished neurologist with expertise in movement disorders and neurodegenerative diseases. His research has contributed significantly to understanding Parkinson\'s disease mechanisms.',
      recentPublications: [
        'Novel Approaches to Parkinson\'s Treatment (2023)',
        'Movement Disorders in Aging Population (2022)',
        'Neurological Biomarkers Study (2021)',
      ],
      awards: [
        'Neurology Research Excellence Award - 2023',
        'Young Investigator Award - 2022',
        'Patient Care Excellence - 2021',
      ],
    },
    'DOC-2024-003': {
      id: 'DOC-2024-003',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      qualification: 'MD, FAAP',
      experience: 8,
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@clinic.com',
      joinedDate: '10 May 2022',
      status: 'Active',
      licenseNumber: 'MD345678',
      address: '789 Children\'s Hospital Way, Miami, FL 33101',
      specializations: ['Pediatrics', 'Child Development', 'Pediatric Cardiology'],
      qualifications: [
        'MD - Johns Hopkins University (2016)',
        'Board Certified Pediatrician (2018)',
        'Fellowship in Pediatric Cardiology (2019)',
        'FAAP - Fellow of American Academy of Pediatrics (2020)',
      ],
      hospital: 'Miami Children\'s Hospital',
      department: 'Pediatrics Department',
      languages: ['English', 'Spanish'],
      rating: 4.7,
      totalPatients: 2100,
      education: 'Johns Hopkins University',
      certifications: ['Board Certified Pediatrician', 'FAAP', 'Pediatric Cardiology'],
      achievements: [
        'Specialized in treating congenital heart defects',
        'Developed child-friendly examination protocols',
        'Active in community pediatric health programs',
      ],
      schedule: {
        monday: { start: '08:30', end: '16:30', available: true },
        tuesday: { start: '08:30', end: '16:30', available: true },
        wednesday: { start: '08:30', end: '16:30', available: true },
        thursday: { start: '08:30', end: '16:30', available: true },
        friday: { start: '08:30', end: '16:30', available: true },
        saturday: { start: '09:00', end: '15:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false },
      },
      consultationFee: 120,
      emergencyContact: '+1 (555) 555-4444',
      bio: 'Dr. Emily Rodriguez is a compassionate pediatrician specializing in child development and pediatric cardiology. She has a special interest in treating children with congenital heart conditions.',
      recentPublications: [
        'Pediatric Heart Disease Management (2023)',
        'Child Development Milestones (2022)',
        'Pediatric Care Best Practices (2021)',
      ],
      awards: [
        'Pediatric Excellence Award - 2023',
        'Community Service Award - 2022',
        'Patient Family Choice Award - 2021',
      ],
    },
  };

  // Fetch specializations from API
  const fetchSpecializations = async () => {
    setLoadingSpecializations(true);
    try {
      const result = await clinicAPI.getClinicSpecializations();
      if (result.success) {
        setSpecializations(result.data || []);
      } else {
        console.error('Failed to fetch specializations:', result.message);
        setSpecializations([]);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setSpecializations([]);
    } finally {
      setLoadingSpecializations(false);
    }
  };

  useEffect(() => {
    // Fetch specializations when component mounts
    fetchSpecializations();

    // Simulate API call for doctor data
    setTimeout(() => {
      const doctorData = doctorsDatabase[doctorId];
      if (doctorData) {
        setDoctor(doctorData);
        setEditForm(doctorData);
      }
      setLoading(false);
    }, 1000);
  }, [doctorId]);

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = () => {
    setDoctor(editForm);
    setShowEditModal(false);
    console.log('Profile updated:', editForm);
  };

  const handleBack = () => {
    navigate('/clinic/doctors');
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

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.background }}>
        <div className="text-center max-w-md">
          <FaUserMd className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.textMuted }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>Doctor Not Found</h2>
          <p style={{ color: COLORS.textMuted }}>The requested doctor profile could not be found.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{ background: COLORS.primary, color: COLORS.white }}
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUserMd },
    { id: 'professional', label: 'Professional Info', icon: FaStethoscope },
    { id: 'qualifications', label: 'Qualifications', icon: FaGraduationCap },
    { id: 'schedule', label: 'Schedule', icon: FaCalendarAlt },
    { id: 'achievements', label: 'Achievements', icon: FaAward },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8" style={{ background: COLORS.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 mb-1 px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors duration-200 hover:shadow-sm text-sm sm:text-base"
            style={{ 
              background: COLORS.white, 
              color: COLORS.text,
              border: `1px solid ${COLORS.border}` 
            }}
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Doctors</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Topbar - Doctor Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              {/* Doctor Info */}
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
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                {/* Name and Basic Info */}
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
                    {doctor.name}
                  </h1>
                  <p className="text-base sm:text-lg mb-2" style={{ color: COLORS.textMuted }}>
                    {doctor.specialization} • {doctor.qualification}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      <FaCheckCircle className="w-3 h-3" />
                      {doctor.status}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaStar className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.warning }} />
                      {doctor.rating}/5.0
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaUsers className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      <span className="hidden sm:inline">{doctor.totalPatients?.toLocaleString()} patients</span>
                      <span className="sm:hidden">{doctor.totalPatients?.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaGraduationCap className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      {doctor.experience} years
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                      <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                      ${doctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 text-xs sm:text-sm order-3 lg:order-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate">{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }} className="truncate max-w-[200px] sm:max-w-xs">{doctor.address}</span>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex-shrink-0 order-2 lg:order-3">
                <button
                  onClick={() => setShowEditModal(true)}
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
                      <FaStethoscope className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Professional Summary
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {doctor.bio || `${doctor.name} is a highly qualified ${doctor.specialization.toLowerCase()} specialist with ${doctor.experience} years of experience. Currently practicing at ${doctor.hospital || 'our clinic'}, ${doctor.name} has treated over ${doctor.totalPatients?.toLocaleString()} patients and maintains an excellent rating of ${doctor.rating}/5.0.`}
                    </p>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                        <FaHospital className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                        Hospital & Department
                      </h4>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <p><span className="font-medium" style={{ color: COLORS.text }}>Hospital:</span> {doctor.hospital || 'Not specified'}</p>
                        <p><span className="font-medium" style={{ color: COLORS.text }}>Department:</span> {doctor.department || 'Not specified'}</p>
                        <p><span className="font-medium" style={{ color: COLORS.text }}>Joined:</span> {doctor.joinedDate}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                        <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                        Education & Languages
                      </h4>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <p><span className="font-medium" style={{ color: COLORS.text }}>Education:</span> {doctor.education || 'Not specified'}</p>
                        <p><span className="font-medium" style={{ color: COLORS.text }}>Languages:</span> {doctor.languages?.join(', ') || 'English'}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                      <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: COLORS.text }}>
                        <FaIdCard className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.primary }} />
                        License & Contact
                      </h4>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <p><span className="font-medium" style={{ color: COLORS.text }}>License:</span> {doctor.licenseNumber}</p>
                        <p><span className="font-medium" style={{ color: COLORS.text }}>Emergency:</span> {doctor.emergencyContact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Publications */}
                  {doctor.recentPublications && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaBook className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Recent Publications
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {doctor.recentPublications.map((pub, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" style={{ background: COLORS.primary }}></div>
                            <span className="text-xs sm:text-sm" style={{ color: COLORS.text }}>{pub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Specializations */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaStethoscope className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(doctor.specializations || [doctor.specialization]).map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{ 
                            background: `${COLORS.primary}10`, 
                            color: COLORS.primary,
                            border: `1px solid ${COLORS.primary}30` 
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience & Certifications */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaCertificate className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Experience & Certifications
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                        <FaClock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        <div>
                          <p className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>{doctor.experience} Years of Experience</p>
                          <p className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>Professional medical practice</p>
                        </div>
                      </div>
                      
                      {doctor.certifications && (
                        <div className="space-y-2">
                          <p className="font-medium text-sm sm:text-base" style={{ color: COLORS.text }}>Certifications:</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.certifications.map((cert, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                style={{ 
                                  background: `${COLORS.secondary}10`, 
                                  color: COLORS.secondary,
                                  border: `1px solid ${COLORS.secondary}30` 
                                }}
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'qualifications' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Educational Background */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Educational Background
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {doctor.qualifications?.map((qual, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" style={{ background: COLORS.primary }}></div>
                          <span className="text-xs sm:text-sm" style={{ color: COLORS.text }}>{qual}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaCertificate className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Additional Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="font-medium mb-1" style={{ color: COLORS.text }}>License Number</p>
                        <p style={{ color: COLORS.textMuted }}>{doctor.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1" style={{ color: COLORS.text }}>Status</p>
                        <p style={{ color: COLORS.textMuted }}>{doctor.status}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1" style={{ color: COLORS.text }}>Joined Date</p>
                        <p style={{ color: COLORS.textMuted }}>{doctor.joinedDate}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1" style={{ color: COLORS.text }}>Languages</p>
                        <p style={{ color: COLORS.textMuted }}>{doctor.languages?.join(', ') || 'English'}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1" style={{ color: COLORS.text }}>Consultation Fee</p>
                        <p style={{ color: COLORS.textMuted }}>${doctor.consultationFee}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1" style={{ color: COLORS.text }}>Emergency Contact</p>
                        <p style={{ color: COLORS.textMuted }}>{doctor.emergencyContact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Weekly Schedule */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                      Weekly Schedule
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {Object.entries(doctor.schedule || {}).map(([day, schedule]) => (
                        <div key={day} className="flex items-center justify-between p-2 sm:p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="font-medium capitalize text-xs sm:text-sm" style={{ color: COLORS.text }}>{day}</span>
                            {schedule.available ? (
                              <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.success }} />
                            ) : (
                              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.danger }} />
                            )}
                          </div>
                          <div className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                            {schedule.available ? `${schedule.start} - ${schedule.end}` : 'Not Available'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Awards */}
                  {doctor.awards && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaAward className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Awards & Recognition
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {doctor.awards.map((award, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                            <FaAward className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0" style={{ color: COLORS.warning }} />
                            <span className="text-xs sm:text-sm" style={{ color: COLORS.text }}>{award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {doctor.achievements && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.primary }} />
                        Professional Achievements
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {doctor.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" style={{ background: COLORS.primary }}></div>
                            <span className="text-xs sm:text-sm" style={{ color: COLORS.text }}>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                Edit Doctor Profile
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
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Specialization</label>
                  <select
                    value={editForm.specialization || ''}
                    onChange={(e) => handleFormChange('specialization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={loadingSpecializations}
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((specialization) => (
                      <option key={specialization.id || specialization.pk || specialization} value={specialization.name || specialization}>
                        {specialization.name || specialization}
                      </option>
                    ))}
                  </select>
                  {loadingSpecializations && (
                    <p className="text-xs text-gray-500 mt-1">Loading specializations...</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Email</label>
                  <input
                    type="text"
                    value={editForm.email || ''}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Consultation Fee</label>
                  <input
                    type="number"
                    value={editForm.consultationFee || ''}
                    onChange={(e) => handleFormChange('consultationFee', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Status</label>
                  <select
                    value={editForm.status || ''}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
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
                onClick={saveProfile}
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

export default DoctorProfile;
