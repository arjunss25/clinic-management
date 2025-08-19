import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserMd,
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaHospital,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <p className="text-gray-600">Register and manage healthcare doctors</p>
        </div>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Register New Doctor
        </button>
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
            className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1B56FD]/10 flex items-center justify-center">
                    <FaUserMd className="w-6 h-6 text-[#1B56FD]" />
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                  {doctor.status}
                </span>
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{doctor.patients}</div>
                  <div className="text-xs text-gray-500">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{doctor.appointments}</div>
                  <div className="text-xs text-gray-500">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-1">
                    {doctor.rating}
                    <FaStar className="w-3 h-3 text-yellow-500" />
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaGraduationCap className="w-3 h-3" />
                  {doctor.experience} experience
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="w-3 h-3" />
                  {doctor.availability}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <FaEye className="w-4 h-4" />
                  View Details
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Register Doctor Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Register New Doctor</h2>
              <button
                onClick={() => setShowRegisterForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Dr. Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]">
                    <option value="">Select Specialization</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="psychiatry">Psychiatry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]">
                    <option value="">Select Clinic</option>
                    {clinics.filter(c => c.id !== 'all').map(clinic => (
                      <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Enter years of experience"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="e.g., MD - Harvard Medical School"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Doctors;
