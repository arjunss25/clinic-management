import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserMd,
  FaSearch,
  FaEye,
  FaHospital,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaCalendarAlt,
} from 'react-icons/fa';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState('all');

  // Sample doctors data
  const doctors = [
    {
      id: 'DR-001',
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology',
      clinic: 'City Medical Center',
      clinicId: 'CL-001',
      email: 'sarah.wilson@citymedical.com',
      phone: '+1 (555) 123-4567',
      status: 'Active',
      experience: '12 years',
      education: 'MD - Harvard Medical School',
      license: 'NY-MD-2024-001',
      rating: 4.8,
      patients: 145,
      appointments: 1247,
      registrationDate: '2024-01-15',
      availability: 'Mon-Fri, 9AM-5PM',
      languages: ['English', 'Spanish'],
    },
    {
      id: 'DR-002',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      clinic: 'City Medical Center',
      clinicId: 'CL-001',
      email: 'michael.chen@citymedical.com',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      experience: '8 years',
      education: 'MD - Stanford Medical School',
      license: 'NY-MD-2024-002',
      rating: 4.6,
      patients: 98,
      appointments: 856,
      registrationDate: '2024-02-01',
      availability: 'Mon-Thu, 10AM-6PM',
      languages: ['English', 'Mandarin'],
    },
    {
      id: 'DR-003',
      name: 'Dr. Emily Davis',
      specialization: 'Cardiology',
      clinic: 'Heart Care Clinic',
      clinicId: 'CL-002',
      email: 'emily.davis@heartcare.com',
      phone: '+1 (555) 345-6789',
      status: 'Pending',
      experience: '15 years',
      education: 'MD - Johns Hopkins University',
      license: 'CA-MD-2024-003',
      rating: 4.9,
      patients: 203,
      appointments: 1890,
      registrationDate: '2024-03-10',
      availability: 'Mon-Fri, 8AM-4PM',
      languages: ['English'],
    },
    {
      id: 'DR-004',
      name: 'Dr. Robert Johnson',
      specialization: 'Orthopedics',
      clinic: 'Downtown Medical Group',
      clinicId: 'CL-003',
      email: 'robert.johnson@downtownmed.com',
      phone: '+1 (555) 456-7890',
      status: 'Active',
      experience: '10 years',
      education: 'MD - University of Chicago',
      license: 'IL-MD-2024-004',
      rating: 4.7,
      patients: 167,
      appointments: 1345,
      registrationDate: '2024-01-20',
      availability: 'Tue-Sat, 9AM-5PM',
      languages: ['English', 'French'],
    },
  ];

  // Sample clinics for filter
  const clinics = [
    { id: 'all', name: 'All Clinics' },
    { id: 'CL-001', name: 'City Medical Center' },
    { id: 'CL-002', name: 'Heart Care Clinic' },
    { id: 'CL-003', name: 'Downtown Medical Group' },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || doctor.status.toLowerCase() === selectedFilter;
    const matchesClinic = selectedClinic === 'all' || doctor.clinicId === selectedClinic;
    return matchesSearch && matchesFilter && matchesClinic;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">View and manage healthcare doctors</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
          >
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group bg-white rounded-2xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-lg hover:border-[#1B56FD] transition-all h-full flex flex-col"
          >
            <div className="h-1.5 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] rounded-t-2xl" />
            <div className="p-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] text-white shadow-md ring-1 ring-[#0118D8]/20 flex items-center justify-center">
                    <FaUserMd className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaHospital className="w-3 h-3" />
                      {doctor.clinic}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="w-3 h-3" />
                  {doctor.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaEnvelope className="w-3 h-3" />
                  {doctor.email}
                </div>
              </div>

                             {/* Meta chips (fixed height for uniformity) */}
               <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] items-center">
                 <span className="px-2.5 py-1 rounded-full text-xs border border-[#E9DFC3]/70 bg-gray-50 text-gray-700">
                   License: {doctor.license}
                 </span>
               </div>

              {/* Stats moved to Doctor View page */}

              {/* Details (consistent vertical spacing across cards) */}
              <div className="space-y-2 mb-4 min-h-[56px]">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaGraduationCap className="w-3 h-3" />
                  {doctor.experience} experience
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="w-3 h-3" />
                  {doctor.availability}
                </div>
              </div>


              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#E9DFC3]/70">
                <button onClick={() => window.location.assign(`/superadmin/doctors/${doctor.id}`)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white shadow-sm hover:shadow-md transition-all">
                  <FaEye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Doctors;
