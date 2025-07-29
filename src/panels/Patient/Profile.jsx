import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaPhone,
  FaCalendarAlt,
  FaFileAlt,
  FaClock,
  FaHeartbeat,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTint,
  FaUserMd,
  FaNotesMedical,
  FaAllergies,
  FaStethoscope,
  FaAmbulance
} from 'react-icons/fa';
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { 
  MdLocalHospital, 
  MdEmail,
  MdLocationOn,
  MdDateRange
} from 'react-icons/md';
import { 
  BsPersonFill,
  BsCalendar3,
  BsClockFill
} from 'react-icons/bs';
import { 
  HiOutlineDotsVertical,
  HiChevronRight
} from 'react-icons/hi';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
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
      phone: '+1 (555) 987-6543'
    }
  };

  const appointments = [
    { 
      id: 1,
      date: 'Apr 22, 2024', 
      time: '2:30 PM',
      doctor: 'Dr. Emily Chen', 
      type: 'General Checkup', 
      status: 'upcoming',
      department: 'General Medicine'
    },
    { 
      id: 2,
      date: 'Mar 15, 2024', 
      time: '10:00 AM',
      doctor: 'Dr. Emily Chen', 
      type: 'General Checkup', 
      status: 'completed',
      department: 'General Medicine'
    },
    { 
      id: 3,
      date: 'Feb 28, 2024', 
      time: '3:15 PM',
      doctor: 'Dr. James Wilson', 
      type: 'Cardiology Consultation', 
      status: 'completed',
      department: 'Cardiology'
    },
    { 
      id: 4,
      date: 'Jan 10, 2024', 
      time: '11:30 AM',
      doctor: 'Dr. Sarah Martinez', 
      type: 'Dermatology', 
      status: 'completed',
      department: 'Dermatology'
    }
  ];

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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{patient.name}</h1>
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
                    <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sm:inline">Medical Records</span>
                  </button>
                  <button className="p-2 sm:p-3 bg-[#FFF8F8] text-[#0118D8] rounded-xl hover:bg-[#E9DFC3] border border-[#E9DFC3]">
                    <HiOutlineDotsVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto overflow-y-hidden border-b border-[#E9DFC3] px-4 sm:px-6 md:px-8">
              {[
                { id: 'appointments', label: 'Appointments', icon: BsCalendar3 },
                { id: 'medical', label: 'Medical Info', icon: FaNotesMedical },
                { id: 'history', label: 'History', icon: BsClockFill }
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
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'appointments' && (
                  <motion.div
                    key="appointments"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Appointment History</h3>
                        <p className="text-sm text-gray-500">Track and manage your medical visits</p>
                      </div>
                      <button className="w-full sm:w-auto px-5 py-2.5 bg-[#0118D8] hover:bg-[#1B56FD] text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>Schedule New</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {appointments.map((apt) => (
                        <motion.div
                          key={apt.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/30 hover:shadow-sm transition-all duration-300 group"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                              {/* Date Box */}
                              <div className="relative">
                                <div className="bg-gradient-to-br from-[#FFF8F8] to-white p-4 rounded-xl text-center min-w-[80px] border border-[#E9DFC3]/30">
                                  <div className="text-3xl sm:text-4xl font-bold text-[#0118D8]">
                                    {apt.date.split(' ')[1].replace(',', '')}
                                  </div>
                                  <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mt-1">
                                    {apt.date.split(' ')[0]}
                                  </div>
                                </div>
                                {apt.status === 'upcoming' && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                                )}
                              </div>
                              
                              {/* Appointment Details */}
                              <div className="flex-1">
                                <h4 className="text-gray-900 font-semibold text-lg sm:text-xl mb-3 group-hover:text-[#0118D8] transition-colors">
                                  {apt.type}
                                </h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  <span className="flex items-center gap-2 text-gray-600">
                                    <div className="p-1.5 bg-[#FFF8F8] rounded-lg">
                                      <FaUserMd className="w-4 h-4 text-[#0118D8]" />
                                    </div>
                                    <span className="font-medium">{apt.doctor}</span>
                                  </span>
                                  <span className="flex items-center gap-2 text-gray-600">
                                    <div className="p-1.5 bg-[#E9DFC3]/20 rounded-lg">
                                      <MdLocalHospital className="w-4 h-4 text-[#0118D8]" />
                                    </div>
                                    <span className="font-medium">{apt.department}</span>
                                  </span>
                                  <span className="flex items-center gap-2 text-gray-600">
                                    <div className="p-1.5 bg-[#FFF8F8] rounded-lg">
                                      <FaClock className="w-4 h-4 text-[#1B56FD]" />
                                    </div>
                                    <span className="font-medium">{apt.time}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                              <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                                apt.status === 'completed' 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-[#FFF8F8] text-[#1B56FD] border border-[#E9DFC3]/50'
                              }`}>
                                {apt.status === 'completed' ? (
                                  <>
                                    <FaCheckCircle className="w-4 h-4" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <FaClock className="w-4 h-4" />
                                    Upcoming
                                  </>
                                )}
                              </span>
                              <button className="p-2.5 rounded-xl bg-[#FFF8F8] hover:bg-[#E9DFC3]/30 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                                <HiChevronRight className="w-5 h-5 text-[#0118D8]" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Progress indicator for upcoming appointments */}
                          {apt.status === 'upcoming' && (
                            <div className="mt-4 pt-4 border-t border-[#E9DFC3]/30">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <span>Time until appointment</span>
                                <span className="font-semibold text-[1rem] text-[#0118D8]">2 days</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

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
                        <p className="text-gray-600 text-sm leading-relaxed">{patient.address}</p>
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
                        <p className="text-gray-600 text-sm">{patient.lastVisit}</p>
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
                    <div className="text-center py-8 sm:py-12">
                      <BsClockFill className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Medical History</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Complete medical history will be displayed here</p>
                    </div>
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