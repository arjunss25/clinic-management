import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUserInjured,
  FaStethoscope,
  FaNotesMedical,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaUserMd,
  FaEye,
  FaHistory,
  FaChartLine,
  FaUserClock,
  FaTimes,
  FaUpload,
  FaUser,
} from 'react-icons/fa';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  File,
  FileText,
  AlertTriangle,
  Activity,
  X,
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'Lab Report',
    description: '',
    priority: 'Normal',
    file: null,
  });
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedVitalsAppointment, setSelectedVitalsAppointment] =
    useState(null);
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    weight: '',
    height: '',
    bmi: '',
    notes: '',
  });
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

  // Sample clinic data
  const clinic = {
    name: 'Sarah Wilson',
    role: 'Senior Clinic Nurse',
    experience: '8 years',
    department: 'General Medicine Department',
    email: 'sarah.wilson@clinic.com',
    phone: '+1 (555) 234-5678',
    employeeId: 'STF-2024-1234',
    rating: 4.7,
    totalPatients: 1250,
    totalAppointments: 2150,
  };

  // Today's appointments with status including waiting list
  const todayAppointments = {
    upcoming: [
      {
        id: 1,
        patientName: 'Sarah Johnson',
        time: '2:00 PM',
        type: 'Follow-up',
        status: 'Confirmed',
        priority: 'Normal',
        patientId: 'PT-2024-0892',
        age: 28,
        condition: 'Asthma',
        symptoms: 'Shortness of breath, wheezing',
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: '72',
          temperature: '98.6°F',
          oxygenSaturation: '95%',
        },
        allergies: 'None known',
        currentMedications: 'Albuterol inhaler',
        medicalHistory: 'Asthma since childhood, seasonal allergies',
      },
      {
        id: 2,
        patientName: 'Michael Rodriguez',
        time: '3:30 PM',
        type: 'New Patient',
        status: 'Confirmed',
        priority: 'High',
        patientId: 'PT-2024-0893',
        age: 45,
        condition: 'Hypertension',
        symptoms: 'Headaches, dizziness',
        vitalSigns: {
          bloodPressure: '150/95',
          heartRate: '85',
          temperature: '98.4°F',
          oxygenSaturation: '97%',
        },
        allergies: 'Penicillin',
        currentMedications: 'None',
        medicalHistory: 'Family history of hypertension',
      },
      {
        id: 3,
        patientName: 'Lisa Thompson',
        time: '4:00 PM',
        type: 'Consultation',
        status: 'Pending',
        priority: 'Normal',
        patientId: 'PT-2024-0894',
        age: 32,
        condition: 'Diabetes',
        symptoms: 'Increased thirst, frequent urination',
        vitalSigns: {
          bloodPressure: '118/78',
          heartRate: '76',
          temperature: '98.8°F',
          oxygenSaturation: '96%',
        },
        allergies: 'None known',
        currentMedications: 'Metformin',
        medicalHistory: 'Type 2 diabetes diagnosed 2 years ago',
      },
    ],
    completed: [
      {
        id: 4,
        patientName: 'Robert Wilson',
        time: '9:00 AM',
        type: 'Emergency',
        status: 'Completed',
        priority: 'Urgent',
        patientId: 'PT-2024-0895',
        age: 58,
        condition: 'Chest Pain',
        notes: 'ECG normal, prescribed medication',
      },
      {
        id: 5,
        patientName: 'Emma Davis',
        time: '10:30 AM',
        type: 'Follow-up',
        status: 'Completed',
        priority: 'Normal',
        patientId: 'PT-2024-0896',
        age: 35,
        condition: 'Diabetes',
        notes: 'Blood sugar levels improved',
      },
    ],
    notVisited: [
      {
        id: 6,
        patientName: 'John Smith',
        time: '11:00 AM',
        type: 'Consultation',
        status: 'No Show',
        priority: 'Normal',
        patientId: 'PT-2024-0897',
        age: 42,
        condition: 'Back Pain',
      },
    ],
    waitingList: [
      {
        id: 7,
        patientName: 'Amanda Clark',
        requestedDate: 'Today',
        type: 'Urgent Consultation',
        status: 'Waiting',
        priority: 'High',
        patientId: 'PT-2024-0898',
        age: 38,
        condition: 'Migraine',
        waitingSince: '3 hours ago',
      },
      {
        id: 8,
        patientName: 'David Martinez',
        requestedDate: 'Today',
        type: 'Follow-up',
        status: 'Waiting',
        priority: 'Normal',
        patientId: 'PT-2024-0899',
        age: 52,
        condition: 'Diabetes',
        waitingSince: '1 hour ago',
      },
      {
        id: 9,
        patientName: 'Rachel Green',
        requestedDate: 'Today',
        type: 'New Patient',
        status: 'Waiting',
        priority: 'Normal',
        patientId: 'PT-2024-0900',
        age: 29,
        condition: 'Anxiety',
        waitingSince: '45 minutes ago',
      },
    ],
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'upcoming':
        return todayAppointments.upcoming;
      case 'completed':
        return todayAppointments.completed;
      case 'notVisited':
        return todayAppointments.notVisited;
      case 'waitingList':
        return todayAppointments.waitingList;
      default:
        return todayAppointments.upcoming;
    }
  };

  const getTabCount = (tab) => {
    return todayAppointments[tab]?.length || 0;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadForm((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  const handleUploadSubmit = () => {
    if (uploadForm.title && uploadForm.description) {
      // Here you would typically send the data to your backend
      alert('Report uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({
        title: '',
        type: 'Lab Report',
        description: '',
        priority: 'Normal',
        file: null,
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleVitalsSubmit = () => {
    alert('Vitals recorded successfully!');
    setShowVitalsModal(false);
    setSelectedVitalsAppointment(null);
    setVitalsForm({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: '',
      respiratoryRate: '',
      weight: '',
      height: '',
      bmi: '',
      notes: '',
    });
  };

  const calculateBMI = () => {
    const weight = parseFloat(vitalsForm.weight);
    const height = parseFloat(vitalsForm.height) / 100;
    if (weight && height) {
      const bmi = (weight / (height * height)).toFixed(1);
      setVitalsForm((prev) => ({ ...prev, bmi }));
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
            Clinic Dashboard
          </h1>
          <p className="text-gray-600">
            Manage patients, appointments, and clinic operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors">
            <FaUserMd className="w-4 h-4" />
            View Profile
          </button>
          <div className="hidden md:block text-sm text-gray-600">
            <span className="font-medium text-gray-900">{clinic.name}</span>
            <span className="mx-2 text-gray-300">•</span>
                          <span>{clinic.role}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
      >
        {/* Total Patients */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Total Patients</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {clinic.totalPatients}
            </p>
            <p className="text-gray-600 text-sm">+25 this month</p>
          </div>
        </motion.div>

        {/* Today's Appointments */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
              <FaCalendarAlt className="w-5 h-5 text-[#1B56FD]" />
            </div>
            <p className="text-gray-500 text-sm">Today's Appointments</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {Object.values(todayAppointments).flat().length -
                getTabCount('waitingList')}
            </p>
            <p className="text-gray-600 text-sm">
              {getTabCount('upcoming')} upcoming
            </p>
          </div>
        </motion.div>

        {/* Completed Today */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Completed Today</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {getTabCount('completed')}
            </p>
            <p className="text-green-600 text-sm font-medium">
              Appointments done
            </p>
          </div>
        </motion.div>

        {/* Waiting List */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-orange-500/5 flex items-center justify-center">
              <FaUserClock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-gray-500 text-sm">Waiting List</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {getTabCount('waitingList')}
            </p>
            <p className="text-orange-600 text-sm">Patients waiting</p>
          </div>
        </motion.div>

        {/* No Shows */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-red-500/5 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-gray-500 text-sm">No Shows</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {getTabCount('notVisited')}
            </p>
            <p className="text-red-600 text-sm">Missed appointments</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Today's Schedule with Tabs */}
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
                  <FaCalendarAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {activeTab === 'waitingList'
                      ? 'Patient Waiting List'
                      : "Today's Schedule"}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-[#0118D8] text-[#0118D8] bg-[#0118D8]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Upcoming ({getTabCount('upcoming')})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'completed'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed ({getTabCount('completed')})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('waitingList')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'waitingList'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaUserClock className="w-4 h-4" />
                  Waiting List ({getTabCount('waitingList')})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notVisited')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'notVisited'
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  No Shows ({getTabCount('notVisited')})
                </div>
              </button>
            </nav>
          </div>

          {/* Appointments List */}
          <div className="p-6">
            <div className="space-y-4">
              {getTabData().map((appointment) => (
                <motion.div
                  key={appointment.id}
                  variants={itemVariants}
                  className="group bg-white rounded-xl p-4 border border-[#E9DFC3]/70 hover:border-[#1B56FD] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Time or Waiting Info */}
                      <div className="text-center">
                        {activeTab === 'waitingList' ? (
                          <>
                            <div className="text-sm font-semibold text-orange-600">
                              Waiting
                            </div>
                            <div className="text-xs text-gray-500">
                              {appointment.waitingSince}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-semibold text-[#0118D8]">
                              {appointment.time}
                            </div>
                            <div className="text-xs text-gray-500">30min</div>
                          </>
                        )}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-gray-900 font-semibold group-hover:text-[#0118D8] transition-colors">
                            {appointment.patientName}
                          </h4>
                          <span className="text-xs text-gray-500">
                            ID: {appointment.patientId}
                          </span>
                          <span className="text-xs text-gray-500">
                            Age: {appointment.age}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5">
                            <FaStethoscope className="w-3.5 h-3.5 text-gray-400" />
                            {appointment.condition}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaNotesMedical className="w-3.5 h-3.5 text-gray-400" />
                            {appointment.type}
                          </span>
                          {activeTab === 'waitingList' && (
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                appointment.priority === 'High'
                                  ? 'bg-red-50 text-red-700 border border-red-100'
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}
                            >
                              {appointment.priority} Priority
                            </span>
                          )}
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <strong>Notes:</strong> {appointment.notes}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      {activeTab !== 'waitingList' && (
                        <div className="flex flex-col items-end gap-2 mr-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              appointment.status === 'Completed'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : appointment.status === 'Confirmed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : appointment.status === 'No Show'
                                ? 'bg-red-50 text-red-700 border border-red-100'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Allocate Slot Button for Waiting List */}
                    {activeTab === 'waitingList' && (
                      <div className="ml-4">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                          <UserPlus className="w-3.5 h-3.5" />
                          Allocate Slot
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Secondary Action Buttons */}
                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
                    {activeTab === 'upcoming' && (
                      <>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs font-medium">
                          <FaPhone className="w-3 h-3" />
                          Call Patient
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B56FD]/5 text-[#1B56FD] rounded-lg hover:bg-[#1B56FD]/10 transition-colors text-xs font-medium">
                          <FaEye className="w-3 h-3" />
                          View Profile
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9DFC3]/30 text-[#8B7355] rounded-lg hover:bg-[#E9DFC3]/50 transition-colors text-xs font-medium">
                          <FaChartLine className="w-3 h-3" />
                          Patient Timeline
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVitalsAppointment(appointment);
                            setShowVitalsModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs font-medium"
                        >
                          <Activity className="w-3 h-3" />
                          Add Vitals
                        </button>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-xs font-medium"
                        >
                          <FaUpload className="w-3 h-3" />
                          Upload Report
                        </button>
                      </>
                    )}

                    {activeTab === 'waitingList' && (
                      <>
                        <button 
                          onClick={() => navigate('/clinic/patient-booking')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/5 text-purple-600 rounded-lg hover:bg-purple-500/10 transition-colors text-xs font-medium"
                        >
                          <FaCalendarAlt className="w-3 h-3" />
                          Book Appointment
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs font-medium">
                          <FaPhone className="w-3 h-3" />
                          Call Patient
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B56FD]/5 text-[#1B56FD] rounded-lg hover:bg-[#1B56FD]/10 transition-colors text-xs font-medium">
                          <FaEye className="w-3 h-3" />
                          View Profile
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9DFC3]/30 text-[#8B7355] rounded-lg hover:bg-[#E9DFC3]/50 transition-colors text-xs font-medium">
                          <FaChartLine className="w-3 h-3" />
                          Patient Timeline
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVitalsAppointment(appointment);
                            setShowVitalsModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs font-medium"
                        >
                          <Activity className="w-3 h-3" />
                          Add Vitals
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/5 text-red-600 rounded-lg hover:bg-red-500/10 transition-colors text-xs font-medium">
                          <FaTimes className="w-3 h-3" />
                          Remove from List
                        </button>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-xs font-medium"
                        >
                          <FaUpload className="w-3 h-3" />
                          Upload Report
                        </button>
                      </>
                    )}

                    {(activeTab === 'completed' ||
                      activeTab === 'notVisited') && (
                      <>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs font-medium">
                          <FaHistory className="w-3 h-3" />
                          View Consultation Log
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B56FD]/5 text-[#1B56FD] rounded-lg hover:bg-[#1B56FD]/10 transition-colors text-xs font-medium">
                          <FaEye className="w-3 h-3" />
                          View Profile
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9DFC3]/30 text-[#8B7355] rounded-lg hover:bg-[#E9DFC3]/50 transition-colors text-xs font-medium">
                          <FaChartLine className="w-3 h-3" />
                          Patient Timeline
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVitalsAppointment(appointment);
                            setShowVitalsModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs font-medium"
                        >
                          <Activity className="w-3 h-3" />
                          Add Vitals
                        </button>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-xs font-medium"
                        >
                          <FaUpload className="w-3 h-3" />
                          Upload Report
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {getTabData().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    No{' '}
                    {activeTab === 'waitingList'
                      ? 'patients in waiting list'
                      : 'appointments in this category'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

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
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
              <FaCalendarAlt className="w-4 h-4" />
              Schedule Appointment
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
              <FaNotesMedical className="w-4 h-4" />
              Update Records
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
              <FaHistory className="w-4 h-4" />
              Appointment History
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
              <FaUserInjured className="w-4 h-4" />
              Patient Management
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Upload Report Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowUploadModal(false)}
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
                <h3
                  className="text-xl font-semibold"
                  style={{ color: '#111827' }}
                >
                  Upload Medical Report
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  Add a new report to the patient's medical record
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
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
                handleUploadSubmit();
              }}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Report Title <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
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
                      placeholder="Enter report title..."
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#111827' }}
                  >
                    Report Type
                  </label>
                  <div className="relative">
                    <select
                      value={uploadForm.type}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 pr-12 rounded-lg transition-all text-sm border-2 appearance-none cursor-pointer"
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
                      <option value="Lab Report">Lab Report</option>
                      <option value="Imaging Report">Imaging Report</option>
                      <option value="Consultation Report">
                        Consultation Report
                      </option>
                      <option value="Procedure Report">Procedure Report</option>
                      <option value="Patient Report">Patient Report</option>
                      <option value="Other">Other</option>
                    </select>
                    <div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      style={{ color: '#6B7280' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#111827' }}
                  >
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={uploadForm.priority}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 pr-12 rounded-lg transition-all text-sm border-2 appearance-none cursor-pointer"
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
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                    <div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      style={{ color: '#6B7280' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#111827' }}
                  >
                    Attach File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
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

                <div className="lg:col-span-2">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#111827' }}
                  >
                    Report Description{' '}
                    <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    rows="4"
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
                    placeholder="Enter detailed description of the report..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                style={{ borderColor: '#ECEEF2' }}
              >
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
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
                  Upload Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vitals Modal */}
      {showVitalsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowVitalsModal(false)}
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
                  <Activity className="w-5 h-5" style={{ color: '#0F1ED1' }} />
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Add Patient Vitals
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    {selectedVitalsAppointment
                      ? `Record current vital signs for ${selectedVitalsAppointment.patientName}`
                      : 'Record current vital signs'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVitalsModal(false)}
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
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVitalsSubmit();
              }}
              className="p-6 space-y-6"
            >
              {/* Cardiovascular Vitals */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Cardiovascular
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      value={vitalsForm.bloodPressure}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          bloodPressure: e.target.value,
                        }))
                      }
                      placeholder="e.g., 120/80"
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
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={vitalsForm.heartRate}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          heartRate: e.target.value,
                        }))
                      }
                      placeholder="e.g., 72"
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

              {/* Respiratory Vitals */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Respiratory
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Temperature (°F)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsForm.temperature}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          temperature: e.target.value,
                        }))
                      }
                      placeholder="e.g., 98.6"
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
                      Oxygen Saturation (%)
                    </label>
                    <input
                      type="number"
                      value={vitalsForm.oxygenSaturation}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          oxygenSaturation: e.target.value,
                        }))
                      }
                      placeholder="e.g., 98"
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
                      Respiratory Rate (breaths/min)
                    </label>
                    <input
                      type="number"
                      value={vitalsForm.respiratoryRate}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          respiratoryRate: e.target.value,
                        }))
                      }
                      placeholder="e.g., 16"
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

              {/* Anthropometric Measurements */}
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#111827' }}
                >
                  Anthropometric Measurements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsForm.weight}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                      placeholder="e.g., 70.5"
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
                        calculateBMI();
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsForm.height}
                      onChange={(e) =>
                        setVitalsForm((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                      placeholder="e.g., 170"
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
                        calculateBMI();
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#111827' }}
                    >
                      BMI (kg/m²)
                    </label>
                    <input
                      type="text"
                      value={vitalsForm.bmi}
                      readOnly
                      placeholder="Auto-calculated"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#F9FAFB',
                        border: '2px solid #ECEEF2',
                        color: '#6B7280',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#111827' }}
                >
                  Additional Notes
                </label>
                <textarea
                  value={vitalsForm.notes}
                  onChange={(e) =>
                    setVitalsForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows="3"
                  placeholder="Any additional observations or notes about the patient's vital signs..."
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

              {/* Form Actions */}
              <div
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                style={{ borderColor: '#ECEEF2' }}
              >
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
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
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
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
                  Record Vitals
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
