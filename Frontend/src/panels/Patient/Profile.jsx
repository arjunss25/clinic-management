import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaPhone,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaNotesMedical,
  FaAllergies,
  FaStethoscope,
} from 'react-icons/fa';
import { MdOutlinePhoneAndroid } from 'react-icons/md';
import {
  MdLocalHospital,
  MdEmail,
  MdLocationOn,
  MdDateRange,
} from 'react-icons/md';
import { BsClockFill } from 'react-icons/bs';
import PatientProfileHistory from './PatientProfileHistory';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('medical');

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Sample patient data
  const patient = {
    name: 'Sarah Johnson',
    age: 28,
    patientId: 'PT-2024-0892',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Asthma', 'Seasonal Allergies'],
    lastVisit: 'March 15, 2024',
    nextAppointment: 'April 22, 2024 at 2:30 PM',
    insurance: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS-123456789',
    emergencyContact: {
      name: 'Michael Johnson',
      relation: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <div className="mx-auto">
          {/* Glass Card Container */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="bg-white"
          >
            {/* Header Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="p-4 sm:p-6 md:p-8 border-b border-[#E9DFC3]"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
                {/* Profile Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg transform transition-transform group-hover:scale-105">
                      SJ
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>

                  {/* Basic Info */}
                  <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {patient.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-xs sm:text-sm">
                      <span className="flex items-center gap-2">
                        <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
                        {patient.age} years old
                      </span>
                      <span className="flex items-center gap-2">
                        <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
                        {patient.phone}
                      </span>
                      <span className="hidden sm:flex items-center gap-2">
                        <MdEmail className="w-3 h-3 sm:w-4 sm:h-4" />
                        {patient.email}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="text-xs text-[#0118D8] font-mono bg-[#FFF8F8] px-2 sm:px-3 py-1 rounded-lg border border-[#E9DFC3]">
                        ID: {patient.patientId}
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1">
                        <FaCheckCircle className="w-3 h-3" />
                        Active Patient
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                  <button className="flex-1 sm:flex-none group px-4 sm:px-6 py-2 sm:py-3 bg-[#FFF8F8] text-[#0118D8] rounded-xl font-medium hover:bg-[#E9DFC3] transition-all duration-300 flex items-center justify-center gap-2 border border-[#E9DFC3]">
                    <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sm:inline">Profile Edit</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto overflow-y-hidden border-b border-[#E9DFC3] px-4 sm:px-6 md:px-8">
              {[
                { id: 'medical', label: 'Medical Info', icon: FaNotesMedical },
                { id: 'history', label: 'History', icon: BsClockFill },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 font-medium whitespace-nowrap transition-all duration-300 relative flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-[#0118D8]'
                      : 'text-gray-500 hover:text-[#1B56FD]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0118D8] to-[#1B56FD]"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'medical' && (
                  <motion.div
                    key="medical"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Medical Conditions */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/20 transition-all duration-300"
                    >
                      <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF8F8] to-[#E9DFC3]/20 flex items-center justify-center">
                          <FaStethoscope className="text-[#0118D8] w-5 h-5" />
                        </div>
                        Medical Conditions
                      </h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {patient.conditions.map((condition, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-[#FFF8F8] text-[#0118D8] rounded-xl border border-[#E9DFC3]/50 text-sm font-medium hover:bg-[#E9DFC3]/20 transition-colors cursor-default"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Allergies - Important Alert Section */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-gradient-to-br from-red-50/50 to-[#FFF8F8] rounded-2xl p-5 sm:p-6 border border-red-200/50"
                    >
                      <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <FaAllergies className="text-red-600 w-5 h-5" />
                        </div>
                        Known Allergies
                      </h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {patient.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white text-red-700 rounded-xl border border-red-200 flex items-center gap-2 text-sm font-medium hover:bg-red-50 transition-colors cursor-default"
                          >
                            <FaExclamationTriangle className="w-3.5 h-3.5" />
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Additional Info Grid */}
                    <motion.div
                      variants={containerVariants}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <motion.div
                        variants={itemVariants}
                        className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/20 transition-all duration-300"
                      >
                        <h4 className="text-gray-900 font-semibold text-sm sm:text-base mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FFF8F8] flex items-center justify-center group-hover:bg-[#E9DFC3]/20 transition-colors">
                            <MdLocationOn className="text-[#0118D8] w-4 h-4" />
                          </div>
                          Address
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {patient.address}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/20 transition-all duration-300"
                      >
                        <h4 className="text-gray-900 font-semibold text-sm sm:text-base mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FFF8F8] flex items-center justify-center group-hover:bg-[#E9DFC3]/20 transition-colors">
                            <MdDateRange className="text-[#1B56FD] w-4 h-4" />
                          </div>
                          Last Visit
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {patient.lastVisit}
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <PatientProfileHistory patientData={patient} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
