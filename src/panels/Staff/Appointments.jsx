import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
  FaClock,
  FaCalendarDay,
  FaTimes,
  FaCheck,
  FaSave,
  FaEye,
  FaUsers,
  FaCalendarPlus,
  FaHistory,
  FaArrowLeft,
} from 'react-icons/fa';
import { SiTicktick } from 'react-icons/si';
import DoctorsList from './DoctorsList';

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

// Mock data for doctor's schedule
const todayDate = new Date();
const yyyy = todayDate.getFullYear();
const mm = todayDate.getMonth() + 1;
const todayStr = formatDate(todayDate);

// Doctor's available slots - now includes doctorId
const mockDoctorSlots = [
  {
    id: 1,
    doctorId: 1, // Dr. Sarah Johnson
    date: todayStr,
    time: '09:00',
    duration: 30,
    status: 'available',
    patient: null,
    notes: '',
  },
  {
    id: 2,
    doctorId: 1, // Dr. Sarah Johnson
    date: todayStr,
    time: '09:30',
    duration: 30,
    status: 'booked',
    patient: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      reason: 'Regular checkup',
    },
    notes: 'First-time patient',
  },
  {
    id: 3,
    doctorId: 1, // Dr. Sarah Johnson
    date: todayStr,
    time: '10:00',
    duration: 30,
    status: 'available',
    patient: null,
    notes: '',
  },
  {
    id: 4,
    doctorId: 2, // Dr. Michael Chen
    date: `${yyyy}-${pad(mm)}-05`,
    time: '14:00',
    duration: 60,
    status: 'booked',
    patient: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      reason: 'Follow-up consultation',
    },
    notes: 'Needs lab results review',
  },
  {
    id: 5,
    doctorId: 2, // Dr. Michael Chen
    date: `${yyyy}-${pad(mm)}-05`,
    time: '15:00',
    duration: 30,
    status: 'blocked',
    patient: null,
    notes: 'Personal break',
  },
  {
    id: 6,
    doctorId: 3, // Dr. Emily Rodriguez
    date: `${yyyy}-${pad(mm)}-12`,
    time: '11:30',
    duration: 45,
    status: 'available',
    patient: null,
    notes: '',
  },
  // Additional slots for Dr. Michael Chen
  {
    id: 7,
    doctorId: 2,
    date: todayStr,
    time: '08:00',
    duration: 30,
    status: 'booked',
    patient: {
      name: 'Maria Garcia',
      phone: '+1 (555) 111-2222',
      reason: 'Neurological consultation',
    },
    notes: 'Follow-up appointment',
  },
  {
    id: 8,
    doctorId: 2,
    date: todayStr,
    time: '08:30',
    duration: 30,
    status: 'available',
    patient: null,
    notes: '',
  },
  // Additional slots for Dr. Emily Rodriguez
  {
    id: 9,
    doctorId: 3,
    date: todayStr,
    time: '10:30',
    duration: 45,
    status: 'booked',
    patient: {
      name: 'Tommy Wilson',
      phone: '+1 (555) 333-4444',
      reason: 'Child wellness check',
    },
    notes: 'Annual physical',
  },
  {
    id: 10,
    doctorId: 3,
    date: todayStr,
    time: '11:15',
    duration: 30,
    status: 'available',
    patient: null,
    notes: '',
  },
  // Additional slots for Dr. David Thompson
  {
    id: 11,
    doctorId: 4,
    date: todayStr,
    time: '07:00',
    duration: 60,
    status: 'booked',
    patient: {
      name: 'Robert Davis',
      phone: '+1 (555) 555-6666',
      reason: 'Knee surgery follow-up',
    },
    notes: 'Post-operative check',
  },
  {
    id: 12,
    doctorId: 4,
    date: todayStr,
    time: '08:00',
    duration: 30,
    status: 'available',
    patient: null,
    notes: '',
  },
  // Additional slots for Dr. Lisa Park
  {
    id: 13,
    doctorId: 5,
    date: todayStr,
    time: '09:00',
    duration: 45,
    status: 'booked',
    patient: {
      name: 'Jennifer Lee',
      phone: '+1 (555) 777-8888',
      reason: 'Skin condition evaluation',
    },
    notes: 'Rash examination',
  },
  {
    id: 14,
    doctorId: 5,
    date: todayStr,
    time: '09:45',
    duration: 30,
    status: 'available',
    patient: null,
    notes: '',
  },
  // Additional slots for Dr. Robert Wilson
  {
    id: 15,
    doctorId: 6,
    date: todayStr,
    time: '10:00',
    duration: 60,
    status: 'booked',
    patient: {
      name: 'Michael Brown',
      phone: '+1 (555) 999-0000',
      reason: 'Therapy session',
    },
    notes: 'Weekly counseling',
  },
  {
    id: 16,
    doctorId: 6,
    date: todayStr,
    time: '11:00',
    duration: 45,
    status: 'available',
    patient: null,
    notes: '',
  },
  // Future appointments for various doctors
  {
    id: 17,
    doctorId: 1,
    date: `${yyyy}-${pad(mm)}-15`,
    time: '14:00',
    duration: 30,
    status: 'booked',
    patient: {
      name: 'Alice Johnson',
      phone: '+1 (555) 111-3333',
      reason: 'Cardiac consultation',
    },
    notes: 'Follow-up after stress test',
  },
  {
    id: 18,
    doctorId: 2,
    date: `${yyyy}-${pad(mm)}-18`,
    time: '16:00',
    duration: 45,
    status: 'available',
    patient: null,
    notes: '',
  },
  {
    id: 19,
    doctorId: 3,
    date: `${yyyy}-${pad(mm)}-20`,
    time: '13:30',
    duration: 30,
    status: 'booked',
    patient: {
      name: 'Emma Rodriguez',
      phone: '+1 (555) 222-4444',
      reason: 'Vaccination',
    },
    notes: 'Annual flu shot',
  },
];

const statusStyles = {
  available: {
    bg: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
    color: '#0369a1',
    border: '1px solid #7dd3fc',
    icon: <SiTicktick />,
  },
  booked: {
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    color: '#047857',
    border: '1px solid #a7f3d0',
    icon: '👨🏻‍💼',
  },
  blocked: {
    bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    color: '#dc2626',
    border: '1px solid #fecaca',
    icon: '🚫',
  },
};

const Appointments = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(todayDate);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [slots, setSlots] = useState(mockDoctorSlots);

  // Modals
  const [showDayModal, setShowDayModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showSingleDayBulkModal, setShowSingleDayBulkModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Slot creation/editing form
  const [slotForm, setSlotForm] = useState({
    date: '',
    time: '09:00',
    duration: 30,
    notes: '',
    recurring: false,
    recurringDays: [],
    recurringEndDate: '',
  });

  // Bulk slot creation
  const [bulkForm, setBulkForm] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    breakDuration: 0,
    selectedDays: [1, 2, 3, 4, 5], // Mon-Fri
    excludeDates: [],
  });

  // Single day bulk add form
  const [singleDayBulkForm, setSingleDayBulkForm] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    breakDuration: 0,
  });

  const monthMatrix = useMemo(
    () => getMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const getSlotsForDay = (date) => {
    if (!date || !selectedDoctor) return [];
    return slots.filter(
      (slot) =>
        slot.date === formatDate(date) && slot.doctorId === selectedDoctor.id
    );
  };

  const getSlotCounts = (date) => {
    const daySlots = getSlotsForDay(date);
    return {
      total: daySlots.length,
      available: daySlots.filter((s) => s.status === 'available').length,
      booked: daySlots.filter((s) => s.status === 'booked').length,
      blocked: daySlots.filter((s) => s.status === 'blocked').length,
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

  const openDayModal = (date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const openSlotModal = (date, slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setSlotForm({
        date: slot.date,
        time: slot.time,
        duration: slot.duration,
        notes: slot.notes,
        recurring: false,
        recurringDays: [],
        recurringEndDate: '',
      });
    } else {
      setEditingSlot(null);
      setSlotForm({
        date: formatDate(date),
        time: '09:00',
        duration: 30,
        notes: '',
        recurring: false,
        recurringDays: [],
        recurringEndDate: '',
      });
    }
    setShowSlotModal(true);
  };

  const openBulkAddForDay = (date) => {
    setSingleDayBulkForm({
      date: formatDate(date),
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      breakDuration: 0,
    });
    setShowSingleDayBulkModal(true);
  };

  const handleSlotSubmit = (e) => {
    e.preventDefault();

    if (editingSlot) {
      // Update existing slot
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === editingSlot.id
            ? {
                ...slot,
                ...slotForm,
                status: slot.status,
                doctorId: selectedDoctor.id,
              }
            : slot
        )
      );
    } else {
      // Create new slot
      const newSlot = {
        id: Date.now(),
        doctorId: selectedDoctor.id,
        ...slotForm,
        status: 'available',
        patient: null,
      };
      setSlots((prev) => [...prev, newSlot]);
    }

    setShowSlotModal(false);
    setEditingSlot(null);
  };

  const deleteSlot = (slotId) => {
    const slot = slots.find((s) => s.id === slotId);
    const slotTime = slot ? `${slot.time} (${slot.duration}min)` : '';

    if (
      window.confirm(
        `Are you sure you want to delete the slot at ${slotTime}?\n\nThis action cannot be undone.`
      )
    ) {
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    }
  };

  const blockSlot = (slotId) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, status: 'blocked', patient: null }
          : slot
      )
    );
  };

  const unblockSlot = (slotId) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, status: 'available' } : slot
      )
    );
  };

  const generateTimeSlots = (
    startTime,
    endTime,
    duration,
    breakDuration = 0
  ) => {
    const slots = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);

    let current = new Date(start);
    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5);
      slots.push(timeStr);
      current.setMinutes(current.getMinutes() + duration + breakDuration);
    }

    return slots;
  };

  const handleBulkAdd = (e) => {
    e.preventDefault();

    const {
      startDate,
      endDate,
      startTime,
      endTime,
      slotDuration,
      breakDuration,
      selectedDays,
    } = bulkForm;
    const timeSlots = generateTimeSlots(
      startTime,
      endTime,
      slotDuration,
      breakDuration
    );

    const start = new Date(startDate);
    const end = new Date(endDate);
    const newSlots = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay(); // Convert Sunday from 0 to 7

      if (selectedDays.includes(dayOfWeek)) {
        timeSlots.forEach((time) => {
          newSlots.push({
            id: Date.now() + Math.random(),
            doctorId: selectedDoctor.id,
            date: formatDate(d),
            time: time,
            duration: slotDuration,
            status: 'available',
            patient: null,
            notes: '',
          });
        });
      }
    }

    setSlots((prev) => [...prev, ...newSlots]);
    setShowBulkAddModal(false);
  };

  const handleSingleDayBulkAdd = (e) => {
    e.preventDefault();

    const { date, startTime, endTime, slotDuration, breakDuration } =
      singleDayBulkForm;
    const timeSlots = generateTimeSlots(
      startTime,
      endTime,
      slotDuration,
      breakDuration
    );

    const newSlots = timeSlots.map((time) => ({
      id: Date.now() + Math.random(),
      doctorId: selectedDoctor.id,
      date: date,
      time: time,
      duration: slotDuration,
      status: 'available',
      patient: null,
      notes: '',
    }));

    setSlots((prev) => [...prev, ...newSlots]);
    setShowSingleDayBulkModal(false);
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBackToDoctors = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen">
      {!selectedDoctor ? (
        <DoctorsList onDoctorSelect={handleDoctorSelect} />
      ) : (
        <div className="sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={handleBackToDoctors}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back to Doctors
                </button>
              </div>
              <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
                {selectedDoctor.name}'s Schedule
              </h1>
              <p
                className="text-sm sm:text-base"
                style={{ color: COLORS.textMuted }}
              >
                Manage {selectedDoctor.name}'s availability and appointments
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* Status indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-sky-700 bg-sky-50 ring-1 ring-sky-200">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  <span className="hidden sm:inline">Available</span>
                </span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="hidden sm:inline">Booked</span>
                </span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-rose-700 bg-rose-50 ring-1 ring-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span className="hidden sm:inline">Blocked</span>
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowBulkAddModal(true)}
                  className="flex-1 sm:flex-none inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.success}, #059669)`,
                  }}
                >
                  <FaCalendarPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Bulk Add</span>
                  <span className="sm:hidden">Bulk</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/staff/appointment-history')}
                  className="flex-1 sm:flex-none inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  }}
                >
                  <FaHistory className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    selectedDoctor.image ||
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
                  }
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {selectedDoctor.specialization}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedDoctor.experience} experience •{' '}
                    {selectedDoctor.rating} ★
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Contact</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedDoctor.phone}
                </p>
                <p className="text-sm text-gray-600">{selectedDoctor.email}</p>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
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
                    })}{' '}
                    - {selectedDoctor.name}
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
                  Today - {selectedDoctor.name}
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

                  const counts = getSlotCounts(date);
                  const isSelected = isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, todayDate);

                  return (
                    <button
                      type="button"
                      key={formatDate(date)}
                      onClick={() => openDayModal(date)}
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

                      {/* Slot counts */}
                      <div className="space-y-1">
                        {counts.available > 0 && (
                          <div className="text-[10px] px-2 py-1 rounded-md bg-sky-50 text-sky-700 border flex gap-1 items-center border-sky-200 font-medium">
                            <SiTicktick className="text-green-500" />{' '}
                            {counts.available} available
                          </div>
                        )}
                        {counts.booked > 0 && (
                          <div className="text-[10px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            👨🏻‍💼 {counts.booked} booked
                          </div>
                        )}
                        {counts.blocked > 0 && (
                          <div className="text-[10px] px-2 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                            🚫 {counts.blocked} blocked
                          </div>
                        )}
                        {counts.total === 0 && (
                          <div className="text-[10px] text-gray-400 italic">
                            No slots
                          </div>
                        )}
                      </div>

                      {/* Quick action buttons */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openSlotModal(date);
                          }}
                          className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center shadow-sm hover:bg-blue-600 transition"
                          title="Add single slot"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBulkAddForDay(date);
                          }}
                          className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center shadow-sm hover:bg-green-600 transition"
                          title="Bulk add slots for this day"
                        >
                          <FaCalendarPlus className="w-3 h-3" />
                        </button>
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

          {/* Day Details Modal */}
          {showDayModal && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
              style={{
                background: 'rgba(15, 23, 42, 0.35)',
                backdropFilter: 'saturate(140%) blur(6px)',
              }}
              onClick={() => setShowDayModal(false)}
            >
              <div
                className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between"
                  style={{
                    background: COLORS.white,
                    borderColor: COLORS.border,
                  }}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      - {selectedDoctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage {selectedDoctor.name}'s slots for this day
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openSlotModal(selectedDate)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm transition"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    >
                      <FaPlus className="w-3 h-3" />
                      Add Slot for {selectedDoctor.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => openBulkAddForDay(selectedDate)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm transition"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.success}, #059669)`,
                      }}
                    >
                      <FaCalendarPlus className="w-3 h-3" />
                      Bulk Add for {selectedDoctor.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDayModal(false)}
                      className="w-8 h-8 rounded-lg transition flex items-center justify-center"
                      style={{
                        background: COLORS.white,
                        color: COLORS.textMuted,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slots List - Updated Design */}
                <div className="p-4 sm:p-6">
                  {getSlotsForDay(selectedDate).length > 0 ? (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {getSlotsForDay(selectedDate).length} slots scheduled
                          for {selectedDoctor.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getSlotCounts(selectedDate).available > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {getSlotCounts(selectedDate).available} available
                            </span>
                          )}
                          {getSlotCounts(selectedDate).booked > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {getSlotCounts(selectedDate).booked} booked
                            </span>
                          )}
                          {getSlotCounts(selectedDate).blocked > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                              {getSlotCounts(selectedDate).blocked} blocked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Slot Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {getSlotsForDay(selectedDate)
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((slot) => {
                            const endTime = new Date(`2000-01-01 ${slot.time}`);
                            endTime.setMinutes(
                              endTime.getMinutes() + slot.duration
                            );
                            const endTimeStr = endTime
                              .toTimeString()
                              .slice(0, 5);

                            // Define slot styles based on status
                            const slotStyles = {
                              available: {
                                bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                border: '#7dd3fc',
                                color: '#0369a1',
                                headerBg: '#0118D8',
                                headerColor: 'white',
                                icon: <SiTicktick />,
                              },
                              booked: {
                                bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                                border: '#a7f3d0',
                                color: '#047857',
                                headerBg: '#10b981',
                                headerColor: 'white',
                                icon: '👨🏻‍💼',
                              },
                              blocked: {
                                bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                border: '#fecaca',
                                color: '#dc2626',
                                headerBg: '#ef4444',
                                headerColor: 'white',
                                icon: '🚫',
                              },
                            };

                            const style = slotStyles[slot.status];

                            return (
                              <div
                                key={slot.id}
                                className="relative rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200 group h-48"
                                style={{
                                  background: style.bg,
                                  borderColor: style.border,
                                }}
                              >
                                {/* Header with time range */}
                                <div
                                  className="px-3 py-2 text-center"
                                  style={{
                                    background: style.headerBg,
                                    color: style.headerColor,
                                  }}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-bold">
                                      {slot.time} - {endTimeStr}
                                    </span>
                                    <span className="text-xs opacity-90">
                                      ({slot.duration}m)
                                    </span>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-3 flex flex-col h-full">
                                  {/* Status indicator */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg text-green-500">
                                        {style.icon}
                                      </span>
                                      <span
                                        className="text-xs font-semibold uppercase tracking-wide"
                                        style={{ color: style.color }}
                                      >
                                        {slot.status}
                                      </span>
                                    </div>

                                    {/* Action buttons - show on hover */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openSlotModal(selectedDate, slot)
                                        }
                                        className="w-6 h-6 rounded-md transition flex items-center justify-center text-gray-600 hover:bg-white/80 hover:rounded-md"
                                        title="Edit slot"
                                      >
                                        <FaEdit className="w-3 h-3" />
                                      </button>

                                      {slot.status === 'available' && (
                                        <button
                                          type="button"
                                          onClick={() => blockSlot(slot.id)}
                                          className="w-6 h-6 rounded-md transition flex items-center justify-center text-orange-600 hover:bg-white/80 hover:rounded-md"
                                          title="Block slot"
                                        >
                                          🚫
                                        </button>
                                      )}

                                      {slot.status === 'blocked' && (
                                        <button
                                          type="button"
                                          onClick={() => unblockSlot(slot.id)}
                                          className="w-6 h-6 rounded-md hover:rounded-md transition flex items-center justify-center text-green-600 hover:bg-white/80"
                                          title="Unblock slot"
                                        >
                                          <FaCheck className="w-3 h-3" />
                                        </button>
                                      )}

                                      {slot.status !== 'booked' && (
                                        <button
                                          type="button"
                                          onClick={() => deleteSlot(slot.id)}
                                          className="w-6 h-6 rounded-md transition flex items-center justify-center text-red-600 hover:bg-white/80 hover:rounded-md"
                                          title="Delete slot"
                                        >
                                          <FaTrash className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Patient info for booked slots */}
                                  {slot.patient && (
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 mb-2 flex-shrink-0">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {slot.patient.name}
                                      </p>
                                      <p className="text-xs text-gray-600 truncate">
                                        {slot.patient.phone}
                                      </p>
                                      <p className="text-xs text-gray-700 mt-1 truncate">
                                        {slot.patient.reason}
                                      </p>
                                    </div>
                                  )}

                                  {/* Notes */}
                                  {slot.notes && (
                                    <div className="bg-white/40 backdrop-blur-sm rounded-md p-2 flex-shrink-0">
                                      <p className="text-xs text-gray-700">
                                        <span className="font-medium">
                                          Note:
                                        </span>{' '}
                                        {slot.notes}
                                      </p>
                                    </div>
                                  )}

                                  {/* Empty state for available slots */}
                                  {slot.status === 'available' &&
                                    !slot.notes && (
                                      <div className="text-center py-2 flex-grow flex items-center justify-center">
                                        <p className="text-xs text-gray-500 italic">
                                          Available for booking
                                        </p>
                                      </div>
                                    )}

                                  {/* Blocked slot message */}
                                  {slot.status === 'blocked' && !slot.notes && (
                                    <div className="text-center py-2 flex-grow flex items-center justify-center">
                                      <p
                                        className="text-xs font-medium"
                                        style={{ color: style.color }}
                                      >
                                        Time blocked
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Quick action overlay for available slots */}
                                {slot.status === 'available' && (
                                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          openSlotModal(selectedDate, slot)
                                        }
                                        className="px-3 py-1 bg-white text-blue-600 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => blockSlot(slot.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-medium shadow-sm hover:bg-red-600 transition"
                                      >
                                        Block
                                      </button>
                                      <button
                                        onClick={() => deleteSlot(slot.id)}
                                        className="px-3 py-1 bg-gray-500 text-white rounded-md text-xs font-medium shadow-sm hover:bg-gray-600 transition"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ) : (
                    // Empty state remains the same
                    <div className="text-center py-8">
                      <FaCalendarDay className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        No slots scheduled for this day
                      </p>
                      <button
                        type="button"
                        onClick={() => openSlotModal(selectedDate)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                        }}
                      >
                        <FaPlus className="w-3 h-3" />
                        Add {selectedDoctor.name}'s First Slot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Slot Modal */}
          {showSlotModal && (
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4"
              style={{
                background: 'rgba(15, 23, 42, 0.35)',
                backdropFilter: 'saturate(140%) blur(6px)',
              }}
              onClick={() => setShowSlotModal(false)}
            >
              <div
                className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{
                    background: COLORS.white,
                    borderColor: COLORS.border,
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingSlot
                      ? `Edit ${selectedDoctor.name}'s Slot`
                      : `Add New Slot for ${selectedDoctor.name}`}
                  </h3>
                </div>

                <form onSubmit={handleSlotSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={slotForm.date}
                        onChange={(e) =>
                          setSlotForm((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={slotForm.time}
                        onChange={(e) =>
                          setSlotForm((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      value={slotForm.duration}
                      onChange={(e) =>
                        setSlotForm((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any special notes for this slot..."
                      value={slotForm.notes}
                      onChange={(e) =>
                        setSlotForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg font-medium text-white shadow-sm transition"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    >
                      <FaSave className="w-4 h-4 inline mr-2" />
                      {editingSlot
                        ? `Update ${selectedDoctor.name}'s Slot`
                        : `Create Slot for ${selectedDoctor.name}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSlotModal(false)}
                      className="flex-1 py-2.5 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bulk Add Modal */}
          {showBulkAddModal && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4"
              style={{
                background: 'rgba(15, 23, 42, 0.35)',
                backdropFilter: 'saturate(140%) blur(6px)',
              }}
              onClick={() => setShowBulkAddModal(false)}
            >
              <div
                className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{
                    background: COLORS.white,
                    borderColor: COLORS.border,
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bulk Add Availability for {selectedDoctor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quickly create multiple slots across date ranges for{' '}
                    {selectedDoctor.name}
                  </p>
                </div>

                <form onSubmit={handleBulkAdd} className="p-6 space-y-6">
                  {/* Date Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Date Range
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          value={bulkForm.startDate}
                          onChange={(e) =>
                            setBulkForm((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          required
                          value={bulkForm.endDate}
                          onChange={(e) =>
                            setBulkForm((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Working Hours
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          required
                          value={bulkForm.startTime}
                          onChange={(e) =>
                            setBulkForm((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          required
                          value={bulkForm.endTime}
                          onChange={(e) =>
                            setBulkForm((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Slot Configuration */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Slot Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slot Duration
                        </label>
                        <select
                          value={bulkForm.slotDuration}
                          onChange={(e) =>
                            setBulkForm((prev) => ({
                              ...prev,
                              slotDuration: parseInt(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>1 hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Break Between Slots
                        </label>
                        <select
                          value={bulkForm.breakDuration}
                          onChange={(e) =>
                            setBulkForm((prev) => ({
                              ...prev,
                              breakDuration: parseInt(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={0}>No break</option>
                          <option value={5}>5 minutes</option>
                          <option value={10}>10 minutes</option>
                          <option value={15}>15 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Days of Week */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Working Days
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 1, name: 'Mon' },
                        { id: 2, name: 'Tue' },
                        { id: 3, name: 'Wed' },
                        { id: 4, name: 'Thu' },
                        { id: 5, name: 'Fri' },
                        { id: 6, name: 'Sat' },
                        { id: 7, name: 'Sun' },
                      ].map((day) => (
                        <label key={day.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={bulkForm.selectedDays.includes(day.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkForm((prev) => ({
                                  ...prev,
                                  selectedDays: [...prev.selectedDays, day.id],
                                }));
                              } else {
                                setBulkForm((prev) => ({
                                  ...prev,
                                  selectedDays: prev.selectedDays.filter(
                                    (d) => d !== day.id
                                  ),
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {day.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={bulkForm.selectedDays.length === 0}
                      className="flex-1 py-2.5 rounded-lg font-medium text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.success}, #059669)`,
                      }}
                    >
                      <FaCalendarPlus className="w-4 h-4 inline mr-2" />
                      Create Slots for {selectedDoctor.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulkAddModal(false)}
                      className="flex-1 py-2.5 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Single Day Bulk Add Modal */}
          {showSingleDayBulkModal && (
            <div
              className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4"
              style={{
                background: 'rgba(15, 23, 42, 0.35)',
                backdropFilter: 'saturate(140%) blur(6px)',
              }}
              onClick={() => setShowSingleDayBulkModal(false)}
            >
              <div
                className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{
                    background: COLORS.white,
                    borderColor: COLORS.border,
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bulk Add Slots for {selectedDoctor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create multiple slots for {selectedDoctor.name} on{' '}
                    {new Date(singleDayBulkForm.date).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>

                <form
                  onSubmit={handleSingleDayBulkAdd}
                  className="p-6 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={singleDayBulkForm.date}
                      onChange={(e) =>
                        setSingleDayBulkForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        required
                        value={singleDayBulkForm.startTime}
                        onChange={(e) =>
                          setSingleDayBulkForm((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        required
                        value={singleDayBulkForm.endTime}
                        onChange={(e) =>
                          setSingleDayBulkForm((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slot Duration
                      </label>
                      <select
                        value={singleDayBulkForm.slotDuration}
                        onChange={(e) =>
                          setSingleDayBulkForm((prev) => ({
                            ...prev,
                            slotDuration: parseInt(e.target.value),
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Break Between Slots
                      </label>
                      <select
                        value={singleDayBulkForm.breakDuration}
                        onChange={(e) =>
                          setSingleDayBulkForm((prev) => ({
                            ...prev,
                            breakDuration: parseInt(e.target.value),
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={0}>No break</option>
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                      </select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Preview
                    </h4>
                    <div className="text-xs text-gray-600">
                      {(() => {
                        const timeSlots = generateTimeSlots(
                          singleDayBulkForm.startTime,
                          singleDayBulkForm.endTime,
                          singleDayBulkForm.slotDuration,
                          singleDayBulkForm.breakDuration
                        );
                        return (
                          <div>
                            <p className="mb-1">
                              <strong>{timeSlots.length} slots</strong> will be
                              created:
                            </p>
                            <div className="grid grid-cols-3 gap-1 text-xs">
                              {timeSlots.slice(0, 6).map((time, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white px-2 py-1 rounded border"
                                >
                                  {time}
                                </div>
                              ))}
                              {timeSlots.length > 6 && (
                                <div className="bg-white px-2 py-1 rounded border text-center">
                                  +{timeSlots.length - 6} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg font-medium text-white shadow-sm transition"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.success}, #059669)`,
                      }}
                    >
                      <FaCalendarPlus className="w-4 h-4 inline mr-2" />
                      Create Slots
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSingleDayBulkModal(false)}
                      className="flex-1 py-2.5 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;
