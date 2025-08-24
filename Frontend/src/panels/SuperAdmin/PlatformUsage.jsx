import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaDollarSign,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaHospital,
  FaUserMd,
  FaArrowUp,
  FaArrowDown,
  FaCog,
  FaEye,
  FaDownload,
  FaTimes,
  FaPlus,
} from 'react-icons/fa';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  User,
  Settings,
  Eye,
  Download,
} from 'lucide-react';

// Theme colors (matching your existing design)
const COLORS = {
  primary: '#0118D8',
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
};

const PlatformUsage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [newFeeUsage, setNewFeeUsage] = useState({
    panel: '',
    feeType: '',
    amount: '',
    clinic: '',
    effectiveDate: '',
    isActive: true,
  });

  const platformUsageData = {
    overview: {
      totalAppointments: 3456,
      totalRevenue: 41472,
      platformFeePerAppointment: 12,
      averageAppointmentsPerDay: 115,
      growthRate: 18.3,
      revenueGrowth: 15.7,
    },
    usageByPanel: [
      {
        panel: 'Patient Panel',
        appointments: 2100,
        revenue: 25200,
        percentage: 60.8,
        growth: 20.5,
        averagePerDay: 70
      },
      {
        panel: 'Doctor Panel',
        appointments: 856,
        revenue: 10272,
        percentage: 24.8,
        growth: 12.3,
        averagePerDay: 28
      },
      {
        panel: 'Clinic Panel',
        appointments: 500,
        revenue: 6000,
        percentage: 14.4,
        growth: 8.7,
        averagePerDay: 17
      }
    ],
    recentAppointments: [
      {
        id: 1,
        patientName: 'John Smith',
        doctorName: 'Dr. Sarah Wilson',
        clinicName: 'City Medical Center',
        appointmentDate: '2024-01-15',
        panel: 'Patient Panel',
        platformFee: 12,
        status: 'completed'
      },
      {
        id: 2,
        patientName: 'Jane Doe',
        doctorName: 'Dr. Emily Davis',
        clinicName: 'Heart Care Clinic',
        appointmentDate: '2024-01-14',
        panel: 'Doctor Panel',
        platformFee: 12,
        status: 'completed'
      }
    ]
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
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

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? (
      <FaArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <FaArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPanelColor = (panel) => {
    switch (panel) {
      case 'Patient Panel':
        return 'text-blue-600 bg-blue-100';
      case 'Doctor Panel':
        return 'text-green-600 bg-green-100';
      case 'Clinic Panel':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Modal handlers
  const handleOpenAddFeeModal = () => {
    setShowAddFeeModal(true);
  };

  const handleCloseAddFeeModal = () => {
    setShowAddFeeModal(false);
    setNewFeeUsage({
      panel: '',
      feeType: '',
      amount: '',
      clinic: '',
      effectiveDate: '',
      isActive: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFeeUsage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddFeeUsage = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the fee usage
    console.log('Adding fee usage:', newFeeUsage);
    // For now, just close the modal
    handleCloseAddFeeModal();
  };

  // Options for form fields
  const PANEL_OPTIONS = [
    { value: 'Patient Panel', label: 'Patient Panel' },
    { value: 'Doctor Panel', label: 'Doctor Panel' },
    { value: 'Clinic Panel', label: 'Clinic Panel' },
  ];

  const FEE_TYPE_OPTIONS = [
    { value: 'per_appointment', label: 'Per Appointment' },
    { value: 'monthly_subscription', label: 'Monthly Subscription' },
    { value: 'transaction_fee', label: 'Transaction Fee' },
    { value: 'platform_fee', label: 'Platform Fee' },
  ];

  const CLINIC_OPTIONS = [
    { value: 'city_medical_center', label: 'City Medical Center' },
    { value: 'heart_care_clinic', label: 'Heart Care Clinic' },
    { value: 'general_health_clinic', label: 'General Health Clinic' },
    { value: 'pediatric_clinic', label: 'Pediatric Clinic' },
    { value: 'dental_clinic', label: 'Dental Clinic' },
    { value: 'orthopedic_clinic', label: 'Orthopedic Clinic' },
  ];

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
            Platform Usage Charges
          </h1>
          <p className="text-gray-600">
            Monitor and manage platform usage fees from appointments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-[#E9DFC3]/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent bg-white text-gray-900"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            onClick={handleOpenAddFeeModal}
            className="px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#1B56FD] transition-colors flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Fee Usage
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Total Appointments</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {platformUsageData.overview.totalAppointments}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(platformUsageData.overview.growthRate)}
              <span className={`text-sm font-medium ${getGrowthColor(platformUsageData.overview.growthRate)}`}>
                +{platformUsageData.overview.growthRate}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Platform Revenue</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(platformUsageData.overview.totalRevenue)}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(platformUsageData.overview.revenueGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(platformUsageData.overview.revenueGrowth)}`}>
                +{platformUsageData.overview.revenueGrowth}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-purple-500/5 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">Fee Per Appointment</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(platformUsageData.overview.platformFeePerAppointment)}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Current platform fee
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-500/5 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-500 text-sm">Avg Per Day</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {platformUsageData.overview.averageAppointmentsPerDay}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Appointments per day
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Usage by Panel */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {platformUsageData.usageByPanel.map((panel, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {panel.panel}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {panel.percentage.toFixed(1)}% of total usage
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {panel.appointments}
                </span>
                <div className="flex items-center gap-2">
                  {getGrowthIcon(panel.growth)}
                  <span className={`text-sm font-medium ${getGrowthColor(panel.growth)}`}>
                    +{panel.growth}%
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium">{formatCurrency(panel.revenue)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg Per Day</span>
                  <span className="font-medium">{panel.averagePerDay}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Percentage</span>
                  <span className="font-medium">{panel.percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Appointments */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Recent Appointments with Platform Fees</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Clinic</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Panel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Platform Fee</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {platformUsageData.recentAppointments.map((appointment) => (
                  <motion.tr
                    key={appointment.id}
                    variants={itemVariants}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{appointment.clinicName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{formatDate(appointment.appointmentDate)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPanelColor(appointment.panel)}`}>
                        {appointment.panel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{formatCurrency(appointment.platformFee)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        {appointment.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add Fee Usage Modal */}
      {showAddFeeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={handleCloseAddFeeModal}
        >
          <div
            className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <div>
                <h3 className="text-xl font-semibold" style={{ color: COLORS.text }}>
                  Add Fee Usage
                </h3>
                <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                  Configure platform fee usage for different panels
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseAddFeeModal}
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
            <form onSubmit={handleAddFeeUsage} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Panel *
                  </label>
                  <select
                    name="panel"
                    value={newFeeUsage.panel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
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
                    <option value="">Select Panel</option>
                    {PANEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Fee Type *
                  </label>
                  <select
                    name="feeType"
                    value={newFeeUsage.feeType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
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
                    <option value="">Select Fee Type</option>
                    {FEE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newFeeUsage.amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
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
                    placeholder="0.00"
                  />
                </div>

                {/* Effective Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                    Effective Date *
                  </label>
                  <input
                    type="date"
                    name="effectiveDate"
                    value={newFeeUsage.effectiveDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
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
                  />
                </div>

                                 {/* Clinic Selection */}
                 <div>
                   <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                     Clinic *
                   </label>
                   <select
                     name="clinic"
                     value={newFeeUsage.clinic}
                     onChange={handleInputChange}
                     required
                     className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
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
                     <option value="">Select Clinic</option>
                     {CLINIC_OPTIONS.map((option) => (
                       <option key={option.value} value={option.value}>
                         {option.label}
                       </option>
                     ))}
                   </select>
                 </div>

                {/* Active Status */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={newFeeUsage.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-2 transition-all"
                      style={{
                        borderColor: COLORS.border,
                        accentColor: COLORS.primary,
                      }}
                    />
                    <label className="text-sm font-medium" style={{ color: COLORS.text }}>
                      Active (Enable this fee usage immediately)
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <button
                  type="button"
                  onClick={handleCloseAddFeeModal}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `2px solid ${COLORS.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = `${COLORS.textMuted}10`;
                    e.target.style.borderColor = COLORS.textMuted;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = COLORS.white;
                    e.target.style.borderColor = COLORS.border;
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    color: COLORS.white,
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  Add Fee Usage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlatformUsage;
