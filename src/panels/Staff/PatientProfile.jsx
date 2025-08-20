import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaPhone,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaNotesMedical,
  FaAllergies,
  FaStethoscope,
  FaArrowLeft,
  FaEdit,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaSave,
} from 'react-icons/fa';
import { MdOutlinePhoneAndroid } from 'react-icons/md';
import {
  MdLocalHospital,
  MdEmail,
  MdLocationOn,
  MdDateRange,
  MdBloodtype,
  MdSecurity,
  MdEmergency,
} from 'react-icons/md';
import { BsClockFill } from 'react-icons/bs';
import PatientHistory from '../Doctor/PatientHistory';

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medical');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAllergiesEdit, setShowAllergiesEdit] = useState(false);
  const [showConditionsEdit, setShowConditionsEdit] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

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

  // Edit form state
  const [editForm, setEditForm] = useState({});

  // Handle form changes
  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Save profile changes
  const saveProfile = () => {
    setPatient((prev) => ({
      ...prev,
      ...editForm,
    }));
    setShowEditModal(false);
    alert('Profile updated successfully!');
  };

  // Add new allergy
  const addAllergy = () => {
    if (newAllergy.trim() && !patient.allergies.includes(newAllergy.trim())) {
      setPatient((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy('');
    }
  };

  // Remove allergy
  const removeAllergy = (index) => {
    setPatient((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  // Add new condition
  const addCondition = () => {
    if (
      newCondition.trim() &&
      !patient.conditions.includes(newCondition.trim())
    ) {
      setPatient((prev) => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()],
      }));
      setNewCondition('');
    }
  };

  // Remove condition
  const removeCondition = (index) => {
    setPatient((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  // Sample patient database - in a real app, this would come from an API
  const patientsDatabase = {
    'PAT-2024-001': {
      id: 'PAT-2024-001',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, New York, NY 10001',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      conditions: ['Hypertension', 'Diabetes Type 2'],
      lastVisit: 'March 15, 2024',
      nextAppointment: 'April 22, 2024 at 2:30 PM',
      insurance: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS-123456789',
      emergencyContact: {
        name: 'Sarah Doe',
        relation: 'Wife',
        phone: '+1 (555) 987-6543',
      },
      status: 'Active',
    },
    'PAT-2024-002': {
      id: 'PAT-2024-002',
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Avenue, Los Angeles, CA 90210',
      bloodType: 'A+',
      allergies: ['Latex', 'Peanuts'],
      conditions: ['Asthma', 'Seasonal Allergies'],
      lastVisit: 'March 12, 2024',
      nextAppointment: 'April 25, 2024 at 10:00 AM',
      insurance: 'Aetna',
      policyNumber: 'AET-987654321',
      emergencyContact: {
        name: 'Mike Smith',
        relation: 'Husband',
        phone: '+1 (555) 876-5432',
      },
      status: 'Active',
    },
    'PAT-2024-003': {
      id: 'PAT-2024-003',
      name: 'Robert Johnson',
      age: 45,
      gender: 'Male',
      email: 'robert.johnson@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Street, Chicago, IL 60601',
      bloodType: 'B+',
      allergies: ['Sulfa Drugs'],
      conditions: ['High Cholesterol', 'Arthritis'],
      lastVisit: 'March 10, 2024',
      nextAppointment: 'April 28, 2024 at 3:15 PM',
      insurance: 'Cigna',
      policyNumber: 'CIG-456789123',
      emergencyContact: {
        name: 'Lisa Johnson',
        relation: 'Sister',
        phone: '+1 (555) 765-4321',
      },
      status: 'Active',
    },
    'PAT-2024-004': {
      id: 'PAT-2024-004',
      name: 'Emily Davis',
      age: 32,
      gender: 'Female',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm Street, Miami, FL 33101',
      bloodType: 'AB+',
      allergies: ['Ibuprofen', 'Dairy'],
      conditions: ['Migraine', 'Anxiety'],
      lastVisit: 'March 8, 2024',
      nextAppointment: 'April 30, 2024 at 11:45 AM',
      insurance: 'UnitedHealth',
      policyNumber: 'UHC-789123456',
      emergencyContact: {
        name: 'David Davis',
        relation: 'Brother',
        phone: '+1 (555) 654-3210',
      },
      status: 'Active',
    },
    'PAT-2024-005': {
      id: 'PAT-2024-005',
      name: 'Michael Wilson',
      age: 52,
      gender: 'Male',
      email: 'michael.wilson@email.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Drive, Seattle, WA 98101',
      bloodType: 'O-',
      allergies: ['Aspirin'],
      conditions: ['Heart Disease', 'Sleep Apnea'],
      lastVisit: 'March 5, 2024',
      nextAppointment: 'May 2, 2024 at 9:30 AM',
      insurance: 'Kaiser Permanente',
      policyNumber: 'KP-321654987',
      emergencyContact: {
        name: 'Jennifer Wilson',
        relation: 'Daughter',
        phone: '+1 (555) 543-2109',
      },
      status: 'Active',
    },
  };

  useEffect(() => {
    // Simulate API call to fetch patient data
    const fetchPatientData = () => {
      setLoading(true);

      // Simulate network delay
      setTimeout(() => {
        const patientData = patientsDatabase[patientId];
        if (patientData) {
          setPatient(patientData);
          // Initialize edit form with patient data
          setEditForm({
            name: patientData.name,
            age: patientData.age,
            email: patientData.email,
            phone: patientData.phone,
            address: patientData.address,
            bloodType: patientData.bloodType,
            insurance: patientData.insurance,
            policyNumber: patientData.policyNumber,
            emergencyContact: {
              name: patientData.emergencyContact.name,
              relation: patientData.emergencyContact.name,
              phone: patientData.emergencyContact.phone,
            },
          });
        } else {
          // Handle patient not found
          setPatient(null);
        }
        setLoading(false);
      }, 500);
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const handleBack = () => {
    navigate('/staff/patients');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0118D8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient information...</p>
        </div>
      </div>
    );
  }

  // Patient not found state
  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Patient Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The patient with ID "{patientId}" could not be found.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#1B56FD] transition-colors"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-[#0118D8] hover:bg-[#FFF8F8] rounded-lg transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Patients</span>
        </button>
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
                {/* Back Button and Profile Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg transform transition-transform group-hover:scale-105">
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
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
                        ID: {patient.id}
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1">
                        <FaCheckCircle className="w-3 h-3" />
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() =>
                      navigate(`/staff/patient-booking/${patient.id}`, {
                        state: { patient },
                      })
                    }
                    className="flex-1 sm:flex-none group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white rounded-xl font-medium hover:from-[#1B56FD] hover:to-[#0118D8] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sm:inline">Book Appointment</span>
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex-1 sm:flex-none group px-4 sm:px-6 py-2 sm:py-3 bg-[#FFF8F8] text-[#0118D8] rounded-xl font-medium hover:bg-[#E9DFC3] transition-all duration-300 flex items-center justify-center gap-2 border border-[#E9DFC3]"
                  >
                    <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sm:inline">Edit Profile</span>
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
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-gray-900 font-semibold text-base sm:text-lg flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF8F8] to-[#E9DFC3]/20 flex items-center justify-center">
                            <FaStethoscope className="text-[#0118D8] w-5 h-5" />
                          </div>
                          Medical Conditions
                        </h3>
                        <button
                          onClick={() => setShowConditionsEdit(true)}
                          className="flex items-center gap-2 px-3 py-2 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-sm font-medium border border-[#0118D8]/20"
                        >
                          <FaEdit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
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
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-gray-900 font-semibold text-base sm:text-lg flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <FaAllergies className="text-red-600 w-5 h-5" />
                          </div>
                          Known Allergies
                        </h3>
                        <button
                          onClick={() => setShowAllergiesEdit(true)}
                          className="flex items-center gap-2 px-3 py-2 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-sm font-medium border border-[#0118D8]/20"
                        >
                          <FaEdit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
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

                      <motion.div
                        variants={itemVariants}
                        className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/20 transition-all duration-300"
                      >
                        <h4 className="text-gray-900 font-semibold text-sm sm:text-base mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FFF8F8] flex items-center justify-center group-hover:bg-[#E9DFC3]/20 transition-colors">
                            <FaFileAlt className="text-[#0118D8] w-4 h-4" />
                          </div>
                          Insurance
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {patient.insurance}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Policy: {patient.policyNumber}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/20 transition-all duration-300"
                      >
                        <h4 className="text-gray-900 font-semibold text-sm sm:text-base mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FFF8F8] flex items-center justify-center group-hover:bg-[#E9DFC3]/20 transition-colors">
                            <FaUser className="text-[#1B56FD] w-4 h-4" />
                          </div>
                          Emergency Contact
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {patient.emergencyContact.name} (
                          {patient.emergencyContact.relation})
                        </p>
                        <p className="text-gray-600 text-sm">
                          {patient.emergencyContact.phone}
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
                    <PatientHistory />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#0F1ED115' }}
                >
                  <FaUser className="w-5 h-5" style={{ color: '#0F1ED1' }} />
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Edit Profile
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Update patient information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              className="p-6 space-y-6"
            >
              {/* Personal Information */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      value={editForm.age || ''}
                      onChange={(e) => handleFormChange('age', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) =>
                        handleFormChange('email', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) =>
                        handleFormChange('phone', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#111827' }}
                  >
                    Address
                  </label>
                  <textarea
                    value={editForm.address || ''}
                    onChange={(e) =>
                      handleFormChange('address', e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg transition-all text-sm resize-none border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Medical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Blood Type
                    </label>
                    <select
                      value={editForm.bloodType || ''}
                      onChange={(e) =>
                        handleFormChange('bloodType', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Insurance Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={editForm.insurance || ''}
                      onChange={(e) =>
                        handleFormChange('insurance', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Policy Number
                    </label>
                    <input
                      type="text"
                      value={editForm.policyNumber || ''}
                      onChange={(e) =>
                        handleFormChange('policyNumber', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={editForm.emergencyContact?.name || ''}
                      onChange={(e) =>
                        handleFormChange(
                          'emergencyContact.name',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={editForm.emergencyContact?.relation || ''}
                      onChange={(e) =>
                        handleFormChange(
                          'emergencyContact.relation',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.emergencyContact?.phone || ''}
                      onChange={(e) =>
                        handleFormChange(
                          'emergencyContact.phone',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                style={{ borderColor: '#ECEEF2' }}
              >
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: '#ffffff',
                    color: '#6B7280',
                    border: '2px solid #ECEEF2',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#6B728010';
                    e.target.style.borderColor = '#6B7280';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#ECEEF2';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                    color: '#ffffff',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow =
                      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <FaSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Allergies Modal */}
      {showAllergiesEdit && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowAllergiesEdit(false)}
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
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#0F1ED115' }}
                >
                  <FaAllergies
                    className="w-5 h-5"
                    style={{ color: '#0F1ED1' }}
                  />
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Edit Allergies
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Manage patient allergies
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllergiesEdit(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Current Allergies */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Current Allergies
                </h4>
                <div className="space-y-3">
                  {patient.allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          {allergy}
                        </span>
                      </div>
                      <button
                        onClick={() => removeAllergy(index)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {patient.allergies.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaAllergies className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No allergies recorded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add New Allergy */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Add New Allergy
                </h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Enter allergy name..."
                    className="flex-1 px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={addAllergy}
                    className="px-6 py-3 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 p-6 border-t"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowAllergiesEdit(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                <FaSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medical Conditions Modal */}
      {showConditionsEdit && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowConditionsEdit(false)}
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
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#0F1ED115' }}
                >
                  <FaStethoscope
                    className="w-5 h-5"
                    style={{ color: '#0F1ED1' }}
                  />
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Edit Medical Conditions
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Manage patient medical conditions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConditionsEdit(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Current Conditions */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Current Medical Conditions
                </h4>
                <div className="space-y-3">
                  {patient.conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaStethoscope className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          {condition}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCondition(index)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {patient.conditions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaStethoscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No medical conditions recorded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add New Condition */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Add New Medical Condition
                </h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Enter medical condition..."
                    className="flex-1 px-4 py-3 rounded-lg transition-all text-sm border-2"
                    style={{
                      background: '#ffffff',
                      border: '2px solid #ECEEF2',
                      color: '#111827',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0F1ED1';
                      e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ECEEF2';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={addCondition}
                    className="px-6 py-3 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3 p-6 border-t"
              style={{ borderColor: '#ECEEF2' }}
            >
              <button
                type="button"
                onClick={() => setShowConditionsEdit(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                <FaSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
