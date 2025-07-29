import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaFileAlt,
  FaClock,
  FaUserMd,
  FaNotesMedical,
  FaStethoscope,
  FaCheckCircle,
  FaHeartbeat,
  FaTint,
  FaAllergies,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { FaWeightScale } from "react-icons/fa6";
import { MdLocalHospital, MdOutlinePhoneAndroid, MdLocationOn, MdDateRange } from 'react-icons/md';
import { Thermometer } from 'lucide-react';

const Dashboard = () => {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
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
    },
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      weight: '145 lbs'
    }
  };

  // Sample data
  const upcomingAppointments = [
    {
      id: 1,
      date: 'Apr 22, 2024',
      time: '2:30 PM',
      doctor: 'Dr. Emily Chen',
      type: 'General Checkup',
      department: 'General Medicine'
    }
  ];

  const recentRecords = [
    {
      id: 1,
      date: 'Mar 15, 2024',
      type: 'Blood Test Results',
      doctor: 'Dr. James Wilson',
      status: 'completed'
    }
  ];

  const medications = [
    {
      name: 'Albuterol Inhaler',
      dosage: '2 puffs every 4-6 hours as needed',
      prescribedBy: 'Dr. Emily Chen',
      startDate: 'Jan 15, 2024'
    },
    {
      name: 'Cetirizine',
      dosage: '10mg once daily',
      prescribedBy: 'Dr. Sarah Martinez',
      startDate: 'Feb 1, 2024'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 " 
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0118D8] to-[#1B56FD] bg-clip-text text-transparent">
            Patient Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Overview of your health, appointments, and medications</p>
        </div>
      </motion.div>
      {/* Summary Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" // Reduced gap
      >
        {/* Next Appointment Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3] hover:border-[#1B56FD] transition-colors duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FaCalendarAlt className="w-5 h-5 text-[#0118D8]" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Next Appointment</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-gray-900">Apr 22, 2:30 PM</p>
            <p className="text-gray-600 text-sm">Dr. Emily Chen</p>
          </div>
        </motion.div>

        {/* Health Score Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3] hover:border-[#1B56FD] transition-colors duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <FaHeartbeat className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Health Score</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">85</span>
              <span className="text-gray-500 text-base">/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Active Medications Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3] hover:border-[#1B56FD] transition-colors duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <FaNotesMedical className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Medications</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-gray-900">2 Active</p>
            <p className="text-gray-600 text-sm">Next dose: 6:00 PM</p>
          </div>
        </motion.div>
        
        {/* Placeholder Card (Optional, for balance) */}
        {/* <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-[#E9DFC3]/30 to-white rounded-xl p-5 border border-[#E9DFC3]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#E9DFC3]/50 flex items-center justify-center">
              <FaStethoscope className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-700 font-medium">General Info</p>
          </div>
          <p className="text-gray-600 text-sm">Stay hydrated and get enough sleep.</p>
        </motion.div> */}
      </motion.div>

<h1 className='text-[1.5rem] font-medium'>Vital Readings from Last Visit</h1>
      {/* Vitals Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Blood Pressure */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-[#FFF8F8] p-4 rounded-xl border border-[#E9DFC3]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <FaHeartbeat className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-gray-600 text-sm font-medium">BP</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{patient.vitals.bloodPressure}</span>
              <span className="text-xs text-gray-500">mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-red-100 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-red-400 to-red-500 rounded-full" />
              </div>
              <span className="text-xs font-medium text-red-500">Normal</span>
            </div>
          </div>
        </motion.div>

        {/* Heart Rate */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-[#FFF8F8] p-4 rounded-xl border border-[#E9DFC3]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <FaHeartbeat className="w-4 h-4 text-[#1B56FD]" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Heart Rate</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{patient.vitals.heartRate.split(' ')[0]}</span>
              <span className="text-xs text-gray-500">bpm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] rounded-full" />
              </div>
              <span className="text-xs font-medium text-[#1B56FD]">Normal</span>
            </div>
          </div>
        </motion.div>

        {/* Temperature */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-[#FFF8F8] p-4 rounded-xl border border-[#E9DFC3]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Temp</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{patient.vitals.temperature.split('°')[0]}</span>
              <span className="text-xs text-gray-500">°F</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-orange-100 overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
              </div>
              <span className="text-xs font-medium text-orange-500">Normal</span>
            </div>
          </div>
        </motion.div>

        {/* Weight */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-[#FFF8F8] p-4 rounded-xl border border-[#E9DFC3]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#E9DFC3]/50 flex items-center justify-center">
              <FaWeightScale className="w-4 h-4 text-[#8B7355]" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Weight</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{patient.vitals.weight.split(' ')[0]}</span>
              <span className="text-xs text-gray-500">lbs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-[#E9DFC3]/50 overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-[#8B7355] to-[#A69076] rounded-full" />
              </div>
              <span className="text-xs font-medium text-[#8B7355]">Normal</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Current Medications Section */}
      <motion.div
        variants={containerVariants}
        className="bg-white rounded-xl p-5 border border-[#E9DFC3]"
      >
        <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-[#E9DFC3]/30 flex items-center justify-center">
            <FaNotesMedical className="text-green-600 w-5 h-5" />
          </div>
          Current Medications
        </h3>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {medications.map((med, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="group bg-gradient-to-br from-white to-[#FFF8F8] rounded-xl p-4 border border-[#E9DFC3] hover:border-[#1B56FD] transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-gray-900 font-semibold text-base group-hover:text-[#0118D8] transition-colors">
                    {med.name}
                  </h4>
                  <p className="text-[#1B56FD] text-sm font-medium mb-2">{med.dosage}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FaUserMd className="w-3.5 h-3.5 text-gray-400" />
                      {med.prescribedBy}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt className="w-3.5 h-3.5 text-gray-400" />
                      Started: {med.startDate}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-[#E9DFC3] p-5"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF8F8] text-[#0118D8] border border-[#E9DFC3] rounded-lg hover:bg-[#E9DFC3]/30 hover:border-[#1B56FD] transition-colors">
            <FaCalendarAlt className="w-4 h-4" />
            Book Appointment
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF8F8] text-[#0118D8] border border-[#E9DFC3] rounded-lg hover:bg-[#E9DFC3]/30 hover:border-[#1B56FD] transition-colors">
            <FaFileAlt className="w-4 h-4" />
            View Records
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF8F8] text-[#0118D8] border border-[#E9DFC3] rounded-lg hover:bg-[#E9DFC3]/30 hover:border-[#1B56FD] transition-colors">
            <FaUserMd className="w-4 h-4" />
            Contact Doctor
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;