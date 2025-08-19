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
  FaUserNurse,
  FaEye,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { Users, Building2, UserCheck, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

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
    totalStaff: 89,
    totalPatients: 1247,
    activeClinics: 11,
    pendingApprovals: 3,
    monthlyRevenue: 125000,
    growthRate: 8.5,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'clinic_registered',
      title: 'New Clinic Registered',
      description: 'City Medical Center has been registered',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'doctor_approved',
      title: 'Doctor Approved',
      description: 'Dr. Sarah Wilson has been approved',
      time: '4 hours ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'staff_added',
      title: 'Staff Member Added',
      description: 'Nurse Emily Davis added to Cardiology Clinic',
      time: '6 hours ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'clinic_pending',
      title: 'Clinic Approval Pending',
      description: 'Downtown Medical Group awaiting approval',
      time: '1 day ago',
      status: 'pending',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'clinic',
      name: 'Downtown Medical Group',
      location: 'New York, NY',
      submittedBy: 'Dr. Michael Brown',
      submittedDate: '2024-03-15',
    },
    {
      id: 2,
      type: 'doctor',
      name: 'Dr. Jennifer Lee',
      specialization: 'Neurology',
      clinic: 'City Medical Center',
      submittedDate: '2024-03-14',
    },
    {
      id: 3,
      type: 'staff',
      name: 'Nurse Robert Johnson',
      role: 'Registered Nurse',
      clinic: 'Heart Care Clinic',
      submittedDate: '2024-03-13',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'clinic_registered':
      case 'clinic_pending':
        return <FaHospital className="w-4 h-4" />;
      case 'doctor_approved':
        return <FaUserMd className="w-4 h-4" />;
      case 'staff_added':
        return <FaUserNurse className="w-4 h-4" />;
      default:
        return <FaUsers className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
            Manage clinics, doctors, staff, and system-wide operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/superadmin/clinics/register')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Register Clinic
          </button>
          <button 
            onClick={() => navigate('/superadmin/doctors/register')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaUserMd className="w-4 h-4" />
            Add Doctor
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
            <p className="text-gray-600 text-sm">
              +5 this month
            </p>
          </div>
        </motion.div>

        {/* Total Staff */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <FaUserNurse className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Total Staff</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalStaff}
            </p>
            <p className="text-gray-600 text-sm">
              Nurses & Support
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Approvals
              </h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {pendingApprovals.length}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  {approval.type === 'clinic' && <FaHospital className="w-4 h-4 text-yellow-600" />}
                  {approval.type === 'doctor' && <FaUserMd className="w-4 h-4 text-yellow-600" />}
                  {approval.type === 'staff' && <FaUserNurse className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {approval.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {approval.type === 'clinic' && approval.location}
                    {approval.type === 'doctor' && approval.specialization}
                    {approval.type === 'staff' && approval.role}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted {approval.submittedDate}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Review
                </button>
              </div>
            ))}
            <button 
              onClick={() => navigate('/superadmin/approvals')}
              className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Approvals
            </button>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/superadmin/clinics/register')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <FaHospital className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Register Clinic</span>
          </button>
          <button 
            onClick={() => navigate('/superadmin/doctors/register')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <FaUserMd className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Add Doctor</span>
          </button>
          <button 
            onClick={() => navigate('/superadmin/staff/register')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <FaUserNurse className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Add Staff</span>
          </button>
          <button 
            onClick={() => navigate('/superadmin/approvals')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <FaCheckCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">Review Approvals</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 