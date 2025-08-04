import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaPhoneAlt,
  FaUsers,
  FaMale,
  FaFemale,
  FaClock,
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

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  // Sample patient data - in a real app, this would come from an API
  const patients = [
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
      emergencyContact: 'Sarah Doe (Wife)'
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
      emergencyContact: 'Mike Smith (Husband)'
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
      emergencyContact: 'Lisa Johnson (Sister)'
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
      emergencyContact: 'David Davis (Brother)'
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
      emergencyContact: 'Jennifer Wilson (Daughter)'
    }
  ];

  const filteredPatients = patients.filter(patient => {
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

  const handleViewPatient = (patient) => {
    navigate(`/doctor/patients/${patient.id}`);
  };

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
                  placeholder="Search by name, ID, or email..."
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
                  <option value="all">All Patients</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="recent">Recent Visits</option>
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

        {/* Patients Table */}
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
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}>
                    Patient Info
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}>
                    Contact
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}>
                    Medical Info
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}>
                    Last Visit
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}>
                    Follow Up
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: COLORS.primary }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ background: COLORS.white, borderColor: COLORS.border }}>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} 
                      className="transition-all duration-200 hover:shadow-sm"
                      style={{ 
                        background: COLORS.white,
                        borderColor: COLORS.border,
                      }}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base font-semibold flex-shrink-0"
                          style={{
                            background: `${COLORS.primary}1A`,
                            color: COLORS.primary,
                            border: `1px solid ${COLORS.primary}33`,
                          }}
                        >
                          <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold" style={{ color: COLORS.text }}>
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                          <span className="text-sm sm:text-base" style={{ color: COLORS.text }}>
                            {patient.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                          <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                            {patient.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaTint className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                          <span className="text-sm sm:text-base" style={{ color: COLORS.text }}>
                            Blood: {patient.bloodGroup}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUserFriends className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                          <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                            {patient.emergencyContact}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.textMuted }} />
                        <span className="text-sm sm:text-base" style={{ color: COLORS.text }}>
                          {patient.lastVisit}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPatient(patient)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-12 px-4 sm:px-6">
              <div
                className="text-lg font-medium mb-2"
                style={{ color: COLORS.textMuted }}
              >
                No patients found
              </div>
              <div
                className="text-sm"
                style={{ color: COLORS.textMuted }}
              >
                Try adjusting your search or filter criteria
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients; 