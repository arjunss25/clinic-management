'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaPhone,
  FaStethoscope,
  FaArrowLeft,
  FaEdit,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaSave,
  FaGraduationCap,
  FaHospital,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserMd,
  FaStar,
  FaUsers,
  FaCertificate,
} from 'react-icons/fa';

// Theme colors (matching the project theme)
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

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Sample doctor data (matching the structure from Doctors.jsx)
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
      specializations: ['Cardiology', 'Internal Medicine'],
      qualifications: [
        'MD - Harvard Medical School',
        'Board Certified Cardiologist',
        'Fellowship in Interventional Cardiology',
      ],
      hospital: 'New York Presbyterian Hospital',
      department: 'Cardiology Department',
      languages: ['English', 'Spanish'],
      rating: 4.8,
      totalPatients: 1250,
      education: 'Harvard Medical School',
      certifications: ['Board Certified Cardiologist', 'FACC'],
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
      specializations: ['Neurology', 'Neurosurgery'],
      qualifications: [
        'MD - Stanford University',
        'PhD - Neuroscience',
        'Board Certified Neurologist',
      ],
      hospital: 'UCLA Medical Center',
      department: 'Neurology Department',
      languages: ['English', 'Mandarin'],
      rating: 4.9,
      totalPatients: 980,
      education: 'Stanford University',
      certifications: ['Board Certified Neurologist', 'PhD Neuroscience'],
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
      specializations: ['Pediatrics', 'Child Development'],
      qualifications: [
        'MD - Johns Hopkins University',
        'Board Certified Pediatrician',
        'Fellowship in Pediatric Cardiology',
      ],
      hospital: 'Miami Children\'s Hospital',
      department: 'Pediatrics Department',
      languages: ['English', 'Spanish'],
      rating: 4.7,
      totalPatients: 2100,
      education: 'Johns Hopkins University',
      certifications: ['Board Certified Pediatrician', 'FAAP'],
    },
  };

  useEffect(() => {
    // Simulate API call
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
    // In a real app, you would make an API call here
    console.log('Profile updated:', editForm);
  };

  const handleBack = () => {
    navigate('/clinic/doctors');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p style={{ color: COLORS.textMuted }}>Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.background }}>
        <div className="text-center">
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
  ];

  return (
    <div className="min-h-screen" style={{ background: COLORS.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:shadow-sm"
            style={{ 
              background: COLORS.white, 
              color: COLORS.text,
              border: `1px solid ${COLORS.border}` 
            }}
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Doctors
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
                {doctor.name}
              </h1>
              <p className="text-lg" style={{ color: COLORS.textMuted }}>
                {doctor.specialization} • {doctor.qualification}
              </p>
            </div>
            
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              style={{ background: COLORS.primary, color: COLORS.white }}
            >
              <FaEdit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Doctor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-8">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div 
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-3"
                  style={{ 
                    background: `${COLORS.primary}1A`, 
                    color: COLORS.primary,
                    border: `2px solid ${COLORS.primary}33` 
                  }}
                >
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold mb-1" style={{ color: COLORS.text }}>
                  {doctor.name}
                </h3>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  {doctor.specialization}
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-center mb-6">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  {doctor.status}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                  <div className="flex items-center gap-3">
                    <FaStar className="w-4 h-4" style={{ color: COLORS.primary }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.text }}>Rating</span>
                  </div>
                  <span className="font-semibold" style={{ color: COLORS.text }}>{doctor.rating}/5.0</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                  <div className="flex items-center gap-3">
                    <FaUsers className="w-4 h-4" style={{ color: COLORS.primary }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.text }}>Patients</span>
                  </div>
                  <span className="font-semibold" style={{ color: COLORS.text }}>{doctor.totalPatients?.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                  <div className="flex items-center gap-3">
                    <FaGraduationCap className="w-4 h-4" style={{ color: COLORS.primary }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.text }}>Experience</span>
                  </div>
                  <span className="font-semibold" style={{ color: COLORS.text }}>{doctor.experience} years</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold mb-3" style={{ color: COLORS.text }}>Contact Information</h4>
                
                <div className="flex items-center gap-3 text-sm">
                  <FaPhone className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }}>{doctor.phone}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <FaEnvelope className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }}>{doctor.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <FaMapMarkerAlt className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }}>{doctor.address}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <FaIdCard className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                  <span style={{ color: COLORS.text }}>License: {doctor.licenseNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="border-b border-gray-100">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Professional Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaStethoscope className="w-5 h-5" style={{ color: COLORS.primary }} />
                        Professional Summary
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                        {doctor.name} is a highly qualified {doctor.specialization.toLowerCase()} specialist with {doctor.experience} years of experience. 
                        Currently practicing at {doctor.hospital || 'our clinic'}, {doctor.name} has treated over {doctor.totalPatients?.toLocaleString()} patients 
                        and maintains an excellent rating of {doctor.rating}/5.0. Specializing in {doctor.specializations?.join(', ') || doctor.specialization}, 
                        {doctor.name} is committed to providing exceptional patient care and staying current with the latest medical advancements.
                      </p>
                    </div>

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                          <FaHospital className="w-4 h-4" style={{ color: COLORS.primary }} />
                          Hospital & Department
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium" style={{ color: COLORS.text }}>Hospital:</span> {doctor.hospital || 'Not specified'}</p>
                          <p><span className="font-medium" style={{ color: COLORS.text }}>Department:</span> {doctor.department || 'Not specified'}</p>
                          <p><span className="font-medium" style={{ color: COLORS.text }}>Joined:</span> {doctor.joinedDate}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                          <FaGraduationCap className="w-4 h-4" style={{ color: COLORS.primary }} />
                          Education & Languages
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium" style={{ color: COLORS.text }}>Education:</span> {doctor.education || 'Not specified'}</p>
                          <p><span className="font-medium" style={{ color: COLORS.text }}>Languages:</span> {doctor.languages?.join(', ') || 'English'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'professional' && (
                  <div className="space-y-6">
                    {/* Specializations */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaStethoscope className="w-5 h-5" style={{ color: COLORS.primary }} />
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(doctor.specializations || [doctor.specialization]).map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
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
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaCertificate className="w-5 h-5" style={{ color: COLORS.primary }} />
                        Experience & Certifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                          <FaClock className="w-5 h-5" style={{ color: COLORS.primary }} />
                          <div>
                            <p className="font-medium" style={{ color: COLORS.text }}>{doctor.experience} Years of Experience</p>
                            <p className="text-sm" style={{ color: COLORS.textMuted }}>Professional medical practice</p>
                          </div>
                        </div>
                        
                        {doctor.certifications && (
                          <div className="space-y-2">
                            <p className="font-medium" style={{ color: COLORS.text }}>Certifications:</p>
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
                  <div className="space-y-6">
                    {/* Educational Background */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaGraduationCap className="w-5 h-5" style={{ color: COLORS.primary }} />
                        Educational Background
                      </h3>
                      <div className="space-y-3">
                        {doctor.qualifications?.map((qual, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: COLORS.gray50 }}>
                            <div className="w-2 h-2 rounded-full mt-2" style={{ background: COLORS.primary }}></div>
                            <span className="text-sm" style={{ color: COLORS.text }}>{qual}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaCertificate className="w-5 h-5" style={{ color: COLORS.primary }} />
                        Additional Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    {/* Availability */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
                        <FaCalendarAlt className="w-5 h-5" style={{ color: COLORS.primary }} />
                        Availability
                      </h3>
                      <div className="text-center py-8">
                        <FaClock className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.textMuted }} />
                        <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>Schedule Information</p>
                        <p style={{ color: COLORS.textMuted }}>
                          Detailed schedule and availability information will be displayed here.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold" style={{ color: COLORS.text }}>
                Edit Doctor Profile
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Specialization</label>
                  <input
                    type="text"
                    value={editForm.specialization || ''}
                    onChange={(e) => handleFormChange('specialization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Email</label>
                  <input
                    type="text"
                    value={editForm.email || ''}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="px-4 py-2 text-white rounded-lg font-medium"
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
