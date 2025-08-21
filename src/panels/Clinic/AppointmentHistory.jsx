import React, { useState } from 'react';
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
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaPrint,
  FaSearch,
  FaUserMd,
} from 'react-icons/fa';

const AppointmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const navigate = useNavigate();

  // Mock appointment history data
  const mockAppointmentHistory = [
    {
      id: 1,
      date: '2024-03-15',
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
      doctor: 'Dr. Sarah Wilson',
      notes: 'Patient reported feeling better. Blood pressure normal.',
      diagnosis: 'Healthy - No issues found',
      department: 'General Medicine',
      staffNotes: 'Patient arrived on time, vitals taken',
    },
    {
      id: 2,
      date: '2024-03-15',
      time: '09:30',
      duration: 30,
      status: 'completed',
      patient: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        reason: 'Follow-up consultation',
        age: 28,
        gender: 'Female',
      },
      doctor: 'Dr. Michael Brown',
      notes: 'Asthma symptoms well controlled. Continue current treatment.',
      diagnosis: 'Asthma - Well controlled',
      department: 'Pulmonology',
      staffNotes: 'Patient checked in early, breathing normal',
    },
    {
      id: 3,
      date: '2024-03-14',
      time: '14:00',
      duration: 30,
      status: 'completed',
      patient: {
        name: 'Emily Davis',
        phone: '+1 (555) 456-7890',
        reason: 'Routine checkup',
        age: 32,
        gender: 'Female',
      },
      doctor: 'Dr. James Wilson',
      notes: 'Patient reported feeling better. Migraine frequency reduced.',
      diagnosis: 'Migraine - Improved',
      department: 'Neurology',
      staffNotes: 'Patient arrived on time, no complaints',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleViewPatient = (patientId) => {
          navigate(`/clinic/patients/${patientId}`);
  };

  const handleViewAppointment = (appointmentId) => {
    console.log('Viewing appointment:', appointmentId);
  };

  const handleEditAppointment = (appointmentId) => {
    console.log('Editing appointment:', appointmentId);
  };

  const handleDeleteAppointment = (appointmentId) => {
    console.log('Deleting appointment:', appointmentId);
  };

  const exportHistory = () => {
    console.log('Exporting appointment history...');
  };

  const printHistory = () => {
    window.print();
  };

  const filteredAppointments = mockAppointmentHistory.filter((apt) => {
    const matchesSearch =
      apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient.phone.includes(searchTerm) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDepartment =
      departmentFilter === 'all' || apt.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appointment History
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage past appointments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={printHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaPrint className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Appointment History ({filteredAppointments.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patient.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <FaClock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.time} • {appointment.duration} min
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.patient.age} years •{' '}
                          {appointment.patient.gender}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaStethoscope className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.doctor}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <FaPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.patient.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendarDay className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaStethoscope className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.department}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Reason:</strong> {appointment.patient.reason}
                    </div>

                    {appointment.notes && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}

                    {appointment.staffNotes && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Staff Notes:</strong> {appointment.staffNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        #{appointment.id}
                      </p>
                      <p className="text-xs text-gray-500">Appointment ID</p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() =>
                          handleViewPatient(appointment.patient.id)
                        }
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        <FaEye className="w-3 h-3" />
                        <span>View Patient</span>
                      </button>

                      <button
                        onClick={() => handleViewAppointment(appointment.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm"
                      >
                        <FaEye className="w-3 h-3" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleEditAppointment(appointment.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-sm"
                      >
                        <FaEdit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        <FaTrash className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="p-12 text-center">
              <FaHistory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
