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
} from 'react-icons/fa';

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
    topClinics: [
      { name: 'City Medical Center', patients: 450, appointments: 1200, revenue: 45000 },
      { name: 'Heart Care Clinic', patients: 320, appointments: 890, revenue: 32000 },
      { name: 'Downtown Medical Group', patients: 280, appointments: 756, revenue: 28000 },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into clinic management system</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clinics</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalClinics}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaHospital className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {getGrowthIcon(analyticsData.growthRate)}
            <span className={`text-sm font-medium ${getGrowthColor(analyticsData.growthRate)}`}>
              +{analyticsData.growthRate}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalDoctors}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <FaUserMd className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {getGrowthIcon(analyticsData.patientGrowth)}
            <span className={`text-sm font-medium ${getGrowthColor(analyticsData.patientGrowth)}`}>
              +{analyticsData.patientGrowth}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <FaCalendarAlt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {getGrowthIcon(analyticsData.appointmentGrowth)}
            <span className={`text-sm font-medium ${getGrowthColor(analyticsData.appointmentGrowth)}`}>
              +{analyticsData.appointmentGrowth}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(analyticsData.totalRevenue / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <FaChartLine className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {getGrowthIcon(analyticsData.revenueGrowth)}
            <span className={`text-sm font-medium ${getGrowthColor(analyticsData.revenueGrowth)}`}>
              +{analyticsData.revenueGrowth}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Clinics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Clinics</h3>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData.topClinics.map((clinic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{clinic.name}</p>
                    <p className="text-sm text-gray-500">{clinic.patients} patients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(clinic.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-500">{clinic.appointments} appointments</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Doctors</h3>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData.topDoctors.map((doctor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <div className="flex items-center gap-2">
                      <FaStar className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm text-gray-500">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{doctor.patients} patients</p>
                  <p className="text-sm text-gray-500">{doctor.appointments} appointments</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Specialization Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Doctor Specializations</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.specializations.map((spec, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{spec.name}</p>
                  <p className="text-sm text-gray-500">{spec.doctors} doctors</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{spec.patients}</p>
                  <p className="text-sm text-gray-500">patients</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
