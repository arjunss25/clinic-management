import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaFileAlt,
  FaUserMd,
  FaNotesMedical,
  FaHeartbeat,
} from 'react-icons/fa';
import { FaWeightScale } from 'react-icons/fa6';
import { Thermometer } from 'lucide-react';

const Dashboard = () => {
  // Animation variants (subtle and consistent)
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
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      weight: '145 lbs',
    },
  };

  const medications = [
    {
      name: 'Albuterol Inhaler',
      dosage: '2 puffs every 4-6 hours as needed',
      prescribedBy: 'Dr. Emily Chen',
      startDate: 'Jan 15, 2024',
    },
    {
      name: 'Cetirizine',
      dosage: '10mg once daily',
      prescribedBy: 'Dr. Sarah Martinez',
      startDate: 'Feb 1, 2024',
    },
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
            Patient Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your health, appointments, and medications
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="hidden md:block">
            <span className="font-medium text-gray-900">{patient.name}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>ID: {patient.patientId}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Next Appointment */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
                <FaCalendarAlt className="w-5 h-5 text-[#0118D8]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Next Appointment</p>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-md bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 text-xs font-medium">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xl font-semibold text-gray-900">
              Apr 22, 2:30 PM
            </p>
            <p className="text-gray-600 text-sm">with Dr. Emily Chen</p>
          </div>
        </motion.div>

        {/* Health Score */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
              <FaHeartbeat className="w-5 h-5 text-[#1B56FD]" />
            </div>
            <p className="text-gray-500 text-sm">Health Score</p>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-gray-900">85</span>
              <span className="text-gray-500">/ 100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0118D8] to-[#1B56FD]"
                style={{ width: '85%' }}
              />
            </div>
            <p className="text-xs text-gray-500">Good. Keep up your routine.</p>
          </div>
        </motion.div>

        {/* Medications */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <FaNotesMedical className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Medications</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xl font-semibold text-gray-900">2 Active</p>
            <p className="text-gray-600 text-sm">Next dose: 6:00 PM</p>
          </div>
        </motion.div>

        {/* Last Visit */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#E9DFC3]/30 flex items-center justify-center">
              <FaCalendarAlt className="w-5 h-5 text-[#8B7355]" />
            </div>
            <p className="text-gray-500 text-sm">Last Visit</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xl font-semibold text-gray-900">
              {patient.lastVisit}
            </p>
            <p className="text-gray-600 text-sm">
              {patient.conditions.join(', ')}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Daily Health Tip - Redesigned */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden"
      >
        <motion.div variants={itemVariants}>
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FaHeartbeat className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Daily Health Tip
                  </h3>
                  <p className="text-white/80 text-xs">
                    Personalized wellness insight
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium">
                  Today
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon indicator */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0118D8]/10 to-[#1B56FD]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0118D8] to-[#1B56FD] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">💧</span>
                </div>
              </div>

              {/* Tip content */}
              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                    Stay Hydrated for Optimal Health
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Drinking 8-10 glasses of water daily helps maintain healthy
                    blood pressure, supports kidney function, and keeps your
                    skin glowing. Try adding lemon or cucumber for a refreshing
                    twist!
                  </p>
                </div>

                {/* Action items */}
                <div className="bg-gradient-to-br from-[#0118D8]/5 to-[#1B56FD]/5 rounded-lg p-4 border border-[#E9DFC3]/50">
                  <h5 className="text-xs font-semibold text-[#0118D8] mb-2">
                    Quick Tips:
                  </h5>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1B56FD]" />
                      Start your day with a glass of water
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1B56FD]" />
                      Keep a water bottle at your desk
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1B56FD]" />
                      Set reminders every 2 hours
                    </li>
                  </ul>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0118D8] to-[#1B56FD]" />
                      Tip #247 of 365
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                      Updated daily at 6 AM
                    </span>
                  </div>
                  <button className="text-[#0118D8] text-xs font-medium hover:text-[#1B56FD] transition-colors flex items-center gap-1">
                    View more tips
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Vitals */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Vital Readings from Last Visit
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {/* BP */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover}
            className="bg-white p-4 rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
                <FaHeartbeat className="w-4 h-4 text-[#1B56FD]" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Blood Pressure
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-gray-900">
                {patient.vitals.bloodPressure}
              </span>
              <span className="text-xs text-gray-500">mmHg</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-[#0118D8] to-[#1B56FD]" />
              </div>
              <span className="text-xs font-medium text-green-600">Normal</span>
            </div>
          </motion.div>

          {/* Heart Rate */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover}
            className="bg-white p-4 rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
                <FaHeartbeat className="w-4 h-4 text-[#0118D8]" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Heart Rate
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-gray-900">
                {patient.vitals.heartRate.split(' ')[0]}
              </span>
              <span className="text-xs text-gray-500">bpm</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-[#0118D8] to-[#1B56FD]" />
              </div>
              <span className="text-xs font-medium text-green-600">Normal</span>
            </div>
          </motion.div>

          {/* Temperature */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover}
            className="bg-white p-4 rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-[#1B56FD]" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Temperature
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-gray-900">
                {patient.vitals.temperature.split('°')[0]}
              </span>
              <span className="text-xs text-gray-500">°F</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-[#0118D8] to-[#1B56FD]" />
              </div>
              <span className="text-xs font-medium text-green-600">Normal</span>
            </div>
          </motion.div>

          {/* Weight */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover}
            className="bg-white p-4 rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#E9DFC3]/40 flex items-center justify-center">
                <FaWeightScale className="w-4 h-4 text-[#8B7355]" />
              </div>
              <span className="text-gray-600 text-sm font-medium">Weight</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-gray-900">
                {patient.vitals.weight.split(' ')[0]}
              </span>
              <span className="text-xs text-gray-500">lbs</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-[#8B7355] to-[#A69076]" />
              </div>
              <span className="text-xs font-medium text-green-600">Normal</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Current Medications */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
            <FaNotesMedical className="text-[#0118D8] w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Current Medications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="group bg-white rounded-xl p-4 border border-[#E9DFC3]/70 hover:border-[#1B56FD] shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-gray-900 font-semibold text-base group-hover:text-[#0118D8] transition-colors">
                    {med.name}
                  </h4>
                  <p className="text-[#1B56FD] text-sm font-medium mt-0.5">
                    {med.dosage}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-3">
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
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
            <FaCalendarAlt className="w-4 h-4" />
            Book Appointment
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
            <FaFileAlt className="w-4 h-4" />
            View Records
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
            <FaUserMd className="w-4 h-4" />
            Contact Doctor
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
