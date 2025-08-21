import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaUserMd,
  FaHospital,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaChartLine,
} from 'react-icons/fa';

const DoctorView = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Demo doctor data (replace with API)
  const doctor = useMemo(() => ({
    id: doctorId,
    name: 'Dr. Sarah Wilson',
    clinic: 'City Medical Center',
    clinicId: 'CL-001',
    specialization: 'Cardiology',
    email: 'sarah.wilson@citymedical.com',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    patients: 145,
    appointments: 1247,
    availability: 'Mon-Fri, 9AM-5PM',
    education: 'MD - Harvard Medical School',
    experience: '12 years',
    languages: ['English', 'Spanish'],
  }), [doctorId]);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };
  const cardHover = { y: -2, transition: { duration: 0.2 } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-[#E9DFC3]/70 text-[#0118D8] flex items-center justify-center" aria-label="Back">
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-[1.75rem] md:text-[2rem] font-semibold tracking-tight text-gray-900">{doctor.name}</h1>
          </div>
          <p className="text-gray-600">Doctor profile, schedule, and performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div variants={itemVariants} whileHover={cardHover} className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <FaUser className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Patients</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{doctor.patients}</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={cardHover} className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#1B56FD]/5 flex items-center justify-center">
              <FaCalendarAlt className="w-5 h-5 text-[#1B56FD]" />
            </div>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{doctor.appointments}</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={cardHover} className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FaStar className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-gray-500 text-sm">Rating</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{doctor.rating}</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={cardHover} className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <FaHospital className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-500 text-sm">Clinic</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{doctor.clinic}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm">
        <div className="border-b border-[#E9DFC3]/70">
          <nav className="flex gap-6 px-6">
            {[
              { id: 'profile', name: 'Profile' },
              { id: 'schedule', name: 'Schedule' },
              { id: 'performance', name: 'Performance' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'text-[#0118D8] border-[#0118D8]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Basic Info</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2"><FaUserMd className="w-4 h-4 text-[#0118D8]" /> {doctor.specialization}</div>
                    <div className="flex items-center gap-2"><FaEnvelope className="w-4 h-4 text-gray-500" /> {doctor.email}</div>
                    <div className="flex items-center gap-2"><FaPhone className="w-4 h-4 text-gray-500" /> {doctor.phone}</div>
                    <div className="flex items-center gap-2"><FaHospital className="w-4 h-4 text-gray-500" /> {doctor.clinic}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Education & Experience</h3>
                  <p className="text-sm text-gray-700">{doctor.education}</p>
                  <p className="text-sm text-gray-700">{doctor.experience}</p>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((l, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full text-sm border border-[#DCE4FF] bg-[#0118D8]/10 text-[#0118D8]">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#E9DFC3]/70 p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Availability</h4>
                  <div className="text-sm text-gray-700 flex items-center gap-2"><FaCalendarAlt className="w-4 h-4 text-gray-500" /> {doctor.availability}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Schedule module placeholder.</p>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-4">
                  <div className="text-sm text-gray-500">Patients</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{doctor.patients}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-4">
                  <div className="text-sm text-gray-500">Appointments (30d)</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{doctor.appointments}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-4">
                  <div className="text-sm text-gray-500">Rating</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{doctor.rating}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorView;


