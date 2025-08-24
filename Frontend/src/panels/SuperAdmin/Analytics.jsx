import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHospital,
  FaUserMd,
  FaUserNurse,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaCheckCircle,
  FaCreditCard,
  FaDollarSign,
  FaPercentage,
  FaChartBar,
} from 'react-icons/fa';
import {
  Users,
  Building2,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  DollarSign,
} from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analyticsData = {
    totalClinics: 12,
    totalDoctors: 45,
    totalStaff: 89,
    totalPatients: 1247,
    totalAppointments: 3456,
    totalRevenue: 125000,
    growthRate: 8.5,
    patientGrowth: 12.3,
    appointmentGrowth: 15.7,
    revenueGrowth: 8.2,
    
    // Revenue Breakdown
    revenueBreakdown: {
      subscriptionRevenue: 85000,
      platformUsageRevenue: 40000,
      subscriptionGrowth: 12.5,
      platformUsageGrowth: 18.3,
    },
    
    // Subscription Analytics
    subscriptionAnalytics: {
      totalSubscribers: 8,
      activeSubscriptions: 7,
      monthlyRecurringRevenue: 85000,
      averageRevenuePerUser: 10625,
      subscriptionPlans: [
        { name: 'Basic Plan', price: 5000, subscribers: 3, revenue: 15000 },
        { name: 'Professional Plan', price: 10000, subscribers: 3, revenue: 30000 },
        { name: 'Enterprise Plan', price: 20000, subscribers: 1, revenue: 20000 },
        { name: 'Premium Plan', price: 15000, subscribers: 0, revenue: 0 },
      ],
    },
    
    // Platform Usage Analytics
    platformUsageAnalytics: {
      totalAppointments: 3456,
      platformFeePerAppointment: 12,
      totalPlatformFees: 41472,
      appointmentsByPanel: [
        { panel: 'Patient Panel', appointments: 2100, revenue: 25200 },
        { panel: 'Doctor Panel', appointments: 856, revenue: 10272 },
        { panel: 'Clinic Panel', appointments: 500, revenue: 6000 },
      ],
      monthlyUsage: [
        { month: 'Jan', appointments: 2800, revenue: 33600 },
        { month: 'Feb', appointments: 2950, revenue: 35400 },
        { month: 'Mar', appointments: 3100, revenue: 37200 },
        { month: 'Apr', appointments: 3456, revenue: 41472 },
      ],
    },
    
    topClinics: [
      { name: 'City Medical Center', patients: 450, appointments: 1200, revenue: 45000, subscription: 'Professional' },
      { name: 'Heart Care Clinic', patients: 320, appointments: 890, revenue: 32000, subscription: 'Basic' },
      { name: 'Downtown Medical Group', patients: 280, appointments: 756, revenue: 28000, subscription: 'Enterprise' },
    ],
    topDoctors: [
      { name: 'Dr. Sarah Wilson', patients: 145, rating: 4.8, appointments: 1247 },
      { name: 'Dr. Emily Davis', patients: 203, rating: 4.9, appointments: 1890 },
      { name: 'Dr. Michael Chen', patients: 98, rating: 4.6, appointments: 856 },
    ],
    specializations: [
      { name: 'Cardiology', doctors: 8, patients: 450 },
      { name: 'Neurology', doctors: 6, patients: 320 },
      { name: 'Orthopedics', doctors: 5, patients: 280 },
      { name: 'Pediatrics', doctors: 7, patients: 380 },
    ],
  };

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
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into clinic management system revenue
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
              {analyticsData.totalClinics}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(analyticsData.growthRate)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.growthRate)}`}>
                +{analyticsData.growthRate}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

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
              {analyticsData.totalDoctors}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(analyticsData.patientGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.patientGrowth)}`}>
                +{analyticsData.patientGrowth}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <FaCalendarAlt className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Appointments</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {analyticsData.totalAppointments}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(analyticsData.appointmentGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.appointmentGrowth)}`}>
                +{analyticsData.appointmentGrowth}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-purple-500/5 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(analyticsData.totalRevenue)}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(analyticsData.revenueGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.revenueGrowth)}`}>
                +{analyticsData.revenueGrowth}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Revenue Breakdown Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Subscription Revenue */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Subscription Revenue
                </h3>
                <p className="text-white/80 text-xs">
                  Monthly recurring revenue from platform subscriptions
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.revenueBreakdown.subscriptionRevenue)}
              </span>
              <div className="flex items-center gap-2">
                {getGrowthIcon(analyticsData.revenueBreakdown.subscriptionGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(analyticsData.revenueBreakdown.subscriptionGrowth)}`}>
                  +{analyticsData.revenueBreakdown.subscriptionGrowth}%
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Subscribers</span>
                <span className="font-medium">{analyticsData.subscriptionAnalytics.activeSubscriptions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Average Revenue Per User</span>
                <span className="font-medium">{formatCurrency(analyticsData.subscriptionAnalytics.averageRevenuePerUser)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Monthly Recurring Revenue</span>
                <span className="font-medium">{formatCurrency(analyticsData.subscriptionAnalytics.monthlyRecurringRevenue)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Usage Revenue */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Platform Usage Revenue
                </h3>
                <p className="text-white/80 text-xs">
                  Revenue from appointment-based platform fees
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.revenueBreakdown.platformUsageRevenue)}
              </span>
              <div className="flex items-center gap-2">
                {getGrowthIcon(analyticsData.revenueBreakdown.platformUsageGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(analyticsData.revenueBreakdown.platformUsageGrowth)}`}>
                  +{analyticsData.revenueBreakdown.platformUsageGrowth}%
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Appointments</span>
                <span className="font-medium">{analyticsData.platformUsageAnalytics.totalAppointments}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Platform Fee Per Appointment</span>
                <span className="font-medium">{formatCurrency(analyticsData.platformUsageAnalytics.platformFeePerAppointment)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Platform Fees</span>
                <span className="font-medium">{formatCurrency(analyticsData.platformUsageAnalytics.totalPlatformFees)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Subscription Plans Analytics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaChartBar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Subscription Plans Performance
                </h3>
                <p className="text-white/80 text-xs">
                  Revenue breakdown by subscription tier
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.subscriptionAnalytics.subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <p className="text-2xl font-bold text-[#0118D8]">
                      {formatCurrency(plan.price)}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subscribers</span>
                        <span className="font-medium">{plan.subscribers}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium">{formatCurrency(plan.revenue)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Platform Usage by Panel */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaChartLine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Platform Usage by Panel
                </h3>
                <p className="text-white/80 text-xs">
                  Appointments and revenue by user panel
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData.platformUsageAnalytics.appointmentsByPanel.map((panel, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{panel.panel}</p>
                  <p className="text-sm text-gray-500">{panel.appointments} appointments</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(panel.revenue)}</p>
                  <p className="text-sm text-gray-500">
                    {((panel.revenue / analyticsData.platformUsageAnalytics.totalPlatformFees) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing Clinics with Subscription Info */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Top Performing Clinics
                </h3>
                <p className="text-white/80 text-xs">
                  Highest performing clinics with subscription details
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData.topClinics.map((clinic, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-white rounded-xl p-4 border border-[#E9DFC3]/70 hover:border-[#1B56FD] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0118D8]/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#0118D8]">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-[#0118D8] transition-colors">
                        {clinic.name}
                      </p>
                      <p className="text-sm text-gray-500">{clinic.patients} patients</p>
                      <p className="text-xs text-green-600 font-medium">{clinic.subscription} Plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(clinic.revenue)}</p>
                    <p className="text-sm text-gray-500">{clinic.appointments} appointments</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Top Performing Doctors Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaUserMd className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Top Performing Doctors
                </h3>
                <p className="text-white/80 text-xs">
                  Highest rated and most active doctors on the platform
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.topDoctors.map((doctor, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-[#E9DFC3]/70 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {doctor.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                          <span className="text-xs text-gray-500">/ 5.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <FaUserMd className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                  
                                     <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                       <div className="flex items-center gap-2">
                         <FaUsers className="w-4 h-4 text-blue-500" />
                         <span className="text-sm text-gray-600">Patients</span>
                       </div>
                       <span className="font-semibold text-gray-900">{doctor.patients}</span>
                     </div>
                     
                     <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                       <div className="flex items-center gap-2">
                         <FaCalendarAlt className="w-4 h-4 text-green-500" />
                         <span className="text-sm text-gray-600">Appointments</span>
                       </div>
                       <span className="font-semibold text-gray-900">{doctor.appointments}</span>
                     </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
                 </motion.div>
       </motion.div>
     </motion.div>
   );
 };

export default Analytics;
