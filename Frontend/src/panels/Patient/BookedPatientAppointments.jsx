import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaCheck,
  FaHistory,
  FaCalendarAlt,
  FaCalendarDay,
  FaArrowLeft,
  FaUpload,
} from 'react-icons/fa';

// Modernized theme colors (reduced beige/off-white usage)
const COLORS = {
  primary: '#0F1ED1', // refined deep blue
  primaryDark: '#0B18A8',
  secondary: '#1B56FD',
  white: '#ffffff',
  background: '#F7F8FA', // light neutral app background
  surface: '#ffffff',
  border: '#ECEEF2',
  text: '#111827',
  textMuted: '#6B7280',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#d97706',
  warningBg: '#FEF3C7',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  infoBg: '#EEF2FF',
  info: '#4F46E5',
  gray50: '#F9FAFB',
};

// Status styles more aligned with modern chips
const statusConfig = {
  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    icon: FaCheck,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    icon: FaCheck,
  },
  upcoming: {
    label: 'Upcoming',
    color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    icon: FaClock,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    icon: FaTimes,
  },
};

// Mock data
const mockBookedAppointments = [
  {
    id: 1,
    date: '2024-01-15',
    time: '10:00',
    doctor: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    status: 'completed',
    location: 'Room 201',
    notes: 'Regular checkup, blood pressure normal',
    patientName: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    symptoms: 'Chest pain, shortness of breath',
    prescription: 'Aspirin 81mg daily',
    followUp: '2024-02-15',
  },
  {
    id: 2,
    date: '2024-01-10',
    time: '14:30',
    doctor: 'Dr. Michael Johnson',
    specialty: 'General Practice',
    status: 'confirmed',
    location: 'Room 105',
    notes: 'Annual physical examination',
    patientName: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    symptoms: 'Annual checkup',
    prescription: 'None',
    followUp: '2025-01-10',
  },
  {
    id: 3,
    date: '2024-01-05',
    time: '09:00',
    doctor: 'Dr. Emily Davis',
    specialty: 'Dermatology',
    status: 'cancelled',
    location: 'Room 301',
    notes: 'Patient cancelled due to illness',
    patientName: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    symptoms: 'Skin rash',
    prescription: 'None',
    followUp: null,
  },
  {
    id: 4,
    date: '2023-12-20',
    time: '16:00',
    doctor: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    status: 'completed',
    location: 'Room 205',
    notes: 'Knee pain treatment, recommended physical therapy',
    patientName: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    symptoms: 'Knee pain, difficulty walking',
    prescription: 'Ibuprofen 400mg as needed',
    followUp: '2024-01-20',
  },
  {
    id: 5,
    date: '2023-12-15',
    time: '11:30',
    doctor: 'Dr. Lisa Brown',
    specialty: 'Pediatrics',
    status: 'completed',
    location: 'Room 150',
    notes: 'Vaccination and wellness check',
    patientName: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    symptoms: 'Wellness check',
    prescription: 'None',
    followUp: '2024-06-15',
  },
  {
    id: 6,
    date: '2024-01-20',
    time: '13:00',
    doctor: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    status: 'upcoming',
    location: 'Room 201',
    notes: 'Follow-up appointment',
    patientName: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    symptoms: 'Follow-up for previous treatment',
    prescription: 'Pending',
    followUp: null,
  },
];

const BookedPatientAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'Lab Report',
    description: '',
    priority: 'Normal',
    file: null
  });
  const navigate = useNavigate();

  const handleBackToAppointments = () => {
    navigate('/patient/appointments');
  };

  const filteredAppointments = useMemo(() => {
    let filtered = mockBookedAppointments;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.doctor.toLowerCase().includes(q) ||
          a.specialty.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    return filtered.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [searchTerm, statusFilter]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        file: file
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
        file: null
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleCancelAppointment = (appointment) => {
    if (window.confirm(`Are you sure you want to cancel your appointment with ${appointment.doctor} on ${formatDate(appointment.date)} at ${formatTime(appointment.time)}?`)) {
      // Here you would typically send the cancellation request to your backend
      alert('Appointment cancelled successfully!');
      // You would typically update the appointment status in your backend
      // For now, we'll just show a success message
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    if (Number.isNaN(hour)) return timeString;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || statusConfig.upcoming;

  return (
    <div className="min-h-screen">
      <div className=" space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="space-y-2">
            <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
              Appointment History
            </h1>
            <p className="text-gray-600">
              View and manage your booked appointments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-gray-50 border border-gray-200 text-gray-700">
              <FaHistory className="text-[#0F1ED1]" />
              {filteredAppointments.length} total
            </span>
          </div>
        </div>

          <div className="flex items-center gap-3">
                             <button
                 type="button"
                 onClick={handleBackToAppointments}
                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                 style={{
                   background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                   color: COLORS.primary,
                   border: `1px solid #E2E8F0`,
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.background = 'linear-gradient(135deg, #EEF2FF, #E0E7FF)';
                   e.target.style.borderColor = COLORS.primary;
                   e.target.style.transform = 'translateY(-1px)';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.background = 'linear-gradient(135deg, #F8FAFC, #F1F5F9)';
                   e.target.style.borderColor = '#E2E8F0';
                   e.target.style.transform = 'translateY(0)';
                 }}
               >
                 <FaArrowLeft className="w-4 h-4" />
                 Back to Appointments
               </button>
            </div>

        {/* Filters */}
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor, specialty, or location..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl transition"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                className="px-3 py-2.5 rounded-xl transition"
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  color: COLORS.text,
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              background: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: COLORS.text }}
            >
              Your Appointments
            </h2>
          </div>

          <div className="divide-y" style={{ borderColor: COLORS.border }}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const status = getStatusConfig(appointment.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={appointment.id}
                    className="p-6 transition-colors"
                    style={{ background: COLORS.surface }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Date Pill */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                            }}
                          >
                            <span className="text-[11px] font-medium opacity-90">
                              {new Date(appointment.date).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                }
                              )}
                            </span>
                            <span className="text-xl font-bold">
                              {new Date(appointment.date).getDate()}
                            </span>
                          </div>
                          <div className="text-center mt-1">
                            <span
                              className="text-xs"
                              style={{ color: COLORS.textMuted }}
                            >
                              {formatTime(appointment.time)}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                                                     <div className="flex items-start justify-between gap-2 mb-2">
                             <div>
                               <h3
                                 className="text-[1.05rem] font-semibold"
                                 style={{ color: COLORS.text }}
                               >
                                 {appointment.doctor}
                               </h3>
                               <div className="flex items-center gap-2">
                                 <p
                                   className="text-sm"
                                   style={{ color: COLORS.textMuted }}
                                 >
                                   {appointment.specialty}
                                 </p>
                                 <span
                                   className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                                 >
                                   <StatusIcon className="w-3 h-3" />
                                   {status.label}
                                 </span>
                               </div>
                             </div>
                           </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div
                              className="flex items-center gap-2"
                              style={{ color: COLORS.textMuted }}
                            >
                              <FaMapMarkerAlt
                                style={{ color: COLORS.primary }}
                              />
                              <span>{appointment.location}</span>
                            </div>
                            <div
                              className="flex items-center gap-2"
                              style={{ color: COLORS.textMuted }}
                            >
                              <FaCalendarAlt
                                style={{ color: COLORS.primary }}
                              />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                          </div>

                          {appointment.notes ? (
                            <div
                              className="mt-3 p-3 rounded-xl"
                              style={{
                                background: COLORS.gray50,
                                border: `1px solid ${COLORS.border}`,
                              }}
                            >
                              <p
                                className="text-sm"
                                style={{ color: COLORS.text }}
                              >
                                <span className="font-medium">Notes:</span>{' '}
                                {appointment.notes}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        <div className="flex gap-2">
                                                     <button
                             type="button"
                             onClick={() => handleViewDetails(appointment)}
                             className="px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md"
                             style={{
                               background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                               color: COLORS.primary,
                               border: `1px solid #E2E8F0`,
                             }}
                             onMouseEnter={(e) => {
                               e.target.style.background = 'linear-gradient(135deg, #EEF2FF, #E0E7FF)';
                               e.target.style.borderColor = COLORS.primary;
                               e.target.style.transform = 'translateY(-1px)';
                             }}
                             onMouseLeave={(e) => {
                               e.target.style.background = 'linear-gradient(135deg, #F8FAFC, #F1F5F9)';
                               e.target.style.borderColor = '#E2E8F0';
                               e.target.style.transform = 'translateY(0)';
                             }}
                           >
                             <FaEye className="w-4 h-4" />
                             View Details
                           </button>
                                                      {(appointment.status === 'completed' || appointment.status === 'confirmed' || appointment.status === 'upcoming') && (
                              <button
                                type="button"
                                onClick={() => setShowUploadModal(true)}
                                className="px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md"
                                style={{
                                  background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                                  color: '#059669',
                                  border: `1px solid #BBF7D0`,
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'linear-gradient(135deg, #DCFCE7, #BBF7D0)';
                                  e.target.style.borderColor = '#059669';
                                  e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'linear-gradient(135deg, #F0FDF4, #DCFCE7)';
                                  e.target.style.borderColor = '#BBF7D0';
                                  e.target.style.transform = 'translateY(0)';
                                }}
                              >
                                <FaUpload className="w-4 h-4" />
                                Upload Report
                              </button>
                            )}
                            {(appointment.status === 'upcoming' || appointment.status === 'confirmed') && (
                              <button
                                type="button"
                                onClick={() => handleCancelAppointment(appointment)}
                                className="px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md"
                                style={{
                                  background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
                                  color: '#DC2626',
                                  border: `1px solid #FECACA`,
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'linear-gradient(135deg, #FEE2E2, #FECACA)';
                                  e.target.style.borderColor = '#DC2626';
                                  e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'linear-gradient(135deg, #FEF2F2, #FEE2E2)';
                                  e.target.style.borderColor = '#FECACA';
                                  e.target.style.transform = 'translateY(0)';
                                }}
                              >
                                <FaTimes className="w-4 h-4" />
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <div
                  className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                  style={{
                    background: COLORS.gray50,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <FaCalendarDay className="w-8 h-8 text-gray-400" />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  No appointments found
                </h3>
                <p className="mt-1" style={{ color: COLORS.textMuted }}>
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : "You haven't booked any appointments yet"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetails && selectedAppointment ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'saturate(140%) blur(6px)',
            }}
            onClick={() => setShowDetails(false)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Appointment Details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="w-9 h-9 rounded-xl transition flex items-center justify-center"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Top summary */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-20 h-20 rounded-xl flex flex-col items-center justify-center text-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    }}
                  >
                    <span className="text-sm font-medium opacity-90">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                        }
                      )}
                    </span>
                    <span className="text-2xl font-bold">
                      {new Date(selectedAppointment.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      {selectedAppointment.doctor}
                    </h2>
                    <p style={{ color: COLORS.textMuted }}>
                      {selectedAppointment.specialty}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                      <span style={{ color: COLORS.textMuted }}>
                        {formatDate(selectedAppointment.date)} at{' '}
                        {formatTime(selectedAppointment.time)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusConfig(selectedAppointment.status).color
                        }`}
                      >
                        {(() => {
                          const Icon = getStatusConfig(
                            selectedAppointment.status
                          ).icon;
                          return <Icon className="w-3.5 h-3.5" />;
                        })()}
                        {getStatusConfig(selectedAppointment.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location & contact */}
                  <div className="space-y-4">
                    <div
                      className="rounded-xl p-4"
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.white,
                      }}
                    >
                      <h4
                        className="font-medium mb-3"
                        style={{ color: COLORS.text }}
                      >
                        Location & Contact
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div
                          className="flex items-center gap-2"
                          style={{ color: COLORS.text }}
                        >
                          <FaMapMarkerAlt
                            style={{ color: COLORS.primary }}
                            className="w-4 h-4"
                          />
                          <span>{selectedAppointment.location}</span>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          style={{ color: COLORS.text }}
                        >
                          <FaPhone
                            style={{ color: COLORS.primary }}
                            className="w-4 h-4"
                          />
                          <span>{selectedAppointment.phone}</span>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          style={{ color: COLORS.text }}
                        >
                          <FaUser
                            style={{ color: COLORS.primary }}
                            className="w-4 h-4"
                          />
                          <span>{selectedAppointment.patientName}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="rounded-xl p-4"
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.white,
                      }}
                    >
                      <h4
                        className="font-medium mb-3"
                        style={{ color: COLORS.text }}
                      >
                        Symptoms
                      </h4>
                      <p className="text-sm" style={{ color: COLORS.text }}>
                        {selectedAppointment.symptoms}
                      </p>
                    </div>
                  </div>

                  {/* Medical info */}
                  <div className="space-y-4">
                    <div
                      className="rounded-xl p-4"
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.white,
                      }}
                    >
                      <h4
                        className="font-medium mb-3"
                        style={{ color: COLORS.text }}
                      >
                        Prescription
                      </h4>
                      <p className="text-sm" style={{ color: COLORS.text }}>
                        {selectedAppointment.prescription}
                      </p>
                    </div>

                    {selectedAppointment.followUp ? (
                      <div
                        className="rounded-xl p-4"
                        style={{
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.white,
                        }}
                      >
                        <h4
                          className="font-medium mb-3"
                          style={{ color: COLORS.text }}
                        >
                          Follow-up Appointment
                        </h4>
                        <p className="text-sm" style={{ color: COLORS.text }}>
                          {formatDate(selectedAppointment.followUp)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes ? (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.white,
                    }}
                  >
                    <h4
                      className="font-medium mb-3"
                      style={{ color: COLORS.text }}
                    >
                      Notes
                    </h4>
                    <p className="text-sm" style={{ color: COLORS.text }}>
                      {selectedAppointment.notes}
                    </p>
                  </div>
                ) : null}

                {/* Actions */}
                <div
                  className="flex gap-3 pt-4"
                  style={{ borderTop: `1px solid ${COLORS.border}` }}
                >
                                     <button
                     type="button"
                     onClick={() => setShowDetails(false)}
                     className="flex-1 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                     style={{
                       background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                       color: COLORS.text,
                       border: `1px solid #E2E8F0`,
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.background = 'linear-gradient(135deg, #F1F5F9, #E2E8F0)';
                       e.target.style.borderColor = '#CBD5E1';
                       e.target.style.transform = 'translateY(-1px)';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.background = 'linear-gradient(135deg, #F8FAFC, #F1F5F9)';
                       e.target.style.borderColor = '#E2E8F0';
                       e.target.style.transform = 'translateY(0)';
                     }}
                   >
                     Close
                   </button>
                                      {selectedAppointment.status === 'upcoming' ? (
                      <>
                        <button
                          type="button"
                          className="flex-1 py-3 rounded-lg font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200"
                          style={{
                            background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(15, 30, 209, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDetails(false);
                            handleCancelAppointment(selectedAppointment);
                          }}
                          className="flex-1 py-3 rounded-lg font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200"
                          style={{
                            background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(220, 38, 38, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          Cancel Appointment
                        </button>
                      </>
                    ) : selectedAppointment.status === 'confirmed' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDetails(false);
                            setShowUploadModal(true);
                          }}
                          className="flex-1 py-3 rounded-lg font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200"
                          style={{
                            background: 'linear-gradient(135deg, #059669, #047857)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(5, 150, 105, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          Upload Report
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDetails(false);
                            handleCancelAppointment(selectedAppointment);
                          }}
                          className="flex-1 py-3 rounded-lg font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200"
                          style={{
                            background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(220, 38, 38, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          Cancel Appointment
                        </button>
                      </>
                    ) : selectedAppointment.status === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDetails(false);
                          setShowUploadModal(true);
                        }}
                        className="flex-1 py-3 rounded-lg font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200"
                        style={{
                          background: 'linear-gradient(135deg, #059669, #047857)',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 10px 25px -5px rgba(5, 150, 105, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        Upload Report
                      </button>
                    ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

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
                  <h3 className="text-xl font-semibold" style={{ color: '#111827' }}>
                    Upload Medical Report
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Add a new report to your medical record
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
              <form onSubmit={(e) => { e.preventDefault(); handleUploadSubmit(); }} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                        Report Title <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
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
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Report Type
                    </label>
                    <div className="relative">
                      <select
                        value={uploadForm.type}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
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
                        <option value="Consultation Report">Consultation Report</option>
                        <option value="Procedure Report">Procedure Report</option>
                        <option value="Patient Report">Patient Report</option>
                        <option value="Other">Other</option>
                      </select>
                      <div 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                        style={{ color: '#6B7280' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={uploadForm.priority}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, priority: e.target.value }))}
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
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
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Report Description <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
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
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: '#ECEEF2' }}>
                                     <button
                     type="button"
                     onClick={() => setShowUploadModal(false)}
                     className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                     style={{
                       background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                       color: '#6B7280',
                       border: '2px solid #E2E8F0',
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.background = 'linear-gradient(135deg, #F1F5F9, #E2E8F0)';
                       e.target.style.borderColor = '#CBD5E1';
                       e.target.style.transform = 'translateY(-1px)';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.background = 'linear-gradient(135deg, #F8FAFC, #F1F5F9)';
                       e.target.style.borderColor = '#E2E8F0';
                       e.target.style.transform = 'translateY(0)';
                     }}
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                     style={{
                       background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                       color: '#ffffff',
                       border: 'none',
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.transform = 'translateY(-1px)';
                       e.target.style.boxShadow = '0 20px 25px -5px rgba(15, 30, 209, 0.3), 0 10px 10px -5px rgba(15, 30, 209, 0.2)';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.transform = 'translateY(0)';
                       e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                     }}
                   >
                     Upload Report
                   </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedPatientAppointments;
