import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaUsers,
  FaUser,
  FaCalendarAlt,
  FaSearch,
  FaChartLine,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCreditCard,
  FaUniversity,
  FaSync,
  FaEdit,
  FaTimes,
} from 'react-icons/fa';

// Theme colors (matching other components)
const COLORS = {
  primary: '#0F1ED1',
  secondary: '#1B56FD',
  white: '#ffffff',
  background: '#F7F8FA',
  surface: '#ffffff',
  border: '#ECEEF2',
  text: '#111827',
  textMuted: '#6B7280',
  gray50: '#F9FAFB',
  success: '#10B981',
  danger: '#EF4444',
};

const BRAND_PRIMARY = '#0118D8';
const BRAND_SECONDARY = '#1B56FD';

// Sample data source (would be fetched from API in real app)
const SAMPLE_CLINICS = {
  'CL-001': {
    id: 'CL-001',
    name: 'City Medical Center',
    location: 'New York, NY',
    address: '123 Medical Plaza, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@citymedical.com',
    doctors: 8,
    staff: 15,
    patients: 450,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    subscription: { 
      plan: 'Professional', 
      price: 10000,
      startDate: '2023-10-15',
      endDate: '2024-01-15',
      status: 'active',
      autoRenew: true,
      paymentMethod: 'Credit Card ending in 1234'
    },
    platform: { feePerAppointment: 12, monthlyAppointments: 380 },
  },
  'CL-002': {
    id: 'CL-002',
    name: 'Heart Care Clinic',
    location: 'Los Angeles, CA',
    address: '456 Health Street, Los Angeles, CA 90210',
    phone: '+1 (555) 234-5678',
    email: 'contact@heartcare.com',
    doctors: 5,
    staff: 12,
    patients: 320,
    specialties: ['Cardiology', 'Cardiovascular Surgery'],
    subscription: { 
      plan: 'Basic', 
      price: 5000,
      startDate: '2023-11-20',
      endDate: '2024-02-20',
      status: 'active',
      autoRenew: false,
      paymentMethod: 'Bank Transfer'
    },
    platform: { feePerAppointment: 12, monthlyAppointments: 260 },
  },
  'CL-003': {
    id: 'CL-003',
    name: 'Downtown Medical Group',
    location: 'Chicago, IL',
    address: '789 Healthcare Ave, Chicago, IL 60601',
    phone: '+1 (555) 345-6789',
    email: 'hello@downtownmed.com',
    doctors: 3,
    staff: 8,
    patients: 180,
    specialties: ['General Medicine', 'Pediatrics'],
    subscription: { 
      plan: 'Professional', 
      price: 10000,
      startDate: '2023-09-25',
      endDate: '2024-01-25',
      status: 'active',
      autoRenew: true,
      paymentMethod: 'Credit Card ending in 5678'
    },
    platform: { feePerAppointment: 12, monthlyAppointments: 140 },
  },
};

// Doctors list - demo only
const SAMPLE_DOCTORS = {
  'CL-001': [
    { id: 'DOC-100', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', phone: '+1 (555) 101-2000', email: 's.wilson@citymedical.com', appointments: 88 },
    { id: 'DOC-101', name: 'Dr. Emily Davis', specialization: 'Neurology', phone: '+1 (555) 101-2001', email: 'e.davis@citymedical.com', appointments: 72 },
    { id: 'DOC-102', name: 'Dr. Michael Chen', specialization: 'Orthopedics', phone: '+1 (555) 101-2002', email: 'm.chen@citymedical.com', appointments: 54 },
  ],
  'CL-002': [
    { id: 'DOC-200', name: 'Dr. James Miller', specialization: 'Cardiology', phone: '+1 (555) 201-2000', email: 'j.miller@heartcare.com', appointments: 65 },
    { id: 'DOC-201', name: 'Dr. Olivia Brown', specialization: 'Cardiovascular Surgery', phone: '+1 (555) 201-2001', email: 'o.brown@heartcare.com', appointments: 58 },
  ],
  'CL-003': [
    { id: 'DOC-300', name: 'Dr. Daniel Lee', specialization: 'General Medicine', phone: '+1 (555) 301-2000', email: 'd.lee@downtownmed.com', appointments: 40 },
    { id: 'DOC-301', name: 'Dr. Ava Patel', specialization: 'Pediatrics', phone: '+1 (555) 301-2001', email: 'a.patel@downtownmed.com', appointments: 39 },
  ],
};

const currency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// Helper functions for subscription calculations
const calculateSubscriptionProgress = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  const totalDuration = end - start;
  const elapsed = now - start;
  
  if (elapsed <= 0) return 0;
  if (elapsed >= totalDuration) return 100;
  
  return Math.round((elapsed / totalDuration) * 100);
};

const getDaysUntilExpiry = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getSubscriptionStatus = (endDate, autoRenew) => {
  const daysLeft = getDaysUntilExpiry(endDate);
  
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 7) return 'critical';
  if (daysLeft <= 30) return 'warning';
  return 'active';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'critical':
    case 'expired':
      return 'text-red-600 bg-red-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-green-600 bg-green-100';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'critical':
      return 'Critical';
    case 'expired':
      return 'Expired';
    case 'warning':
      return 'Warning';
    default:
      return 'Active';
  }
};

const getProgressBarColor = (status) => {
  switch (status) {
    case 'critical':
    case 'expired':
      return 'bg-red-500';
    case 'warning':
      return 'bg-yellow-500';
    default:
      return 'bg-green-500';
  }
};

const ClinicView = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalForm, setRenewalForm] = useState({
    plan: '',
    duration: '3',
    autoRenew: true,
    paymentMethod: '',
    startDate: '',
    notes: ''
  });

  const clinic = useMemo(() => SAMPLE_CLINICS[clinicId] || Object.values(SAMPLE_CLINICS)[0], [clinicId]);
  const doctors = useMemo(() => SAMPLE_DOCTORS[clinic.id] || [], [clinic.id]);

  const monthlyPlatformRevenue = useMemo(() => clinic.platform.monthlyAppointments * clinic.platform.feePerAppointment, [clinic]);
  const monthlySubscriptionRevenue = useMemo(() => clinic.subscription.price, [clinic]);
  const totalMonthlyRevenue = monthlyPlatformRevenue + monthlySubscriptionRevenue;

  // Subscription calculations
  const subscriptionProgress = useMemo(() => 
    calculateSubscriptionProgress(clinic.subscription.startDate, clinic.subscription.endDate), 
    [clinic.subscription]
  );
  const daysUntilExpiry = useMemo(() => 
    getDaysUntilExpiry(clinic.subscription.endDate), 
    [clinic.subscription]
  );
  const subscriptionStatus = useMemo(() => 
    getSubscriptionStatus(clinic.subscription.endDate, clinic.subscription.autoRenew), 
    [clinic.subscription]
  );

  // Match Dashboard.jsx motion variants and hover
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const cardHover = { y: -2, transition: { duration: 0.2 } };

  // Modal handlers
  const handleOpenRenewalModal = () => {
    setRenewalForm({
      plan: clinic.subscription.plan,
      duration: '3',
      autoRenew: clinic.subscription.autoRenew,
      paymentMethod: clinic.subscription.paymentMethod,
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowRenewalModal(true);
  };

  const handleCloseRenewalModal = () => {
    setShowRenewalModal(false);
    setRenewalForm({
      plan: '',
      duration: '3',
      autoRenew: true,
      paymentMethod: '',
      startDate: '',
      notes: ''
    });
  };

  const handleRenewalSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to renew the subscription
    console.log('Renewing subscription:', renewalForm);
    
    // Simulate API call
    setTimeout(() => {
      alert('Subscription renewed successfully!');
      handleCloseRenewalModal();
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setRenewalForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-lg border border-[#E9DFC3]/70 text-[#0118D8] flex items-center justify-center"
              aria-label="Back"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-[1.75rem] md:text-[2rem] font-semibold tracking-tight text-gray-900">{clinic.name}</h1>
          </div>
          <p className="text-gray-600">Comprehensive view of clinic profile, staff, and revenue</p>
        </div>
      </div>

      {/* Summary Cards (styled like Dashboard.jsx) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Doctors */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
              <FaUserMd className="w-5 h-5 text-[#1B56FD]" />
            </div>
            <p className="text-gray-500 text-sm">Doctors</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{clinic.doctors}</p>
            <p className="text-gray-600 text-sm">Onboarded</p>
          </div>
        </motion.div>

        {/* Staff */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <FaUsers className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Staff</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{clinic.staff}</p>
            <p className="text-gray-600 text-sm">Active</p>
          </div>
        </motion.div>

        {/* Patients */}
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <FaUser className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Patients</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{clinic.patients}</p>
            <p className="text-green-600 text-sm font-medium">Growing</p>
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
              <FaDollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">Monthly Revenue</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{currency(totalMonthlyRevenue)}</p>
            <p className="text-gray-600 text-sm">Subscription + Platform</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm">
        <div className="border-b border-[#E9DFC3]/70">
          <nav className="flex gap-6 px-6">
            {[
              { id: 'profile', name: 'Profile', icon: FaHospital },
              { id: 'doctors', name: 'Doctors', icon: FaUserMd },
              { id: 'revenue', name: 'Revenue', icon: FaChartLine },
              { id: 'subscription', name: 'Subscription', icon: FaSync },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? 'text-[#0118D8] border-[#0118D8]' : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panels */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Profile and Contact */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Clinic Profile</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2"><FaMapMarkerAlt className="w-4 h-4 text-gray-500" /> {clinic.location}</div>
                    <div className="flex items-center gap-2"><FaEnvelope className="w-4 h-4 text-gray-500" /> {clinic.email}</div>
                    <div className="flex items-center gap-2"><FaPhone className="w-4 h-4 text-gray-500" /> {clinic.phone}</div>
                    <div className="flex items-start gap-2"><FaHospital className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>{clinic.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialties.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-sm border border-[#DCE4FF] bg-[#0118D8]/10 text-[#0118D8]">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Quick metrics */}
              <div className="space-y-4">
                <div className="rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Operational Metrics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: 'Doctors', value: clinic.doctors }, { label: 'Staff', value: clinic.staff }, { label: 'Patients', value: clinic.patients }].map((m) => (
                      <div key={m.label} className="bg-white rounded-lg border border-[#E9DFC3]/70 p-3 text-center">
                        <div className="text-lg font-semibold text-gray-900">{m.value}</div>
                        <div className="text-xs text-gray-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialty..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-[#E9DFC3]/70 text-sm"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E9DFC3]/70">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-[#E9DFC3]/70">
                    <tr>
                      {['Doctor', 'Specialization', 'Phone', 'Email', 'Appointments (30d)'].map((h) => (
                        <th key={h} className="text-left text-xs font-medium uppercase tracking-wider text-[#0118D8] px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9DFC3]/70">
                    {doctors.map((d) => (
                      <tr key={d.id} className="bg-white">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0118D8]/10 text-[#0118D8] border border-[#0118D8]/20">
                              <FaUserMd className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{d.name}</div>
                              <div className="text-xs text-gray-500">ID: {d.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{d.specialization}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{d.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{d.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{d.appointments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              {/* Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-4">
                  <div className="text-sm text-gray-500">Subscription Plan</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{clinic.subscription.plan}</div>
                  <div className="text-sm text-gray-500">MRR: {currency(clinic.subscription.price)}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-4">
                  <div className="text-sm text-gray-500">Platform Revenue (monthly)</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{currency(monthlyPlatformRevenue)}</div>
                  <div className="text-sm text-gray-500">{clinic.platform.monthlyAppointments} appointments × {currency(clinic.platform.feePerAppointment)}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-4">
                  <div className="text-sm text-gray-500">Total Monthly Revenue</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{currency(totalMonthlyRevenue)}</div>
                  <div className="text-sm text-gray-500">Subscription + Platform</div>
                </div>
              </div>

              {/* Invoices and Usage */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                  <div className="space-y-3">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[#E9DFC3]/70 bg-gray-50">
                        <div>
                          <div className="font-medium text-gray-900">INV-2024-0{i}</div>
                          <div className="text-sm text-gray-500">Subscription • {clinic.subscription.plan}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{currency(clinic.subscription.price)}</div>
                          <div className="text-xs text-emerald-600 flex items-center justify-end gap-1"><FaCheckCircle className="w-3 h-3" /> Paid</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Usage (last 4 months)</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {['Jan','Feb','Mar','Apr'].map((m, idx) => (
                      <div key={m} className="bg-gray-50 rounded-lg p-3 text-center border border-[#E9DFC3]/70">
                        <div className="text-xs text-gray-500">{m}</div>
                        <div className="mt-1 text-lg font-semibold text-gray-900">{Math.round(clinic.platform.monthlyAppointments*(0.85+idx*0.05))}</div>
                        <div className="text-[11px] text-gray-500">appointments</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Subscription Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Plan */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#E9DFC3]/70 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionStatus)}`}>
                      {getStatusText(subscriptionStatus)}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plan</span>
                      <span className="font-semibold text-gray-900">{clinic.subscription.plan}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Cost</span>
                      <span className="font-semibold text-gray-900">{currency(clinic.subscription.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Start Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(clinic.subscription.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">End Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(clinic.subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auto Renewal</span>
                      <span className={`font-semibold ${clinic.subscription.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                        {clinic.subscription.autoRenew ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment Method</span>
                      <span className="font-semibold text-gray-900 flex items-center gap-2">
                        {clinic.subscription.paymentMethod.includes('Credit Card') ? (
                          <FaCreditCard className="w-4 h-4 text-[#0118D8]" />
                        ) : (
                          <FaUniversity className="w-4 h-4 text-[#0118D8]" />
                        )}
                        {clinic.subscription.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expiry Progress */}
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Progress</h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {daysUntilExpiry < 0 ? 'Expired' : `${daysUntilExpiry} days`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {daysUntilExpiry < 0 ? 'Subscription has expired' : 'until expiry'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{subscriptionProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(subscriptionStatus)}`}
                          style={{ width: `${Math.min(subscriptionProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                                         <div className="text-center pt-2">
                       <button 
                         onClick={handleOpenRenewalModal}
                         className="w-full px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#0118D8]/90 transition-colors font-medium"
                       >
                         Renew Subscription
                       </button>
                     </div>
                  </div>
                </div>
              </div>

              {/* Subscription Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E9DFC3]/70 hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <FaEdit className="w-4 h-4 text-[#0118D8]" />
                        <span className="font-medium text-gray-900">Edit Subscription</span>
                      </div>
                      <FaArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E9DFC3]/70 hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <FaSync className="w-4 h-4 text-[#0118D8]" />
                        <span className="font-medium text-gray-900">Toggle Auto Renewal</span>
                      </div>
                      <FaArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E9DFC3]/70 hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <FaCreditCard className="w-4 h-4 text-[#0118D8]" />
                        <span className="font-medium text-gray-900">Update Payment Method</span>
                      </div>
                      <FaArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                  </div>
                </div>

                {/* Renewal History */}
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Renewal History</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2023-10-15', plan: 'Professional', amount: 10000, status: 'Completed' },
                      { date: '2023-07-15', plan: 'Professional', amount: 10000, status: 'Completed' },
                      { date: '2023-04-15', plan: 'Basic', amount: 5000, status: 'Completed' },
                    ].map((renewal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-[#E9DFC3]/70 bg-gray-50">
                        <div>
                          <div className="font-medium text-gray-900">{renewal.plan}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(renewal.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{currency(renewal.amount)}</div>
                          <div className="text-xs text-emerald-600 flex items-center justify-end gap-1">
                            <FaCheckCircle className="w-3 h-3" /> {renewal.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning/Alert Section */}
              {(subscriptionStatus === 'critical' || subscriptionStatus === 'expired') && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-2">
                        {subscriptionStatus === 'expired' ? 'Subscription Expired' : 'Subscription Expiring Soon'}
                      </h4>
                      <p className="text-red-700 text-sm mb-3">
                        {subscriptionStatus === 'expired' 
                          ? 'This clinic\'s subscription has expired. Services may be limited until renewal.'
                          : `This clinic's subscription will expire in ${daysUntilExpiry} days. Please contact the clinic for renewal.`
                        }
                      </p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          Contact Clinic
                        </button>
                        <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                             )}
             </div>
           )}
         </div>
       </div>

       {/* Subscription Renewal Modal */}
       {showRenewalModal && (
         <div
           className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
           style={{
             background: 'rgba(15, 23, 42, 0.4)',
             backdropFilter: 'saturate(140%) blur(8px)',
           }}
           onClick={handleCloseRenewalModal}
         >
           <div
             className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
             style={{
               background: COLORS.surface,
               border: `1px solid ${COLORS.border}`,
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
             }}
             onClick={(e) => e.stopPropagation()}
           >
             {/* Modal Header */}
             <div
               className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
               style={{
                 background: COLORS.white,
                 borderColor: COLORS.border,
               }}
             >
               <div>
                 <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>
                   Renew Subscription
                 </h2>
                 <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                   {clinic.name}
                 </p>
               </div>
               <button
                 onClick={handleCloseRenewalModal}
                 className="w-9 h-9 rounded-xl transition flex items-center justify-center"
                 style={{
                   background: COLORS.white,
                   color: COLORS.textMuted,
                   border: `1px solid ${COLORS.border}`,
                 }}
               >
                 <FaTimes className="w-4 h-4" />
               </button>
             </div>

             {/* Modal Body */}
             <form onSubmit={handleRenewalSubmit} className="p-6 space-y-6">
               {/* Current Subscription Info */}
               <div 
                 className="rounded-lg p-4"
                 style={{ background: COLORS.gray50 }}
               >
                 <h3 className="text-sm font-medium mb-3" style={{ color: COLORS.text }}>
                   Current Subscription
                 </h3>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <span style={{ color: COLORS.textMuted }}>Plan:</span>
                     <span className="ml-2 font-medium" style={{ color: COLORS.text }}>
                       {clinic.subscription.plan}
                     </span>
                   </div>
                   <div>
                     <span style={{ color: COLORS.textMuted }}>Monthly Cost:</span>
                     <span className="ml-2 font-medium" style={{ color: COLORS.text }}>
                       {currency(clinic.subscription.price)}
                     </span>
                   </div>
                   <div>
                     <span style={{ color: COLORS.textMuted }}>Expires:</span>
                     <span className="ml-2 font-medium" style={{ color: COLORS.text }}>
                       {new Date(clinic.subscription.endDate).toLocaleDateString()}
                     </span>
                   </div>
                   <div>
                     <span style={{ color: COLORS.textMuted }}>Days Left:</span>
                     <span 
                       className="ml-2 font-medium"
                       style={{ color: daysUntilExpiry < 0 ? COLORS.danger : COLORS.text }}
                     >
                       {daysUntilExpiry < 0 ? 'Expired' : `${daysUntilExpiry} days`}
                     </span>
                   </div>
                 </div>
               </div>

               {/* Renewal Form */}
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Plan Selection */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                       Subscription Plan
                     </label>
                     <select
                       value={renewalForm.plan}
                       onChange={(e) => handleInputChange('plan', e.target.value)}
                       className="w-full px-3 py-2 rounded-lg transition-colors"
                       style={{
                         background: COLORS.white,
                         border: `2px solid ${COLORS.border}`,
                         color: COLORS.text,
                       }}
                       onFocus={(e) => {
                         e.target.style.borderColor = COLORS.primary;
                         e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                       }}
                       onBlur={(e) => {
                         e.target.style.borderColor = COLORS.border;
                       }}
                       required
                     >
                       <option value="">Select Plan</option>
                       <option value="Basic">Basic - $5,000/month</option>
                       <option value="Standard">Standard - $7,500/month</option>
                       <option value="Professional">Professional - $10,000/month</option>
                       <option value="Enterprise">Enterprise - $15,000/month</option>
                     </select>
                   </div>

                   {/* Duration */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                       Duration (months)
                     </label>
                     <select
                       value={renewalForm.duration}
                       onChange={(e) => handleInputChange('duration', e.target.value)}
                       className="w-full px-3 py-2 rounded-lg transition-colors"
                       style={{
                         background: COLORS.white,
                         border: `2px solid ${COLORS.border}`,
                         color: COLORS.text,
                       }}
                       onFocus={(e) => {
                         e.target.style.borderColor = COLORS.primary;
                         e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                       }}
                       onBlur={(e) => {
                         e.target.style.borderColor = COLORS.border;
                       }}
                       required
                     >
                       <option value="1">1 month</option>
                       <option value="3">3 months</option>
                       <option value="6">6 months</option>
                       <option value="12">12 months (20% discount)</option>
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Start Date */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                       Start Date
                     </label>
                     <input
                       type="date"
                       value={renewalForm.startDate}
                       onChange={(e) => handleInputChange('startDate', e.target.value)}
                       className="w-full px-3 py-2 rounded-lg transition-colors"
                       style={{
                         background: COLORS.white,
                         border: `2px solid ${COLORS.border}`,
                         color: COLORS.text,
                       }}
                       onFocus={(e) => {
                         e.target.style.borderColor = COLORS.primary;
                         e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                       }}
                       onBlur={(e) => {
                         e.target.style.borderColor = COLORS.border;
                       }}
                       required
                     />
                   </div>

                   {/* Payment Method */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                       Payment Method
                     </label>
                     <select
                       value={renewalForm.paymentMethod}
                       onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                       className="w-full px-3 py-2 rounded-lg transition-colors"
                       style={{
                         background: COLORS.white,
                         border: `2px solid ${COLORS.border}`,
                         color: COLORS.text,
                       }}
                       onFocus={(e) => {
                         e.target.style.borderColor = COLORS.primary;
                         e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                       }}
                       onBlur={(e) => {
                         e.target.style.borderColor = COLORS.border;
                       }}
                       required
                     >
                       <option value="">Select Payment Method</option>
                       <option value="Credit Card ending in 1234">Credit Card ending in 1234</option>
                       <option value="Credit Card ending in 5678">Credit Card ending in 5678</option>
                       <option value="Bank Transfer">Bank Transfer</option>
                       <option value="PayPal">PayPal</option>
                     </select>
                   </div>
                 </div>

                 {/* Auto Renewal */}
                 <div className="flex items-center">
                   <input
                     type="checkbox"
                     id="autoRenew"
                     checked={renewalForm.autoRenew}
                     onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                     className="w-4 h-4 rounded transition-colors"
                     style={{
                       borderColor: COLORS.border,
                       accentColor: COLORS.primary,
                     }}
                   />
                   <label htmlFor="autoRenew" className="ml-2 text-sm font-medium" style={{ color: COLORS.text }}>
                     Enable auto-renewal for this subscription
                   </label>
                 </div>

                 {/* Notes */}
                 <div>
                   <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                     Notes (Optional)
                   </label>
                   <textarea
                     value={renewalForm.notes}
                     onChange={(e) => handleInputChange('notes', e.target.value)}
                     rows={3}
                     className="w-full px-3 py-2 rounded-lg transition-colors"
                     style={{
                       background: COLORS.white,
                       border: `2px solid ${COLORS.border}`,
                       color: COLORS.text,
                     }}
                     onFocus={(e) => {
                       e.target.style.borderColor = COLORS.primary;
                       e.target.style.boxShadow = `0 0 0 4px ${COLORS.primary}15`;
                     }}
                     onBlur={(e) => {
                       e.target.style.borderColor = COLORS.border;
                     }}
                     placeholder="Add any special notes or requirements..."
                   />
                 </div>
               </div>

               {/* Cost Summary */}
               <div 
                 className="rounded-lg p-4"
                 style={{ background: `${COLORS.primary}08` }}
               >
                 <h3 className="text-sm font-medium mb-3" style={{ color: COLORS.text }}>
                   Cost Summary
                 </h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span style={{ color: COLORS.textMuted }}>Plan Cost:</span>
                     <span className="font-medium" style={{ color: COLORS.text }}>
                       {renewalForm.plan === 'Basic' ? '$5,000' : 
                        renewalForm.plan === 'Standard' ? '$7,500' : 
                        renewalForm.plan === 'Professional' ? '$10,000' : 
                        renewalForm.plan === 'Enterprise' ? '$15,000' : '$0'} × {renewalForm.duration} months
                     </span>
                   </div>
                   {renewalForm.duration === '12' && (
                     <div className="flex justify-between" style={{ color: COLORS.success }}>
                       <span>Annual Discount (20%):</span>
                       <span className="font-medium">-${renewalForm.plan === 'Basic' ? '12,000' : 
                         renewalForm.plan === 'Standard' ? '18,000' : 
                         renewalForm.plan === 'Professional' ? '24,000' : 
                         renewalForm.plan === 'Enterprise' ? '36,000' : '0'}</span>
                     </div>
                   )}
                   <div 
                     className="border-t pt-2 flex justify-between font-semibold"
                     style={{ borderColor: `${COLORS.primary}20`, color: COLORS.text }}
                   >
                     <span>Total:</span>
                     <span>
                       {renewalForm.plan && renewalForm.duration ? 
                         (() => {
                           const baseCost = renewalForm.plan === 'Basic' ? 5000 : 
                                           renewalForm.plan === 'Standard' ? 7500 : 
                                           renewalForm.plan === 'Professional' ? 10000 : 
                                           renewalForm.plan === 'Enterprise' ? 15000 : 0;
                           const total = baseCost * parseInt(renewalForm.duration);
                           const discount = renewalForm.duration === '12' ? total * 0.2 : 0;
                           return currency(total - discount);
                         })() : '$0'
                       }
                     </span>
                   </div>
                 </div>
               </div>

               {/* Modal Footer */}
               <div 
                 className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                 style={{ borderColor: COLORS.border }}
               >
                 <button
                   type="button"
                   onClick={handleCloseRenewalModal}
                   className="px-4 py-2 rounded-lg transition-colors"
                   style={{
                     background: COLORS.white,
                     color: COLORS.textMuted,
                     border: `2px solid ${COLORS.border}`,
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.background = `${COLORS.textMuted}10`;
                     e.target.style.borderColor = COLORS.textMuted;
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.background = COLORS.white;
                     e.target.style.borderColor = COLORS.border;
                   }}
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="px-6 py-2 rounded-lg transition-colors font-medium"
                   style={{
                     background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                     color: COLORS.white,
                   }}
                 >
                   Renew Subscription
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
     </motion.div>
   );
 };

export default ClinicView;


