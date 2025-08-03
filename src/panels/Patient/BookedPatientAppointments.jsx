import React, { useMemo, useState } from 'react';
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
                              <p
                                className="text-sm"
                                style={{ color: COLORS.textMuted }}
                              >
                                {appointment.specialty}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {status.label}
                            </span>
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
                        <button
                          type="button"
                          onClick={() => handleViewDetails(appointment)}
                          className="px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm font-medium shadow-sm"
                          style={{
                            background: COLORS.white,
                            color: COLORS.primary,
                            border: `1px solid ${COLORS.border}`,
                          }}
                        >
                          <FaEye className="w-4 h-4" />
                          View Details
                        </button>
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
                    className="flex-1 py-2.5 rounded-xl font-medium transition"
                    style={{
                      background: COLORS.gray50,
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    Close
                  </button>
                  {selectedAppointment.status === 'upcoming' ? (
                    <button
                      type="button"
                      className="flex-1 py-2.5 rounded-xl font-medium text-white shadow-sm transition"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    >
                      Reschedule
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookedPatientAppointments;
