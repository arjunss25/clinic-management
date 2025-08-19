import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserNurse,
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
  FaUserTie,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Sample staff data
  const staff = [
    {
      id: 'ST-001',
      name: 'Nurse Emily Johnson',
      role: 'Registered Nurse',
      clinic: 'City Medical Center',
      clinicId: 'CL-001',
      email: 'emily.johnson@citymedical.com',
      phone: '+1 (555) 123-4567',
      status: 'Active',
      experience: '8 years',
      education: 'BSN - University of Pennsylvania',
      license: 'NY-RN-2024-001',
      department: 'Emergency Department',
      registrationDate: '2024-01-15',
      availability: 'Mon-Fri, 7AM-7PM',
      certifications: ['ACLS', 'PALS', 'BLS'],
    },
    {
      id: 'ST-002',
      name: 'Medical Assistant Sarah Chen',
      role: 'Medical Assistant',
      clinic: 'City Medical Center',
      clinicId: 'CL-001',
      email: 'sarah.chen@citymedical.com',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      experience: '5 years',
      education: 'Associate Degree - Medical Assisting',
      license: 'NY-MA-2024-002',
      department: 'Cardiology',
      registrationDate: '2024-02-01',
      availability: 'Mon-Thu, 8AM-6PM',
      certifications: ['CMA', 'BLS'],
    },
    {
      id: 'ST-003',
      name: 'Receptionist Michael Brown',
      role: 'Receptionist',
      clinic: 'Heart Care Clinic',
      clinicId: 'CL-002',
      email: 'michael.brown@heartcare.com',
      phone: '+1 (555) 345-6789',
      status: 'Active',
      experience: '3 years',
      education: 'High School Diploma',
      license: '',
      department: 'Front Office',
      registrationDate: '2024-03-10',
      availability: 'Mon-Fri, 9AM-5PM',
      certifications: ['Customer Service'],
    },
    {
      id: 'ST-004',
      name: 'Lab Technician Lisa Davis',
      role: 'Laboratory Technician',
      clinic: 'Downtown Medical Group',
      clinicId: 'CL-003',
      email: 'lisa.davis@downtownmed.com',
      phone: '+1 (555) 456-7890',
      status: 'Pending',
      experience: '6 years',
      education: 'BS - Medical Laboratory Science',
      license: 'IL-MLT-2024-004',
      department: 'Laboratory',
      registrationDate: '2024-03-15',
      availability: 'Mon-Fri, 8AM-4PM',
      certifications: ['MLT', 'ASCP'],
    },
  ];

  // Sample clinics for filter
  const clinics = [
    { id: 'all', name: 'All Clinics' },
    { id: 'CL-001', name: 'City Medical Center' },
    { id: 'CL-002', name: 'Heart Care Clinic' },
    { id: 'CL-003', name: 'Downtown Medical Group' },
  ];

  // Sample roles for filter
  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'nurse', name: 'Registered Nurse' },
    { id: 'assistant', name: 'Medical Assistant' },
    { id: 'receptionist', name: 'Receptionist' },
    { id: 'technician', name: 'Laboratory Technician' },
    { id: 'pharmacist', name: 'Pharmacist' },
  ];

  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || staffMember.status.toLowerCase() === selectedFilter;
    const matchesClinic = selectedClinic === 'all' || staffMember.clinicId === selectedClinic;
    const matchesRole = selectedRole === 'all' || staffMember.role.toLowerCase().includes(selectedRole);
    return matchesSearch && matchesFilter && matchesClinic && matchesRole;
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

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'registered nurse':
        return 'bg-blue-100 text-blue-800';
      case 'medical assistant':
        return 'bg-green-100 text-green-800';
      case 'receptionist':
        return 'bg-purple-100 text-purple-800';
      case 'laboratory technician':
        return 'bg-orange-100 text-orange-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Register and manage healthcare staff members</p>
        </div>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Register New Staff
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search staff..."
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
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map((staffMember) => (
          <motion.div
            key={staffMember.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FaUserNurse className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{staffMember.name}</h3>
                    <p className="text-sm text-gray-600">{staffMember.role}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaHospital className="w-3 h-3" />
                      {staffMember.clinic}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(staffMember.status)}`}>
                    {staffMember.status}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="w-3 h-3" />
                  {staffMember.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaEnvelope className="w-3 h-3" />
                  {staffMember.email}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaGraduationCap className="w-3 h-3" />
                  {staffMember.experience} experience
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="w-3 h-3" />
                  {staffMember.availability}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUserTie className="w-3 h-3" />
                  {staffMember.department}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {staffMember.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {cert}
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

      {/* Register Staff Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Register New Staff Member</h2>
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
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]">
                    <option value="">Select Role</option>
                    <option value="nurse">Registered Nurse</option>
                    <option value="assistant">Medical Assistant</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="technician">Laboratory Technician</option>
                    <option value="pharmacist">Pharmacist</option>
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
                    Department
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]"
                    placeholder="Enter department"
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
                    placeholder="Enter education details"
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
                  Register Staff
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Staff;
