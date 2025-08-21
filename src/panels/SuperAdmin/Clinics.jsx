import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHospital,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaUserNurse,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
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

  // Register form state (matches card details)
  const [clinicForm, setClinicForm] = useState({
    name: '',
    license: '',
    location: '',
    address: '',
    phone: '',
    email: '',
  });
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClinicForm(prev => ({ ...prev, [name]: value }));
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    setSpecialties(prev => [...prev, newSpecialty.trim()]);
    setNewSpecialty('');
  };

  const removeSpecialty = (index) => {
    setSpecialties(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecialtyKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecialty();
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0118D8] to-[#1B56FD] bg-clip-text text-transparent">
            Clinic Management
          </h1>
          <p className="text-gray-600">Register, review and manage your partner clinics</p>
        </div>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white shadow-sm hover:shadow-md transition-all"
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
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
            whileHover={{ y: -2 }}
            className="group bg-white rounded-2xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-lg hover:border-[#1B56FD] transition-all h-full flex flex-col"
          >
            <div className="h-1.5 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] rounded-t-2xl" />
            <div className="p-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] text-white shadow-md ring-1 ring-[#0118D8]/20 flex items-center justify-center">
                    <FaHospital className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {clinic.location}
                    </p>
                  </div>
                </div>
                {/* Status removed as per requirement */}
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

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs border border-[#E9DFC3]/70 bg-gray-50 text-gray-700">
                  License: {clinic.license}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs border border-[#E9DFC3]/70 bg-gray-50 text-gray-700">
                  Registered: {clinic.registrationDate}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E9DFC3]/70 bg-white shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#0118D8]/10 text-[#0118D8] flex items-center justify-center">
                    <FaUserMd className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 leading-none">{clinic.doctors}</div>
                    <div className="text-[11px] text-gray-500">Doctors</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E9DFC3]/70 bg-white shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#0118D8]/10 text-[#0118D8] flex items-center justify-center">
                    <FaUserNurse className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 leading-none">{clinic.staff}</div>
                    <div className="text-[11px] text-gray-500">Staff</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E9DFC3]/70 bg-white shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#0118D8]/10 text-[#0118D8] flex items-center justify-center">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 leading-none">{clinic.patients}</div>
                    <div className="text-[11px] text-gray-500">Patients</div>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {clinic.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#0118D8]/10 text-[#0118D8] rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#E9DFC3]/70">
                <button onClick={() => window.location.assign(`/superadmin/clinics/${clinic.id}`)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white shadow-sm hover:shadow-md transition-all">
                  <FaEye className="w-4 h-4" />
                  View Details
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#0118D8] text-[#0118D8] hover:bg-[#0118D8]/10 transition-colors">
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Register Clinic Modal (themed like Patients.jsx) */}
      {showRegisterForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'saturate(140%) blur(8px)' }}
          onClick={() => setShowRegisterForm(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto bg-white border"
            style={{ borderColor: '#ECEEF2' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10 bg-white" style={{ borderColor: '#ECEEF2' }}>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Register New Clinic</h3>
                <p className="text-sm mt-1 text-gray-500">Add a clinic with complete information</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105"
                style={{ background: '#ffffff', color: '#6B7280', border: '1px solid #ECEEF2' }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                  <input
                    name="name"
                    value={clinicForm.name}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="Enter clinic name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input
                    name="license"
                    value={clinicForm.license}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (City, State)</label>
                  <input
                    name="location"
                    value={clinicForm.location}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="e.g. New York, NY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={clinicForm.address}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg text-sm border-2"
                  style={{ borderColor: '#ECEEF2' }}
                  rows="3"
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={clinicForm.phone}
                    onChange={handleFormChange}
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    name="email"
                    value={clinicForm.email}
                    onChange={handleFormChange}
                    type="email"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Removed status, doctors, and staff inputs as requested */}

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={handleSpecialtyKey}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border-2"
                      style={{ borderColor: '#ECEEF2' }}
                      placeholder="Add specialty (e.g., Cardiology)"
                    />
                    <button
                      type="button"
                      onClick={addSpecialty}
                      disabled={!newSpecialty.trim()}
                      className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #0118D8, #1B56FD)', color: '#fff' }}
                    >
                      Add
                    </button>
                  </div>

                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((spec, idx) => (
                        <span key={`${spec}-${idx}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border" style={{ color: '#0118D8', borderColor: '#DCE4FF', background: '#0118D8' + '10' }}>
                          {spec}
                          <button type="button" onClick={() => removeSpecialty(idx)} className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-gray-500 border border-gray-200">
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: '#ECEEF2' }}>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: '#fff', color: '#6B7280', border: '2px solid #ECEEF2' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0118D8, #1B56FD)', color: '#fff' }}
                >
                  Register Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Clinics;
