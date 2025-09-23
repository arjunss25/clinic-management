import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import clinicAPI from '../../services/clinicApiService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
  FaUpload,
  FaUser,
  FaFilter,
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
  
  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  
  // Dashboard counts state
  const [dashboardCounts, setDashboardCounts] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    completedToday: 0,
    waitingList: 0,
    noShows: 0,
    upcomingAppointments: 0
  });
  const [loadingCounts, setLoadingCounts] = useState(false);
  
  const navigate = useNavigate();

  // Fetch dashboard counts from API
  const fetchDashboardCounts = useCallback(async () => {
    setLoadingCounts(true);
    try {
      const result = await clinicAPI.getDashboardCounts();
      if (result.success) {
        console.log('Dashboard counts fetched successfully:', result.data);
        
        // Map API response fields to dashboard state fields
        const mappedCounts = {
          totalPatients: result.data.total_patients || 0,
          totalAppointments: result.data.total_todays_appointments || 0,
          todayAppointments: result.data.total_todays_appointments || 0,
          completedToday: result.data.total_completed_appointments || 0,
          waitingList: result.data.total_waiting_list || 0,
          noShows: result.data.total_no_shows || 0,
          upcomingAppointments: result.data.total_todays_appointments || 0
        };
        
        setDashboardCounts(mappedCounts);
      } else {
        console.error('Failed to fetch dashboard counts:', result.message);
        // Keep default values on error
      }
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
      // Keep default values on error
    } finally {
      setLoadingCounts(false);
    }
  }, []);

  // Fetch dashboard counts on component mount
  useEffect(() => {
    fetchDashboardCounts();
  }, [fetchDashboardCounts]);

  // Sample departments data
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'neurology', name: 'Neurology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'oncology', name: 'Oncology' },
    { id: 'psychiatry', name: 'Psychiatry' },
    { id: 'general', name: 'General Medicine' },
  ];

  // Sample doctors data
  const doctors = [
    { id: 'all', name: 'All Doctors', department: 'all' },
    { id: 'dr-smith', name: 'Dr. Sarah Smith', department: 'cardiology' },
    { id: 'dr-johnson', name: 'Dr. Michael Johnson', department: 'neurology' },
    { id: 'dr-williams', name: 'Dr. Emily Williams', department: 'orthopedics' },
    { id: 'dr-brown', name: 'Dr. David Brown', department: 'pediatrics' },
    { id: 'dr-davis', name: 'Dr. Lisa Davis', department: 'dermatology' },
    { id: 'dr-miller', name: 'Dr. Robert Miller', department: 'oncology' },
    { id: 'dr-wilson', name: 'Dr. Jennifer Wilson', department: 'psychiatry' },
    { id: 'dr-moore', name: 'Dr. Thomas Moore', department: 'general' },
    { id: 'dr-taylor', name: 'Dr. Amanda Taylor', department: 'cardiology' },
    { id: 'dr-anderson', name: 'Dr. Christopher Anderson', department: 'neurology' },
  ];

  // Filter doctors based on selected department
  const filteredDoctors = doctors.filter(doctor => 
    selectedDepartment === 'all' || doctor.department === selectedDepartment
  );

  // Filter appointments based on selected filters
  const filterAppointments = (appointments) => {
    return appointments.filter(appointment => {
      const matchesDepartment = selectedDepartment === 'all' || 
        (appointment.doctor && appointment.doctor.department === selectedDepartment);
      const matchesDoctor = selectedDoctor === 'all' || 
        (appointment.doctor && appointment.doctor.id === selectedDoctor);
      return matchesDepartment && matchesDoctor;
    });
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
        doctor: { id: 'dr-smith', name: 'Dr. Sarah Smith', department: 'cardiology' },
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
        doctor: { id: 'dr-johnson', name: 'Dr. Michael Johnson', department: 'neurology' },
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
        doctor: { id: 'dr-moore', name: 'Dr. Thomas Moore', department: 'general' },
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
        doctor: { id: 'dr-smith', name: 'Dr. Sarah Smith', department: 'cardiology' },
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
        doctor: { id: 'dr-moore', name: 'Dr. Thomas Moore', department: 'general' },
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
        doctor: { id: 'dr-williams', name: 'Dr. Emily Williams', department: 'orthopedics' },
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
        doctor: { id: 'dr-johnson', name: 'Dr. Michael Johnson', department: 'neurology' },
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
        doctor: { id: 'dr-moore', name: 'Dr. Thomas Moore', department: 'general' },
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
        doctor: { id: 'dr-wilson', name: 'Dr. Jennifer Wilson', department: 'psychiatry' },
        waitingSince: '45 minutes ago',
      },
    ],
  };

  const getTabData = () => {
    let appointments;
    switch (activeTab) {
      case 'upcoming':
        appointments = todayAppointments.upcoming;
        break;
      case 'completed':
        appointments = todayAppointments.completed;
        break;
      case 'notVisited':
        appointments = todayAppointments.notVisited;
        break;
      case 'waitingList':
        appointments = todayAppointments.waitingList;
        break;
      default:
        appointments = todayAppointments.upcoming;
    }
    return filterAppointments(appointments);
  };

  const getTabCount = (tab) => {
    const appointments = todayAppointments[tab] || [];
    return filterAppointments(appointments).length;
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
            {loadingCounts ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : (
              <>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardCounts.totalPatients || 0}
                </p>
                <p className="text-gray-600 text-sm">Registered patients</p>
              </>
            )}
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
            {loadingCounts ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : (
              <>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardCounts.todayAppointments || 0}
                </p>
                <p className="text-gray-600 text-sm">
                  {dashboardCounts.upcomingAppointments || 0} upcoming
                </p>
              </>
            )}
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
            {loadingCounts ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : (
              <>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardCounts.completedToday || 0}
                </p>
                <p className="text-green-600 text-sm font-medium">
                  Appointments done
                </p>
              </>
            )}
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
            {loadingCounts ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : (
              <>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardCounts.waitingList || 0}
                </p>
                <p className="text-orange-600 text-sm">Patients waiting</p>
              </>
            )}
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
            {loadingCounts ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : (
              <>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardCounts.noShows || 0}
                </p>
                <p className="text-red-600 text-sm">Missed appointments</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-4 border border-[#E9DFC3]/70 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="w-4 h-4 text-[#0118D8]" />
            <span className="text-sm font-medium text-gray-700">Filter Appointments:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Department Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedDoctor('all'); // Reset doctor when department changes
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-[#0118D8] transition-colors"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-[#0118D8] transition-colors"
              >
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedDoctor('all');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
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
          <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
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
             <nav className="flex overflow-x-auto scrollbar-hide mobile-optimized-tabs">
               <button
                 onClick={() => setActiveTab('upcoming')}
                 className={`flex-shrink-0 py-4 px-4 sm:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                   activeTab === 'upcoming'
                     ? 'border-[#0118D8] text-[#0118D8] bg-[#0118D8]/5'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
                   <Clock className="w-5 h-5 sm:w-5 sm:h-5 mx-auto sm:mx-0" />
                   <span className="hidden sm:inline">Upcoming</span>
                   <span className="sm:hidden text-xs font-medium">({getTabCount('upcoming')})</span>
                 </div>
               </button>
               <button
                 onClick={() => setActiveTab('completed')}
                 className={`flex-shrink-0 py-4 px-4 sm:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                   activeTab === 'completed'
                     ? 'border-green-500 text-green-600 bg-green-50'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
                   <CheckCircle2 className="w-5 h-5 sm:w-5 sm:h-5 mx-auto sm:mx-0" />
                   <span className="hidden sm:inline">Completed</span>
                   <span className="sm:hidden text-xs font-medium">({getTabCount('completed')})</span>
                 </div>
               </button>
               <button
                 onClick={() => setActiveTab('waitingList')}
                 className={`flex-shrink-0 py-4 px-4 sm:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                   activeTab === 'waitingList'
                     ? 'border-orange-500 text-orange-600 bg-orange-50'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
                   <FaUserClock className="w-5 h-5 sm:w-5 sm:h-5 mx-auto sm:mx-0" />
                   <span className="hidden sm:inline">Waiting List</span>
                   <span className="sm:hidden text-xs font-medium">({getTabCount('waitingList')})</span>
                 </div>
               </button>
               <button
                 onClick={() => setActiveTab('notVisited')}
                 className={`flex-shrink-0 py-4 px-4 sm:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                   activeTab === 'notVisited'
                     ? 'border-red-500 text-red-600 bg-red-50'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
                   <XCircle className="w-5 h-5 sm:w-5 sm:h-5 mx-auto sm:mx-0" />
                   <span className="hidden sm:inline">No Shows</span>
                   <span className="sm:hidden text-xs font-medium">({getTabCount('notVisited')})</span>
                 </div>
               </button>
             </nav>
           </div>

                     {/* Appointments List */}
           <div className="p-4 sm:p-6">
             <div className="space-y-6">
               {getTabData().map((appointment) => (
                 <motion.div
                   key={appointment.id}
                   variants={itemVariants}
                   className="group bg-white rounded-xl p-4 sm:p-4 border border-[#E9DFC3]/70 hover:border-[#1B56FD] shadow-sm hover:shadow-md transition-all"
                 >
                                       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start lg:items-center gap-3 lg:gap-4 flex-1">
                        {/* Time or Waiting Info */}
                        <div className="text-center flex-shrink-0">
                          {activeTab === 'waitingList' ? (
                            <>
                              <div className="text-lg lg:text-base font-semibold text-orange-600">
                                Waiting
                              </div>
                              <div className="text-sm lg:text-xs text-gray-500">
                                {appointment.waitingSince}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xl lg:text-lg font-semibold text-[#0118D8]">
                                {appointment.time}
                              </div>
                              <div className="text-sm lg:text-xs text-gray-500">30min</div>
                            </>
                          )}
                        </div>

                        {/* Patient Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 mb-2">
                            <h4 className="text-lg lg:text-base font-semibold text-gray-900 group-hover:text-[#0118D8] transition-colors">
                              {appointment.patientName}
                            </h4>
                            <div className="flex flex-wrap gap-2 lg:gap-3">
                              <span className="text-sm lg:text-xs text-gray-500">
                                ID: {appointment.patientId}
                              </span>
                              <span className="text-sm lg:text-xs text-gray-500">
                                Age: {appointment.age}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-sm lg:text-xs">
                            <span className="flex items-center gap-1.5">
                              <FaStethoscope className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-gray-400" />
                              {appointment.condition}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaNotesMedical className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-gray-400" />
                              {appointment.type}
                            </span>
                            {appointment.doctor && (
                              <span className="flex items-center gap-1.5">
                                <FaUserMd className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-gray-400" />
                                {appointment.doctor.name}
                              </span>
                            )}
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
                            <div className="mt-2 text-xs lg:text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        {activeTab !== 'waitingList' && (
                          <div className="flex flex-col items-start lg:items-end gap-2 lg:mr-4">
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
                        <div className="lg:ml-4">
                          <button className="w-full lg:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs lg:text-sm font-medium">
                            <UserPlus className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Allocate Slot</span>
                            <span className="lg:hidden">Allocate</span>
                          </button>
                        </div>
                      )}
                    </div>

                                     {/* Secondary Action Buttons */}
                                       <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-100">
                      {activeTab === 'upcoming' && (
                        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs lg:text-sm font-medium">
                            <FaPhone className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Call Patient</span>
                            <span className="lg:hidden">Call</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#1B56FD]/5 text-[#1B56FD] rounded-lg hover:bg-[#1B56FD]/10 transition-colors text-xs lg:text-sm font-medium">
                            <FaEye className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">View Profile</span>
                            <span className="lg:hidden">Profile</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#E9DFC3]/30 text-[#8B7355] rounded-lg hover:bg-[#E9DFC3]/50 transition-colors text-xs lg:text-sm font-medium">
                            <FaChartLine className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Patient Timeline</span>
                            <span className="lg:hidden">Timeline</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVitalsAppointment(appointment);
                              setShowVitalsModal(true);
                            }}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <Activity className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Add Vitals</span>
                            <span className="lg:hidden">Vitals</span>
                          </button>
                          <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <FaUpload className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Upload Report</span>
                            <span className="lg:hidden">Upload</span>
                          </button>
                        </div>
                      )}

                                                               {activeTab === 'waitingList' && (
                        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                          <button 
                            onClick={() => navigate('/clinic/patient-booking')}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-purple-500/5 text-purple-600 rounded-lg hover:bg-purple-500/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <FaCalendarAlt className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Book Appointment</span>
                            <span className="lg:hidden">Book</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs lg:text-sm font-medium">
                            <FaPhone className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Call Patient</span>
                            <span className="lg:hidden">Call</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#1B56FD]/5 text-[#1B56FD] rounded-lg hover:bg-[#1B56FD]/10 transition-colors text-xs lg:text-sm font-medium">
                            <FaEye className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">View Profile</span>
                            <span className="lg:hidden">Profile</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#E9DFC3]/30 text-[#8B7355] rounded-lg hover:bg-[#E9DFC3]/50 transition-colors text-xs lg:text-sm font-medium">
                            <FaChartLine className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Patient Timeline</span>
                            <span className="lg:hidden">Timeline</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVitalsAppointment(appointment);
                              setShowVitalsModal(true);
                            }}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <Activity className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Add Vitals</span>
                            <span className="lg:hidden">Vitals</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-red-500/5 text-red-600 rounded-lg hover:bg-red-500/10 transition-colors text-xs lg:text-sm font-medium">
                            <X className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Remove from List</span>
                            <span className="lg:hidden">Remove</span>
                          </button>
                          <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <FaUpload className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Upload Report</span>
                            <span className="lg:hidden">Upload</span>
                          </button>
                        </div>
                      )}

                                                               {(activeTab === 'completed' ||
                        activeTab === 'notVisited') && (
                        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs lg:text-sm font-medium">
                            <FaHistory className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">View Consultation Log</span>
                            <span className="lg:hidden">View Log</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#1B56FD]/5 text-[#1B56FD] rounded-lg hover:bg-[#1B56FD]/10 transition-colors text-xs lg:text-sm font-medium">
                            <FaEye className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">View Profile</span>
                            <span className="lg:hidden">Profile</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#E9DFC3]/30 text-[#8B7355] rounded-lg hover:bg-[#E9DFC3]/50 transition-colors text-xs lg:text-sm font-medium">
                            <FaChartLine className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Patient Timeline</span>
                            <span className="lg:hidden">Timeline</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVitalsAppointment(appointment);
                              setShowVitalsModal(true);
                            }}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <Activity className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Add Vitals</span>
                            <span className="lg:hidden">Vitals</span>
                          </button>
                          <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-xs lg:text-sm font-medium"
                          >
                            <FaUpload className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span className="hidden lg:inline">Upload Report</span>
                            <span className="lg:hidden">Upload</span>
                          </button>
                        </div>
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
                <X className="w-4 h-4" />
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
