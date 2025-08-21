import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUserMd,
  FaChevronLeft,
  FaChevronRight,
  FaHistory,
  FaMapMarkerAlt,
  FaCalendarDay,
  FaClock,
  FaTimes,
  FaUser,
  FaPhone,
} from 'react-icons/fa';

// Theme colors (matching Patient Appointments UI)
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
};

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
  const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1; // Mon-Sun
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

function loadCashfreeSdk(mode = 'sandbox') {
  return new Promise((resolve, reject) => {
    if (
      typeof window !== 'undefined' &&
      (window.Cashfree || (window.Cashfree && window.Cashfree.Cashfree))
    ) {
      resolve();
      return;
    }
    if (document.getElementById('cashfree-sdk')) {
      const checkInterval = setInterval(() => {
        if (window.Cashfree) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.Cashfree) resolve();
        else reject(new Error('Cashfree SDK not ready'));
      }, 3000);
      return;
    }
    const script = document.createElement('script');
    script.id = 'cashfree-sdk';
    script.src =
      mode === 'production'
        ? 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js'
        : 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.body.appendChild(script);
  });
}

async function createCashfreeOrderToken(booking) {
  try {
    const res = await fetch('/api/payments/cashfree/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 500,
        currency: 'INR',
        customer: {
          phone: '9999999999',
          email: 'patient@example.com',
          name: 'Patient',
        },
        notes: {
          doctor: booking?.doctor,
          specialty: booking?.specialty,
          date: booking?.date,
          time: booking?.time,
        },
      }),
    });
    if (!res.ok) throw new Error('Failed to create order');
    const data = await res.json();
    return data?.orderToken || data?.order_token || data?.token || null;
  } catch (err) {
    return null;
  }
}

const todayDate = new Date();
const yyyy = todayDate.getFullYear();
const mm = todayDate.getMonth() + 1;
const todayStr = formatDate(todayDate);

const mockAppointments = [
  {
    date: todayStr,
    time: '10:00',
    doctor: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    status: 'confirmed',
    location: 'Room 201',
  },
  {
    date: `${yyyy}-${pad(mm)}-05`,
    time: '09:00',
    doctor: 'Dr. Michael Johnson',
    specialty: 'General Practice',
    status: 'confirmed',
    location: 'Room 105',
  },
  {
    date: `${yyyy}-${pad(mm)}-12`,
    time: '11:30',
    doctor: 'Dr. Emily Davis',
    specialty: 'Dermatology',
    status: 'confirmed',
    location: 'Room 301',
  },
  {
    date: `${yyyy}-${pad(mm)}-15`,
    time: '14:00',
    doctor: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    status: 'cancelled',
    location: 'Room 205',
  },
  {
    date: `${yyyy}-${pad(mm)}-20`,
    time: '16:00',
    doctor: 'Dr. Lisa Brown',
    specialty: 'Pediatrics',
    status: 'confirmed',
    location: 'Room 150',
  },
  {
    date: `${yyyy}-${pad(mm)}-08`,
    time: '10:00',
    doctor: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    status: 'waitlist',
    location: 'Room 201',
    waitlistPosition: 1,
  },
  {
    date: `${yyyy}-${pad(mm)}-10`,
    time: '14:00',
    doctor: 'Dr. Michael Johnson',
    specialty: 'General Practice',
    status: 'waitlist',
    location: 'Room 105',
    waitlistPosition: 2,
  },
];

const mockAvailability = [
  {
    date: todayStr,
    slots: [
      { time: '09:00', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology' },
      {
        time: '14:00',
        doctor: 'Dr. Michael Johnson',
        specialty: 'General Practice',
      },
    ],
  },
  {
    date: `${yyyy}-${pad(mm)}-05`,
    slots: [
      { time: '10:00', doctor: 'Dr. Emily Davis', specialty: 'Dermatology' },
      { time: '15:00', doctor: 'Dr. James Wilson', specialty: 'Orthopedics' },
    ],
  },
  {
    date: `${yyyy}-${pad(mm)}-12`,
    slots: [
      { time: '11:30', doctor: 'Dr. Lisa Brown', specialty: 'Pediatrics' },
    ],
  },
  {
    date: `${yyyy}-${pad(mm)}-15`,
    slots: [
      { time: '09:00', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology' },
      {
        time: '13:00',
        doctor: 'Dr. Michael Johnson',
        specialty: 'General Practice',
      },
    ],
  },
  {
    date: `${yyyy}-${pad(mm)}-20`,
    slots: [
      { time: '11:00', doctor: 'Dr. Emily Davis', specialty: 'Dermatology' },
    ],
  },
  { date: `${yyyy}-${pad(mm)}-08`, slots: [] },
  { date: `${yyyy}-${pad(mm)}-10`, slots: [] },
];

const statusChip = (status) => {
  if (status === 'confirmed')
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
  if (status === 'waitlist')
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
};

const DoctorPatientBooking = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const patient = location.state?.patient;

  const [currentMonth, setCurrentMonth] = useState(todayDate);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    date: '',
    time: '',
    doctor: '',
    specialty: '',
  });
  const [showDayModal, setShowDayModal] = useState(false);
  const [showWaitlistBooking, setShowWaitlistBooking] = useState(false);
  const [waitlistBookingInfo, setWaitlistBookingInfo] = useState({
    date: '',
    doctor: '',
    specialty: '',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isPaymentInitializing, setIsPaymentInitializing] = useState(false);
  const [paymentInitError, setPaymentInitError] = useState('');
  const [orderToken, setOrderToken] = useState('');

  const monthMatrix = useMemo(
    () => getMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );
  const appointmentsForSelected = useMemo(
    () => mockAppointments.filter((a) => a.date === formatDate(selectedDate)),
    [selectedDate]
  );
  const availabilityForSelected = useMemo(
    () =>
      mockAvailability.find((a) => a.date === formatDate(selectedDate))
        ?.slots || [],
    [selectedDate]
  );

  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    return mockAppointments.filter((a) => a.date === formatDate(date));
  };
  const getAvailabilityForDay = (date) => {
    if (!date) return [];
    return (
      mockAvailability.find((a) => a.date === formatDate(date))?.slots || []
    );
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

  const handleBook = (date, slot) => {
    setBookingInfo({
      date,
      time: slot.time,
      doctor: slot.doctor,
      specialty: slot.specialty,
    });
    setShowBooking(true);
  };
  const handleBookingSubmit = (e) => {
    if (e) e.preventDefault();
    setShowBooking(false);
    setShowPayment(true);
  };
  const handleWaitlistBook = (date, doctor, specialty) => {
    setWaitlistBookingInfo({ date, doctor, specialty });
    setShowWaitlistBooking(true);
  };
  const handleWaitlistSubmit = (e) => {
    if (e) e.preventDefault();
    if (patient) {
      alert(
        `Waitlist appointment requested for ${patient.name} (${patient.id}) with ${waitlistBookingInfo.doctor} (${waitlistBookingInfo.specialty}) on ${waitlistBookingInfo.date}. You will be notified when a slot becomes available.`
      );
    } else {
      alert(
        `Waitlist appointment requested with ${waitlistBookingInfo.doctor} (${waitlistBookingInfo.specialty}) on ${waitlistBookingInfo.date}. You will be notified when a slot becomes available.`
      );
    }
    setShowWaitlistBooking(false);
  };
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const openDayModal = (date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  useEffect(() => {
    let isMounted = true;
    let cleanup = () => {};
    async function initPayment() {
      if (!showPayment) return;
      setPaymentInitError('');
      setIsPaymentInitializing(true);
      try {
        await loadCashfreeSdk('sandbox');
        if (!isMounted) return;
        const token = await createCashfreeOrderToken(bookingInfo);
        if (!token) {
          setPaymentInitError(
            'Unable to initialize payment. Configure backend to create order token.'
          );
          setIsPaymentInitializing(false);
          return;
        }
        setOrderToken(token);
        const container = document.getElementById('cf-dropin');
        if (!container) {
          setPaymentInitError('Payment container not found');
          setIsPaymentInitializing(false);
          return;
        }
        const cfFactory =
          typeof window.Cashfree === 'function' ? window.Cashfree : null;
        const cfClass =
          window.Cashfree && window.Cashfree.Cashfree
            ? window.Cashfree.Cashfree
            : null;
        const cashfree = cfFactory
          ? cfFactory({ mode: 'sandbox' })
          : cfClass
          ? new cfClass({ mode: 'sandbox' })
          : null;
        if (!cashfree || typeof cashfree.initialiseDropin !== 'function') {
          setPaymentInitError(
            'Cashfree SDK initialisation function not available'
          );
          setIsPaymentInitializing(false);
          return;
        }
        cashfree.initialiseDropin(container, {
          orderToken: token,
          onSuccess: () => {
            setShowPayment(false);
            alert('Payment successful');
          },
          onFailure: () => {
            setPaymentInitError('Payment failed. Please try again.');
          },
          components: ['order-details', 'card', 'upi', 'netbanking', 'app'],
          theme: { color: COLORS.primary },
        });
        cleanup = () => {
          container.innerHTML = '';
        };
      } catch (err) {
        setPaymentInitError(err?.message || 'Payment initialisation failed');
      } finally {
        setIsPaymentInitializing(false);
      }
    }
    initPayment();
    return () => {
      isMounted = false;
      cleanup();
    };
  }, [showPayment]);

  return (
    <div className="min-h-screen">
      <div className="sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
          <div className="space-y-1">
            <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
              Book Appointment for {patient ? patient.name : 'Patient'}
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: COLORS.textMuted }}
            >
              Schedule appointments on behalf of{' '}
              {patient ? patient.name : 'the patient'}
            </p>
            {patient && (
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUser className="w-4 h-4" />
                  <span>ID: {patient.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="w-4 h-4" />
                  <span>{patient.phone}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('/doctor/patients')}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition w-full sm:w-auto justify-center"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              }}
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Patients</span>
            </button>
          </div>
        </div>

        {/* Calendar Card (exact look as Patient Appointments) */}
        <div
          className="rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
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

          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {monthMatrix.flat().map((date, idx) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="h-20 sm:h-24 md:h-28 rounded-lg sm:rounded-xl bg-transparent"
                    />
                  );
                }
                const appointments = getAppointmentsForDay(date);
                const availability = getAvailabilityForDay(date);
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, todayDate);

                return (
                  <button
                    type="button"
                    key={formatDate(date)}
                    onClick={() => openDayModal(date)}
                    className="h-20 sm:h-24 md:h-28 rounded-lg sm:rounded-xl p-1 sm:p-2 text-left transition-all relative group"
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
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs sm:text-sm font-semibold"
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
                          className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded"
                          style={{
                            background: `${COLORS.secondary}1A`,
                            color: COLORS.secondary,
                            border: `1px solid ${COLORS.secondary}33`,
                          }}
                        >
                          <span className="hidden sm:inline">Today</span>
                          <span className="sm:hidden">T</span>
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 sm:mt-2 space-y-1 sm:space-y-1.5 flex flex-col">
                      {appointments.slice(0, 2).map((appt, i) => (
                        <div
                          key={`${formatDate(date)}-appt-${i}`}
                          className="text-[10px] sm:text-[11px] inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md self-start"
                          style={{
                            background:
                              appt.status === 'confirmed'
                                ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
                                : appt.status === 'waitlist'
                                ? 'linear-gradient(135deg, #fffbeb, #fef3c7)'
                                : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                            color:
                              appt.status === 'confirmed'
                                ? '#047857'
                                : appt.status === 'waitlist'
                                ? '#d97706'
                                : '#dc2626',
                            border:
                              appt.status === 'confirmed'
                                ? '1px solid #a7f3d0'
                                : appt.status === 'waitlist'
                                ? '1px solid #fde68a'
                                : '1px solid #fecaca',
                            boxShadow:
                              appt.status === 'confirmed'
                                ? '0 2px 4px rgba(5, 122, 85, 0.1)'
                                : appt.status === 'waitlist'
                                ? '0 2px 4px rgba(217, 119, 6, 0.1)'
                                : '0 2px 4px rgba(220, 38, 38, 0.1)',
                          }}
                          title={`${appt.doctor} • ${appt.specialty} • ${
                            appt.time
                          }${
                            appt.status === 'waitlist'
                              ? ` • Waitlist #${appt.waitlistPosition}`
                              : ''
                          }`}
                        >
                          <span
                            className="flex items-center justify-center w-2 h-2 sm:w-3 sm:h-3 rounded-full text-[6px] sm:text-[8px] font-bold"
                            style={{
                              background:
                                appt.status === 'confirmed'
                                  ? '#10b981'
                                  : appt.status === 'waitlist'
                                  ? '#f59e0b'
                                  : '#ef4444',
                              color: 'white',
                            }}
                          >
                            {appt.status === 'confirmed'
                              ? '✓'
                              : appt.status === 'waitlist'
                              ? '⏳'
                              : '✗'}
                          </span>
                          <span className="font-semibold hidden sm:inline">
                            {appt.time}
                          </span>
                          <span className="font-semibold sm:hidden">
                            {appt.time.split(':')[0]}
                          </span>
                        </div>
                      ))}
                      {appointments.length > 2 ? (
                        <div
                          className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-medium self-start"
                          style={{
                            background: `${COLORS.primary}0A`,
                            color: COLORS.primary,
                            border: `1px solid ${COLORS.primary}20`,
                          }}
                        >
                          +{appointments.length - 2}
                        </div>
                      ) : null}

                      {availability.length > 0 ? (
                        <div
                          className="text-[10px] sm:text-[11px] inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer self-start"
                          style={{
                            background:
                              'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                            color: '#0369a1',
                            border: '1px solid #7dd3fc',
                            boxShadow: '0 2px 4px rgba(3, 105, 161, 0.1)',
                          }}
                          title={availability
                            .map(
                              (s) => `${s.doctor} • ${s.specialty} • ${s.time}`
                            )
                            .join(', ')}
                        >
                          <span
                            className="flex items-center justify-center w-2 h-2 sm:w-3 sm:h-3 rounded-full text-[6px] sm:text-[8px] font-bold"
                            style={{ background: '#0ea5e9', color: 'white' }}
                          >
                            <FaUserMd className="w-2 h-2 sm:w-3 sm:h-3" />
                          </span>
                          <span className="font-semibold hidden sm:inline">
                            +{availability.length} slot
                            {availability.length > 1 ? 's' : ''}
                          </span>
                          <span className="font-semibold sm:hidden">
                            +{availability.length}
                          </span>
                        </div>
                      ) : null}
                    </div>

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
        {showDayModal ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
            style={{
              background: 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'saturate(140%) blur(6px)',
            }}
            onClick={() => setShowDayModal(false)}
          >
            <div
              className="w-full max-w-sm sm:max-w-md lg:max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-base sm:text-lg font-semibold truncate"
                    style={{ color: COLORS.text }}
                  >
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <p
                    className="text-xs sm:text-sm truncate"
                    style={{ color: COLORS.textMuted }}
                  >
                    Overview for the selected date
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDayModal(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition flex items-center justify-center ml-2 flex-shrink-0"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                  }}
                  aria-label="Close"
                >
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div
                  className="rounded-lg sm:rounded-xl p-3 sm:p-4"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaCalendarDay
                      className="w-4 h-4"
                      style={{ color: COLORS.primary }}
                    />
                    <h4
                      className="font-medium text-sm sm:text-base"
                      style={{ color: COLORS.text }}
                    >
                      Appointments
                    </h4>
                  </div>
                  {appointmentsForSelected.length ? (
                    <div className="space-y-2">
                      {appointmentsForSelected.map((a, idx) => (
                        <div
                          key={`appt-${idx}`}
                          className="flex items-center justify-between rounded-lg p-2 sm:p-3 transition shadow-sm"
                          style={{
                            background: COLORS.white,
                            border: `1px solid ${COLORS.border}`,
                          }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                              style={{
                                background: `${COLORS.primary}1A`,
                                color: COLORS.primary,
                                border: `1px solid ${COLORS.primary}33`,
                              }}
                            >
                              {a.time}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-xs sm:text-sm font-semibold truncate"
                                style={{ color: COLORS.text }}
                              >
                                {a.doctor}
                              </p>
                              <p
                                className="text-xs truncate"
                                style={{ color: COLORS.textMuted }}
                              >
                                {a.specialty} • {a.location}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] sm:text[11px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${statusChip(
                              a.status
                            )}`}
                          >
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.textMuted }}
                    >
                      No appointments.
                    </p>
                  )}
                </div>

                <div
                  className="rounded-lg sm:rounded-xl p-3 sm:pp-4"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaClock
                      className="w-4 h-4"
                      style={{ color: COLORS.primary }}
                    />
                    <h4
                      className="font-medium text-sm sm:text-base"
                      style={{ color: COLORS.text }}
                    >
                      Available Slots
                    </h4>
                  </div>
                  {availabilityForSelected.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availabilityForSelected.map((s, idx) => (
                        <button
                          type="button"
                          key={`slot-${idx}`}
                          onClick={() =>
                            handleBook(formatDate(selectedDate), s)
                          }
                          className="flex items-center justify-between rounded-lg p-2 sm:p-3 transition shadow-sm text-left"
                          style={{
                            background: COLORS.white,
                            border: `1px solid ${COLORS.border}`,
                          }}
                          title={`${s.doctor} • ${s.specialty} • ${s.time}`}
                        >
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-xs sm:text-sm font-semibold"
                              style={{ color: COLORS.text }}
                            >
                              {s.time}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: COLORS.textMuted }}
                            >
                              {s.doctor}
                            </p>
                          </div>
                          <span
                            className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                            style={{
                              background: `${COLORS.primary}1A`,
                              color: COLORS.primary,
                              border: `1px solid ${COLORS.primary}33`,
                            }}
                          >
                            {s.specialty}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        No available slots for this date.
                      </p>
                      <div className="space-y-2">
                        <h5
                          className="text-xs sm:text-sm font-medium"
                          style={{ color: COLORS.text }}
                        >
                          Join Waitlist
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleWaitlistBook(
                                formatDate(selectedDate),
                                'Dr. Sarah Smith',
                                'Cardiology'
                              )
                            }
                            className="flex items-center justify-between rounded-lg p-2 sm:p-3 transition shadow-sm text-left"
                            style={{
                              background:
                                'linear-gradient(135deg, #fffbeb, #fef3c7)',
                              border: '1px solid #fde68a',
                            }}
                            title="Join waitlist for Cardiology"
                          >
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-xs sm:text-sm font-semibold"
                                style={{ color: '#d97706' }}
                              >
                                Cardiology
                              </p>
                              <p
                                className="text-xs truncate"
                                style={{ color: '#92400e' }}
                              >
                                Dr. Sarah Smith
                              </p>
                            </div>
                            <span
                              className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                              style={{
                                background: '#fef3c7',
                                color: '#d97706',
                                border: '1px solid #fde68a',
                              }}
                            >
                              Waitlist
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleWaitlistBook(
                                formatDate(selectedDate),
                                'Dr. Michael Johnson',
                                'General Practice'
                              )
                            }
                            className="flex items-center justify-between rounded-lg p-2 sm:p-3 transition shadow-sm text-left"
                            style={{
                              background:
                                'linear-gradient(135deg, #fffbeb, #fef3c7)',
                              border: '1px solid #fde68a',
                            }}
                            title="Join waitlist for General Practice"
                          >
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-xs sm:text-sm font-semibold"
                                style={{ color: '#d97706' }}
                              >
                                General Practice
                              </p>
                              <p
                                className="text-xs truncate"
                                style={{ color: '#92400e' }}
                              >
                                Dr. Michael Johnson
                              </p>
                            </div>
                            <span
                              className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                              style={{
                                background: '#fef3c7',
                                color: '#d97706',
                                border: '1px solid #fde68a',
                              }}
                            >
                              Waitlist
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Booking Modal */}
        {showBooking ? (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4"
            style={{
              background: 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'saturate(140%) blur(6px)',
            }}
            onClick={() => setShowBooking(false)}
          >
            <div
              className="w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <h3
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Request Appointment
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition flex items-center justify-center flex-shrink-0"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                  }}
                  aria-label="Close booking"
                >
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Patient Information Section */}
                {patient && (
                  <div
                    className="rounded-lg sm:rounded-xl p-3"
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      background: `${COLORS.primary}08`,
                    }}
                  >
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: COLORS.primary }}
                    >
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Name: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.name}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>ID: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.id}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Phone: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.phone}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Age: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.age} years
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appointment Details Section */}
                <div
                  className="rounded-lg sm:rounded-xl p-3"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: COLORS.text }}
                  >
                    Appointment Details
                  </h4>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: COLORS.text }}
                  >
                    Doctor:{' '}
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.primary }}
                    >
                      {bookingInfo.doctor}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: COLORS.text }}
                  >
                    Specialty:{' '}
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.secondary }}
                    >
                      {bookingInfo.specialty}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: COLORS.text }}
                  >
                    Date & Time:{' '}
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.primary }}
                    >
                      {bookingInfo.date} at {bookingInfo.time}
                    </span>
                  </p>
                </div>

                <form className="space-y-4">
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium mb-1"
                      style={{ color: COLORS.text }}
                    >
                      Reason for Visit
                    </label>
                    <textarea
                      required
                      placeholder="Brief description of your symptoms or reason for visit"
                      rows="3"
                      className="w-full rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 transition text-sm sm:text-base resize-none"
                      style={{
                        background: COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        color: COLORS.text,
                        outline: 'none',
                      }}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg sm:rounded-xl font-medium text-white shadow-sm transition text-sm sm:text-base"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (patient) {
                          alert(
                            `Appointment booked successfully for ${patient.name} (${patient.id}) with ${bookingInfo.doctor} on ${bookingInfo.date} at ${bookingInfo.time}`
                          );
                        } else {
                          alert(
                            `Appointment booked successfully with ${bookingInfo.doctor} on ${bookingInfo.date} at ${bookingInfo.time}`
                          );
                        }
                        setShowBooking(false);
                        setShowPayment(true);
                      }}
                    >
                      Request Appointment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBooking(false)}
                      className="flex-1 py-2.5 rounded-lg sm:rounded-xl font-medium transition text-sm sm:text-base"
                      style={{
                        background: COLORS.gray50,
                        color: COLORS.text,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div
                  className="text-xs flex items-center gap-2"
                  style={{ color: COLORS.textMuted }}
                >
                  <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs">
                    Location will be shared in confirmation.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Waitlist Booking Modal */}
        {showWaitlistBooking ? (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4"
            style={{
              background: 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'saturate(140%) blur(6px)',
            }}
            onClick={() => setShowWaitlistBooking(false)}
          >
            <div
              className="w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <h3
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Join Waitlist
                </h3>
                <button
                  type="button"
                  onClick={() => setShowWaitlistBooking(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition flex items-center justify-center flex-shrink-0"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                  }}
                  aria-label="Close waitlist booking"
                >
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Patient Information Section */}
                {patient && (
                  <div
                    className="rounded-lg sm:rounded-xl p-3"
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      background: `${COLORS.primary}08`,
                    }}
                  >
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: COLORS.primary }}
                    >
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Name: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.name}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>ID: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.id}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Phone: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.phone}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Age: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.age} years
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Waitlist Details Section */}
                <div
                  className="rounded-lg sm:rounded-xl p-3"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: '#92400e' }}
                  >
                    Waitlist Details
                  </h4>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: '#92400e' }}
                  >
                    Doctor:{' '}
                    <span
                      className="font-semibold"
                      style={{ color: '#d97706' }}
                    >
                      {waitlistBookingInfo.doctor}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: '#92400e' }}
                  >
                    Specialty:{' '}
                    <span
                      className="font-semibold"
                      style={{ color: '#d97706' }}
                    >
                      {waitlistBookingInfo.specialty}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: '#92400e' }}
                  >
                    Date:{' '}
                    <span
                      className="font-semibold"
                      style={{ color: '#d97706' }}
                    >
                      {waitlistBookingInfo.date}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm mt-2"
                    style={{ color: '#92400e' }}
                  >
                    ⏳ You'll be notified when a slot becomes available
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleWaitlistSubmit(e);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium mb-1"
                      style={{ color: COLORS.text }}
                    >
                      Reason for Visit
                    </label>
                    <textarea
                      required
                      placeholder="Brief description of your symptoms or reason for visit"
                      rows="3"
                      className="w-full rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 transition text-sm sm:text-base resize-none"
                      style={{
                        background: COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        color: COLORS.text,
                        outline: 'none',
                      }}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg sm:rounded-xl font-medium text-white shadow-sm transition text-sm sm:text-base"
                      style={{
                        background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                      }}
                    >
                      Join Waitlist
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWaitlistBooking(false)}
                      className="flex-1 py-2.5 rounded-lg sm:rounded-xl font-medium transition text-sm sm:text-base"
                      style={{
                        background: COLORS.gray50,
                        color: COLORS.text,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}

        {/* Cashfree Payment Modal */}
        {showPayment ? (
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4"
            style={{
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'saturate(140%) blur(6px)',
            }}
            onClick={() => {
              if (!isPaymentInitializing) setShowPayment(false);
            }}
          >
            <div
              className="w-full max-w-md sm:max-w-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between"
                style={{ background: COLORS.white, borderColor: COLORS.border }}
              >
                <h3
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Complete Payment
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    !isPaymentInitializing && setShowPayment(false)
                  }
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition flex items-center justify-center flex-shrink-0"
                  style={{
                    background: COLORS.white,
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                    opacity: isPaymentInitializing ? 0.6 : 1,
                    cursor: isPaymentInitializing ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Close payment"
                >
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Patient Information Section */}
                {patient && (
                  <div
                    className="rounded-lg sm:rounded-xl p-3"
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      background: `${COLORS.primary}08`,
                    }}
                  >
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: COLORS.primary }}
                    >
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Name: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.name}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>ID: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.id}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Phone: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.phone}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.textMuted }}>Age: </span>
                        <span style={{ color: COLORS.text, fontWeight: '500' }}>
                          {patient.age} years
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Details Section */}
                <div
                  className="rounded-lg sm:rounded-xl p-3"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: COLORS.text }}
                  >
                    Payment Details
                  </h4>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: COLORS.text }}
                  >
                    Paying for:{' '}
                    <span className="font-semibold">
                      {bookingInfo.specialty}
                    </span>
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: COLORS.text }}
                  >
                    Doctor:{' '}
                    <span className="font-semibold">{bookingInfo.doctor}</span>
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: COLORS.text }}
                  >
                    Date & Time:{' '}
                    <span className="font-semibold">
                      {bookingInfo.date} at {bookingInfo.time}
                    </span>
                  </p>
                </div>

                {paymentInitError ? (
                  <div
                    className="rounded-lg sm:rounded-xl p-3 text-xs sm:text-sm"
                    style={{
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#991b1b',
                    }}
                  >
                    {paymentInitError}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg text-white text-xs sm:text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                        }}
                        onClick={() => {
                          setShowPayment(false);
                          alert(
                            'Proceeding without payment (demo). Wire server to create Cashfree order.'
                          );
                        }}
                      >
                        Continue (Demo)
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg text-xs sm:text-sm"
                        style={{
                          background: COLORS.gray50,
                          color: COLORS.text,
                          border: `1px solid ${COLORS.border}`,
                        }}
                        onClick={() => setShowPayment(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div
                  id="cf-dropin"
                  style={{
                    minHeight: '520px',
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '0.75rem',
                  }}
                  className="p-2"
                >
                  {isPaymentInitializing ? (
                    <div
                      className="w-full h-[500px] flex items-center justify-center text-sm"
                      style={{ color: COLORS.textMuted }}
                    >
                      Initializing payment...
                    </div>
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

export default DoctorPatientBooking;
