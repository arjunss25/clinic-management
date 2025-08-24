import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
  FaClock,
  FaUser,
  FaPhone,
  FaNotesMedical,
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaHistory,
  FaStethoscope,
  FaPrescriptionBottleAlt,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaPrint,
} from 'react-icons/fa';
import { SiTicktick } from 'react-icons/si';

// Theme colors (matching your existing design)
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
  warning: '#F59E0B',
  danger: '#EF4444',
};

// Utilities
const pad = (n) => n.toString().padStart(2, '0');

function formatDate(date) {
  if (typeof date === 'string') return date;
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function getMonthDays(year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Array.from(
    { length: lastDay },
    (_, i) => new Date(year, month, i + 1)
  );
}

function getMonthMatrix(year, month) {
  const days = getMonthDays(year, month);
  const matrix = [];
  let week = [];
  const first = days[0];
  const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;
  for (let i = 0; i < startDay; i += 1) week.push(null);
  days.forEach((d) => {
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    week.push(d);
  });
  while (week.length < 7) week.push(null);
  matrix.push(week);
  return matrix;
}

// Mock appointment history data (same as before)
const mockAppointmentHistory = [
  // Current month - Busy day
  {
    id: 1,
    date: '2025-08-15',
    time: '09:00',
    duration: 30,
    status: 'completed',
    patient: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      reason: 'Regular checkup',
      age: 35,
      gender: 'Male',
    },
    notes: 'Patient reported feeling better. Blood pressure normal.',
    diagnosis: 'Healthy - No issues found',
    prescription: 'Continue current medications',
    followUp: '2024-04-15',
  },
  {
    id: 2,
    date: '2025-08-15',
    time: '10:00',
    duration: 45,
    status: 'completed',
    patient: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      reason: 'Follow-up consultation',
      age: 28,
      gender: 'Female',
    },
    notes: 'Patient experiencing mild symptoms. Lab results reviewed.',
    diagnosis: 'Seasonal allergies',
    prescription: 'Cetirizine 10mg daily',
    followUp: '2024-04-01',
  },
  {
    id: 3,
    date: '2025-08-15',
    time: '11:00',
    duration: 30,
    status: 'completed',
    patient: {
      name: 'Robert Chen',
      phone: '+1 (555) 234-5678',
      reason: 'Vaccination',
      age: 42,
      gender: 'Male',
    },
    notes: 'Flu shot administered. No adverse reactions.',
    diagnosis: 'Vaccination completed',
    prescription: 'None',
    followUp: '2025-03-15',
  },
  {
    id: 4,
    date: '2025-08-15',
    time: '14:00',
    duration: 60,
    status: 'completed',
    patient: {
      name: 'Maria Garcia',
      phone: '+1 (555) 345-6789',
      reason: 'Prenatal checkup',
      age: 31,
      gender: 'Female',
    },
    notes: 'Pregnancy progressing well. All tests normal.',
    diagnosis: 'Healthy pregnancy - 24 weeks',
    prescription: 'Prenatal vitamins',
    followUp: '2024-03-29',
  },
  {
    id: 5,
    date: '2025-08-15',
    time: '15:30',
    duration: 45,
    status: 'cancelled',
    patient: {
      name: 'James Wilson',
      phone: '+1 (555) 456-7890',
      reason: 'Annual physical',
      age: 55,
      gender: 'Male',
    },
    notes: 'Patient cancelled due to emergency',
    diagnosis: 'Appointment cancelled',
    prescription: 'None',
    followUp: '2024-03-22',
  },
  // Add more mock data here...
  {
    id: 6,
    date: '2025-08-20',
    time: '09:00',
    duration: 30,
    status: 'completed',
    patient: {
      name: 'Emma Wilson',
      phone: '+1 (555) 345-6789',
      reason: 'Annual checkup',
      age: 28,
      gender: 'Female',
    },
    notes: 'Patient in excellent health. All vitals normal.',
    diagnosis: 'Healthy - No issues found',
    prescription: 'None',
    followUp: '2026-01-20',
  },
  {
    id: 7,
    date: '2025-08-22',
    time: '14:00',
    duration: 60,
    status: 'completed',
    patient: {
      name: 'David Chen',
      phone: '+1 (555) 456-7890',
      reason: 'Diabetes follow-up',
      age: 45,
      gender: 'Male',
    },
    notes: 'Blood sugar levels well controlled. Continue current treatment.',
    diagnosis: 'Type 2 Diabetes - Well managed',
    prescription: 'Continue Metformin 500mg twice daily',
    followUp: '2025-02-20',
  },
];

const statusStyles = {
  completed: {
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    color: '#047857',
    border: '1px solid #a7f3d0',
    icon: <FaCheck className="w-4 h-4" />,
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelled: {
    bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    color: '#dc2626',
    border: '1px solid #fecaca',
    icon: <FaTimes className="w-4 h-4" />,
    badge: 'bg-red-100 text-red-800 border-red-200',
  },
  noShow: {
    bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    color: '#d97706',
    border: '1px solid #fed7aa',
    icon: <FaTimes className="w-4 h-4" />,
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments] = useState(mockAppointmentHistory);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const monthMatrix = useMemo(
    () => getMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    const formattedDate = formatDate(date);
    return appointments.filter(
      (appointment) => appointment.date === formattedDate
    );
  };

  const getAppointmentCounts = (date) => {
    const dayAppointments = getAppointmentsForDay(date);
    return {
      total: dayAppointments.length,
      completed: dayAppointments.filter((a) => a.status === 'completed').length,
      cancelled: dayAppointments.filter((a) => a.status === 'cancelled').length,
      noShow: dayAppointments.filter((a) => a.status === 'noShow').length,
    };
  };

  const goToToday = () => {
    const t = new Date();
    setCurrentMonth(t);
    setSelectedDate(t);
  };

  const prevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const nextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const openDayView = (date) => {
    const dayAppointments = getAppointmentsForDay(date);
    setSelectedDayAppointments(dayAppointments);
    setSelectedDayDate(date);
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const openAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const filteredDayAppointments = useMemo(() => {
    if (filterStatus === 'all') return selectedDayAppointments;
    return selectedDayAppointments.filter((app) => app.status === filterStatus);
  }, [selectedDayAppointments, filterStatus]);

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const today = new Date();

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
            <div className="space-y-1">
              <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
                Appointment History
              </h1>
              <p
                className="text-sm sm:text-base"
                style={{ color: COLORS.textMuted }}
              >
                View and manage your appointment history
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* Status indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="hidden sm:inline">Completed</span>
                </span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-rose-700 bg-rose-50 ring-1 ring-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span className="hidden sm:inline">Cancelled</span>
                </span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-amber-700 bg-amber-50 ring-1 ring-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span className="hidden sm:inline">No Show</span>
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  className="flex-1 sm:flex-none inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  }}
                >
                  <FaDownload className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                </button>

                <button
                  type="button"
                  className="flex-1 sm:flex-none inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.success}, #059669)`,
                  }}
                >
                  <FaPrint className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                  <span className="sm:hidden">Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/doctor/appointments')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition shadow-sm"
              style={{
                background: COLORS.white,
                color: COLORS.primary,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Appointments
            </button>
          </div>

          {/* Enhanced Calendar Card */}
          <div
            className="rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {/* Calendar Header */}
            <div
              className="px-3 sm:px-5 py-3 sm:py-4 border-b"
              style={{ background: COLORS.white, borderColor: COLORS.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-[inherit] transition flex items-center justify-center shadow-sm"
                    style={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.primary,
                    }}
                    aria-label="Previous month"
                  >
                    <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <h2
                    className="text-base sm:text-lg font-semibold text-center sm:text-left flex-1 sm:flex-none"
                    style={{ color: COLORS.text }}
                  >
                    {currentMonth.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h2>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition flex items-center justify-center shadow-sm"
                    style={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.primary,
                    }}
                    aria-label="Next month"
                  >
                    <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={goToToday}
                  className="px-3 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition w-full sm:w-auto"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  }}
                >
                  Today
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3 sm:mt-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium"
                    style={{ color: COLORS.primary }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-2 sm:p-4">
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {monthMatrix.flat().map((date, idx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="h-24 sm:h-28 md:h-32 rounded-lg sm:rounded-xl bg-transparent"
                      />
                    );
                  }

                  const counts = getAppointmentCounts(date);
                  const isSelected = isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, today);

                  return (
                    <button
                      type="button"
                      key={formatDate(date)}
                      onClick={() => openDayView(date)}
                      className="h-24 sm:h-28 md:h-32 rounded-lg sm:rounded-xl p-2 text-left transition-all relative group"
                      style={{
                        background: COLORS.white,
                        border: isSelected
                          ? `2px solid ${COLORS.primary}`
                          : `1px solid ${COLORS.border}`,
                        boxShadow: isSelected
                          ? `0 0 0 2px ${COLORS.primary}1A inset, 0 6px 12px rgba(0,0,0,0.06)`
                          : '0 1px 2px rgba(0,0,0,0.03)',
                        transform: isSelected ? 'translateY(-1px)' : 'none',
                      }}
                    >
                      {/* Date header */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color: isSelected
                              ? COLORS.primary
                              : isToday
                              ? COLORS.secondary
                              : COLORS.text,
                          }}
                        >
                          {date.getDate()}
                        </span>
                        {isToday && !isSelected ? (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              background: `${COLORS.secondary}1A`,
                              color: COLORS.secondary,
                              border: `1px solid ${COLORS.secondary}33`,
                            }}
                          >
                            Today
                          </span>
                        ) : null}
                      </div>

                      {/* Appointment counts */}
                      <div className="space-y-1">
                        {counts.completed > 0 && (
                          <div className="text-[10px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border flex gap-1 items-center border-emerald-200 font-medium">
                            <FaCheck className="w-2.5 h-2.5" />{' '}
                            {counts.completed} completed
                          </div>
                        )}
                        {counts.cancelled > 0 && (
                          <div className="text-[10px] px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 font-medium">
                            <FaTimes className="w-2.5 h-2.5" />{' '}
                            {counts.cancelled} cancelled
                          </div>
                        )}
                        {counts.noShow > 0 && (
                          <div className="text-[10px] px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium">
                            <FaTimes className="w-2.5 h-2.5" /> {counts.noShow}{' '}
                            no show
                          </div>
                        )}
                        {counts.total === 0 && (
                          <div className="text-[10px] text-gray-400 italic">
                            No appointments
                          </div>
                        )}
                      </div>

                      {/* Hover ring */}
                      {!isSelected ? (
                        <div
                          className="absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition"
                          style={{
                            boxShadow: `0 0 0 2px ${COLORS.secondary}20 inset`,
                          }}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Day Appointments Modal */}
        {showDayModal && selectedDayDate && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowDayModal(false)}
          >
            <div
              className="w-full max-w-6xl rounded-xl shadow-lg overflow-hidden max-h-[95vh] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FaCalendarDay className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedDayDate.toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {selectedDayAppointments.length} total appointments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Filter Dropdown */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all" className="text-gray-900">
                        All Status
                      </option>
                      <option value="completed" className="text-gray-900">
                        Completed
                      </option>
                      <option value="cancelled" className="text-gray-900">
                        Cancelled
                      </option>
                      <option value="noShow" className="text-gray-900">
                        No Show
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowDayModal(false)}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                    >
                      <FaTimes className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  {getAppointmentCounts(selectedDayDate).completed > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                      <FaCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {getAppointmentCounts(selectedDayDate).completed}{' '}
                        Completed
                      </span>
                    </div>
                  )}
                  {getAppointmentCounts(selectedDayDate).cancelled > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
                      <FaTimes className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">
                        {getAppointmentCounts(selectedDayDate).cancelled}{' '}
                        Cancelled
                      </span>
                    </div>
                  )}
                  {getAppointmentCounts(selectedDayDate).noShow > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
                      <FaTimes className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">
                        {getAppointmentCounts(selectedDayDate).noShow} No Show
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-[calc(95vh-220px)] overflow-y-auto">
                {filteredDayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => {
                        const endTime = new Date(
                          `2000-01-01 ${appointment.time}`
                        );
                        endTime.setMinutes(
                          endTime.getMinutes() + appointment.duration
                        );
                        const endTimeStr = endTime.toTimeString().slice(0, 5);

                        return (
                          <div
                            key={appointment.id}
                            className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-5 flex-1">
                                {/* Time Block */}
                                <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <div className="text-lg font-bold text-gray-900">
                                    {appointment.time}
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium">
                                    {appointment.duration}min
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Until {endTimeStr}
                                  </div>
                                </div>

                                {/* Patient Info */}
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                                        {appointment.patient.name}
                                      </h4>
                                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                          <FaUser className="w-3.5 h-3.5" />
                                          {appointment.patient.age}y,{' '}
                                          {appointment.patient.gender}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                          <FaPhone className="w-3.5 h-3.5" />
                                          {appointment.patient.phone}
                                        </span>
                                      </div>
                                    </div>

                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                        appointment.status === 'completed'
                                          ? 'bg-green-100 text-green-700 border border-green-200'
                                          : appointment.status === 'cancelled'
                                          ? 'bg-red-100 text-red-700 border border-red-200'
                                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                      }`}
                                    >
                                      {statusStyles[appointment.status].icon}
                                      {appointment.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        appointment.status.slice(1)}
                                    </span>
                                  </div>

                                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100">
                                    <div className="flex items-center gap-2">
                                      <FaNotesMedical className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm font-medium text-gray-700">
                                        {appointment.patient.reason}
                                      </span>
                                    </div>

                                    {appointment.diagnosis && (
                                      <div className="flex items-start gap-2">
                                        <FaStethoscope className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div>
                                          <span className="text-xs font-medium text-gray-600">
                                            Diagnosis:
                                          </span>
                                          <p className="text-sm text-gray-800">
                                            {appointment.diagnosis}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {appointment.prescription &&
                                      appointment.prescription !== 'None' && (
                                        <div className="flex items-start gap-2">
                                          <FaPrescriptionBottleAlt className="w-4 h-4 text-gray-500 mt-0.5" />
                                          <div>
                                            <span className="text-xs font-medium text-gray-600">
                                              Prescription:
                                            </span>
                                            <p className="text-sm text-gray-800">
                                              {appointment.prescription}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 pt-2">
                                    <button
                                      onClick={() =>
                                        openAppointmentDetails(appointment)
                                      }
                                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                                    >
                                      <FaEye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200 shadow-sm">
                                      <FaPhone className="w-4 h-4" />
                                      Call Patient
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200 shadow-sm">
                                      <FaHistory className="w-4 h-4" />
                                      History
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaCalendarDay className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {filterStatus === 'all'
                        ? 'No appointments found'
                        : `No ${filterStatus} appointments`}
                    </h3>
                    <p className="text-gray-600">
                      {filterStatus === 'all'
                        ? 'There are no appointments scheduled for this day.'
                        : `No appointments with ${filterStatus} status found for this day.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details Modal (Enhanced) */}
        {showAppointmentModal && selectedAppointment && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowAppointmentModal(false)}
          >
            <div
              className="w-full max-w-5xl rounded-xl shadow-lg overflow-hidden max-h-[95vh] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Modal Header */}
              <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <FaStethoscope className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Appointment Details
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {selectedAppointment.date} at {selectedAppointment.time}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                  >
                    <FaTimes className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Enhanced Modal Content */}
              <div className="p-8 max-h-[calc(95vh-140px)] overflow-y-auto space-y-6">
                {/* Patient Information Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-blue-600" />
                    Patient Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Full Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedAppointment.patient.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Contact
                        </label>
                        <p className="text-sm text-gray-800">
                          {selectedAppointment.patient.phone}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Demographics
                        </label>
                        <p className="text-sm text-gray-800">
                          {selectedAppointment.patient.age} years old,{' '}
                          {selectedAppointment.patient.gender}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Visit Reason
                        </label>
                        <p className="text-sm text-gray-800">
                          {selectedAppointment.patient.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="w-5 h-5 text-purple-600" />
                    Appointment Details
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Date
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedAppointment.date}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Time & Duration
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedAppointment.time} (
                        {selectedAppointment.duration} min)
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                          statusStyles[selectedAppointment.status].badge
                        }`}
                      >
                        {statusStyles[selectedAppointment.status].icon}
                        {selectedAppointment.status.charAt(0).toUpperCase() +
                          selectedAppointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical Information Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaStethoscope className="w-5 h-5 text-green-600" />
                    Medical Information
                  </h4>
                  <div className="space-y-4">
                    {selectedAppointment.notes && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                          Clinical Notes
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {selectedAppointment.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAppointment.diagnosis && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                          Diagnosis
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedAppointment.diagnosis}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAppointment.prescription && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                          Prescription
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                          <FaPrescriptionBottleAlt className="w-5 h-5 text-gray-600" />
                          <p className="text-sm text-gray-900">
                            {selectedAppointment.prescription}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAppointment.followUp && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                          Follow-up Date
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                          <FaCalendarAlt className="w-5 h-5 text-gray-600" />
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedAppointment.followUp}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                    <FaPhone className="w-4 h-4" />
                    Call Patient
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300 shadow-sm">
                    <FaEdit className="w-4 h-4" />
                    Edit Record
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300 shadow-sm">
                    <FaHistory className="w-4 h-4" />
                    View History
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300 shadow-sm">
                    <FaDownload className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;
