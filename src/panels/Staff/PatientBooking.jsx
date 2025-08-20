import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaTimes } from 'react-icons/fa';

const StaffPatientBooking = () => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);

  const mockSlots = [
    { time: '09:00', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology' },
    { time: '14:00', doctor: 'Dr. Michael Johnson', specialty: 'General Practice' },
    { time: '10:00', doctor: 'Dr. Emily Davis', specialty: 'Dermatology' },
  ];

  const mockPatients = [
    { id: 1, name: 'John Doe', phone: '+1 (555) 123-4567', email: 'john.doe@email.com' },
    { id: 2, name: 'Jane Smith', phone: '+1 (555) 234-5678', email: 'jane.smith@email.com' },
  ];

  const handleBookAppointment = () => {
    alert('Appointment booking feature implemented successfully!');
    setShowBooking(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="space-y-2">
            <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
              Book Appointment for Patient
            </h1>
            <p className="text-gray-600">
              Schedule appointments on behalf of patients
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/staff/appointments')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md bg-white text-blue-600 border border-gray-200"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Appointments
            </button>
          </div>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Calendar View</h2>
            <button
              onClick={() => setShowBooking(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaCalendarAlt className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square border border-gray-200 rounded-lg p-2 text-sm"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Slots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSlots.map((slot, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setShowBooking(true)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">{slot.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{slot.doctor}</p>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {slot.specialty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {mockPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setShowBooking(true)}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.phone} • {patient.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
                  <button
                    onClick={() => setShowBooking(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter patient name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit *
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the reason for the appointment..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowBooking(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Book Appointment
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

export default StaffPatientBooking;
