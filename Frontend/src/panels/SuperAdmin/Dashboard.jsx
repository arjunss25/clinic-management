import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaHospital,
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaBuilding,
  FaUserTie,
  FaEye,
  FaPlus,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
  FaCog,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserNurse,
} from 'react-icons/fa';
import {
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showClinicModal, setShowClinicModal] = useState(false);
  const navigate = useNavigate();

  // Clinic registration form state
  const [clinicForm, setClinicForm] = useState({
    name: '',
    license: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    specialties: [],
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  const cardHover = { y: -2, transition: { duration: 0.2 } };

  // Sample data
  const stats = {
    totalClinics: 12,
    totalDoctors: 45,
    totalPatients: 1247,
    activeClinics: 11,
    monthlyRevenue: 125000,
    growthRate: 8.5,
  };

  const expiringSubscriptions = [
    {
      id: 1,
      clinicName: 'City Medical Center',
      subscriptionType: 'Premium',
      expiryDate: '2024-01-15',
      daysLeft: 3,
      status: 'critical',
      contactEmail: 'admin@citymedical.com',
      contactPhone: '+1 (555) 123-4567',
    },
    {
      id: 2,
      clinicName: 'Downtown Medical Group',
      subscriptionType: 'Standard',
      expiryDate: '2024-01-20',
      daysLeft: 8,
      status: 'warning',
      contactEmail: 'info@downtownmedical.com',
      contactPhone: '+1 (555) 234-5678',
    },
    {
      id: 3,
      clinicName: 'Riverside Healthcare',
      subscriptionType: 'Premium',
      expiryDate: '2024-01-25',
      daysLeft: 13,
      status: 'warning',
      contactEmail: 'admin@riversidehealth.com',
      contactPhone: '+1 (555) 345-6789',
    },
    {
      id: 4,
      clinicName: 'Community Medical Clinic',
      subscriptionType: 'Basic',
      expiryDate: '2024-01-12',
      daysLeft: 0,
      status: 'expired',
      contactEmail: 'contact@communityclinic.com',
      contactPhone: '+1 (555) 456-7890',
    },
  ];

  const getSubscriptionIcon = (status) => {
    switch (status) {
      case 'critical':
      case 'expired':
        return <FaExclamationTriangle className="w-4 h-4" />;
      case 'warning':
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaCheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-red-800 bg-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical':
        return 'Critical';
      case 'expired':
        return 'Expired';
      case 'warning':
        return 'Warning';
      default:
        return 'Active';
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClinicForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    setClinicForm((prev) => ({
      ...prev,
      specialties: [...prev.specialties, newSpecialty.trim()],
    }));
    setNewSpecialty('');
  };

  const removeSpecialty = (index) => {
    setClinicForm((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleSpecialtyKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecialty();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Import the superadmin API service
      const superadminAPI = await import('../../services/superadminApiService');
      
      console.log('Clinic registration data:', clinicForm);
      
      // Send data to API
      const response = await superadminAPI.default.registerClinic(clinicForm);
      
      if (response.success) {
        console.log('Clinic registered successfully:', response);
        // Show success message
        alert('Clinic registered successfully!');
        
        // Reset form and close modal
        setClinicForm({
          name: '',
          license: '',
          location: '',
          address: '',
          phone: '',
          email: '',
          contactPerson: '',
          specialties: [],
        });
        setShowClinicModal(false);
        
        // Refresh clinic data if needed
        // You might want to call a function to refresh the clinic list here
      } else {
        console.error('Clinic registration failed:', response.message);
        alert(`Registration failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Error registering clinic:', error);
      alert(`Registration failed: ${error.message || 'An error occurred'}`);
    }
  };

  const openClinicModal = () => {
    setShowClinicModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage clinics, doctors, and system-wide operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={openClinicModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Register Clinic
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Total Clinics */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Total Clinics</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalClinics}
            </p>
            <p className="text-gray-600 text-sm">
              {stats.activeClinics} active
            </p>
          </div>
        </motion.div>

        {/* Total Doctors */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
              <FaUserMd className="w-5 h-5 text-[#1B56FD]" />
            </div>
            <p className="text-gray-500 text-sm">Total Doctors</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalDoctors}
            </p>
            <p className="text-gray-600 text-sm">+5 this month</p>
          </div>
        </motion.div>

        {/* Total Patients */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Patients</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalPatients}
            </p>
            <p className="text-green-600 text-sm font-medium">
              +12% this month
            </p>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-purple-500/5 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">Monthly Revenue</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              ${(stats.monthlyRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-green-600 text-sm font-medium">
              +{stats.growthRate}% vs last month
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Expiring Subscriptions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
        >
          <motion.div variants={itemVariants}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Clinics with Expiring Subscriptions
                    </h3>
                    <p className="text-white/80 text-xs">
                      Clinics requiring immediate attention for subscription
                      renewal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/superadmin/subscriptions')}
                  className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="p-6">
              <div className="space-y-4">
                {expiringSubscriptions.map((clinic) => (
                  <motion.div
                    key={clinic.id}
                    variants={itemVariants}
                    className="group bg-white rounded-xl p-4 border border-[#E9DFC3]/70 hover:border-[#1B56FD] shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          clinic.status === 'critical' ||
                          clinic.status === 'expired'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        {getSubscriptionIcon(clinic.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {clinic.clinicName}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              clinic.status
                            )}`}
                          >
                            {getStatusText(clinic.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaBuilding className="w-3 h-3" />
                            {clinic.subscriptionType}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {clinic.daysLeft === 0
                              ? 'Expired'
                              : `${clinic.daysLeft} days left`}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {new Date(clinic.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{clinic.contactEmail}</span>
                          <span>{clinic.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() =>
                              navigate(`/superadmin/clinics/${clinic.id}`)
                            }
                            className="px-3 py-1.5 bg-[#0118D8] text-white text-xs font-medium rounded-lg hover:bg-[#0118D8]/90 transition-colors"
                          >
                            View Clinic
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/superadmin/subscriptions/renew/${clinic.id}`
                              )
                            }
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Renew Subscription
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm"
      >
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={openClinicModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors"
            >
              <FaHospital className="w-4 h-4" />
              Register Clinic
            </button>
            <button
              onClick={() => navigate('/superadmin/analytics')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors"
            >
              <FaChartLine className="w-4 h-4" />
              View Analytics
            </button>
            <button
              onClick={() => navigate('/superadmin/settings')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors"
            >
              <FaCog className="w-4 h-4" />
              System Settings
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Clinic Registration Modal */}
      {showClinicModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowClinicModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Register New Clinic
                </h3>
                <p className="text-sm mt-1 text-gray-500">
                  Add a clinic with complete information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowClinicModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaHospital className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                    Clinic Name
                  </label>
                  <input
                    name="name"
                    value={clinicForm.name}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="Enter clinic name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                    License Number
                  </label>
                  <input
                    name="license"
                    value={clinicForm.license}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="Enter license number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                    City/Location
                  </label>
                  <input
                    name="location"
                    value={clinicForm.location}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserNurse className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                    Contact Person
                  </label>
                  <input
                    name="contactPerson"
                    value={clinicForm.contactPerson}
                    onChange={handleFormChange}
                    type="text"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="e.g., Dr. John Smith"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={clinicForm.address}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                  style={{ borderColor: '#ECEEF2' }}
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={clinicForm.phone}
                    onChange={handleFormChange}
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={clinicForm.email}
                    onChange={handleFormChange}
                    type="email"
                    className="w-full px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    style={{ borderColor: '#ECEEF2' }}
                    placeholder="clinic@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserMd className="inline w-4 h-4 mr-2 text-[#0118D8]" />
                  Medical Specialties
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={handleSpecialtyKey}
                      placeholder="Add a specialty (e.g., Cardiology)"
                      className="flex-1 px-3 py-2 rounded-lg text-sm border-2 focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                      style={{ borderColor: '#ECEEF2' }}
                    />
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {clinicForm.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {clinicForm.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-[#0118D8]/10 text-[#0118D8] rounded-full text-sm"
                        >
                          {specialty}
                          <button
                            type="button"
                            onClick={() => removeSpecialty(index)}
                            className="w-4 h-4 rounded-full bg-[#0118D8]/20 hover:bg-[#0118D8]/30 transition-colors flex items-center justify-center"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECEEF2]">
                <button
                  type="button"
                  onClick={() => setShowClinicModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <FaPlus className="w-4 h-4" />
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

export default Dashboard;
