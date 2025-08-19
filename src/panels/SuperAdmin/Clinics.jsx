import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHospital,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaUserNurse,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';

const Clinics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Sample clinics data
  const clinics = [
    {
      id: 'CL-001',
      name: 'City Medical Center',
      location: 'New York, NY',
      address: '123 Medical Plaza, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'info@citymedical.com',
      status: 'Active',
      doctors: 8,
      staff: 15,
      patients: 450,
      registrationDate: '2024-01-15',
      license: 'NY-MED-2024-001',
      specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    },
    {
      id: 'CL-002',
      name: 'Heart Care Clinic',
      location: 'Los Angeles, CA',
      address: '456 Health Street, Los Angeles, CA 90210',
      phone: '+1 (555) 234-5678',
      email: 'contact@heartcare.com',
      status: 'Active',
      doctors: 5,
      staff: 12,
      patients: 320,
      registrationDate: '2024-02-01',
      license: 'CA-MED-2024-002',
      specialties: ['Cardiology', 'Cardiovascular Surgery'],
    },
    {
      id: 'CL-003',
      name: 'Downtown Medical Group',
      location: 'Chicago, IL',
      address: '789 Healthcare Ave, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'hello@downtownmed.com',
      status: 'Pending',
      doctors: 3,
      staff: 8,
      patients: 180,
      registrationDate: '2024-03-10',
      license: 'IL-MED-2024-003',
      specialties: ['General Medicine', 'Pediatrics'],
    },
  ];

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || clinic.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
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
          <h1 className="text-2xl font-bold text-gray-900">Clinic Management</h1>
          <p className="text-gray-600">Register and manage healthcare clinics</p>
        </div>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Register New Clinic
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clinics by name or location..."
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
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <motion.div
            key={clinic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#0118D8]/10 flex items-center justify-center">
                    <FaHospital className="w-6 h-6 text-[#0118D8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {clinic.location}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(clinic.status)}`}>
                  {clinic.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="w-3 h-3" />
                  {clinic.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaEnvelope className="w-3 h-3" />
                  {clinic.email}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{clinic.doctors}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <FaUserMd className="w-3 h-3" />
                    Doctors
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{clinic.staff}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <FaUserNurse className="w-3 h-3" />
                    Staff
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{clinic.patients}</div>
                  <div className="text-xs text-gray-500">Patients</div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {clinic.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {specialty}
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

      {/* Register Clinic Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Register New Clinic</h2>
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
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Enter clinic name"
                  />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                  rows="3"
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Register Clinic
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Clinics;
