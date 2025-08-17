import React, { useState } from 'react';
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaClock,
  FaGraduationCap,
} from 'react-icons/fa';

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    experience: '15 years',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@clinic.com',
    location: 'Main Building, Floor 2',
    availability: 'Mon-Fri, 9:00 AM - 5:00 PM',
    rating: 4.8,
    patientsCount: 1250,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    experience: '12 years',
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@clinic.com',
    location: 'Main Building, Floor 3',
    availability: 'Mon-Sat, 8:00 AM - 6:00 PM',
    rating: 4.9,
    patientsCount: 980,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    experience: '8 years',
    phone: '+1 (555) 345-6789',
    email: 'emily.rodriguez@clinic.com',
    location: "Children's Wing, Floor 1",
    availability: 'Mon-Fri, 10:00 AM - 4:00 PM',
    rating: 4.7,
    patientsCount: 2100,
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Dr. David Thompson',
    specialization: 'Orthopedics',
    experience: '20 years',
    phone: '+1 (555) 456-7890',
    email: 'david.thompson@clinic.com',
    location: 'Surgery Center, Floor 4',
    availability: 'Mon-Fri, 7:00 AM - 3:00 PM',
    rating: 4.6,
    patientsCount: 890,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Dr. Lisa Park',
    specialization: 'Dermatology',
    experience: '10 years',
    phone: '+1 (555) 567-8901',
    email: 'lisa.park@clinic.com',
    location: 'Main Building, Floor 1',
    availability: 'Mon-Thu, 9:00 AM - 5:00 PM',
    rating: 4.8,
    patientsCount: 1560,
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 6,
    name: 'Dr. Robert Wilson',
    specialization: 'Psychiatry',
    experience: '18 years',
    phone: '+1 (555) 678-9012',
    email: 'robert.wilson@clinic.com',
    location: 'Mental Health Center, Floor 2',
    availability: 'Mon-Fri, 10:00 AM - 6:00 PM',
    rating: 4.9,
    patientsCount: 720,
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
];

const DoctorsList = ({ onDoctorSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Get unique specializations
  const specializations = [
    ...new Set(mockDoctors.map((doctor) => doctor.specialization)),
  ];

  // Filter and sort doctors
  const filteredDoctors = mockDoctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization =
        !selectedSpecialization ||
        doctor.specialization === selectedSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'patients':
          return b.patientsCount - a.patientsCount;
        default:
          return 0;
      }
    });

  const handleDoctorSelect = (doctor) => {
    onDoctorSelect(doctor);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctors Directory
          </h1>
          <p className="text-gray-600">
            Select a doctor to view their schedule and manage appointments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="lg:w-56">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="patients">Sort by Patients</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium text-gray-900">{filteredDoctors.length}</span> doctors
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              onClick={() => handleDoctorSelect(doctor)}
            >
              {/* Doctor Profile */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                      {doctor.specialization}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 border border-gray-200 rounded-lg">
                    <FaGraduationCap className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.experience}</p>
                  </div>
                  <div className="text-center p-3 border border-gray-200 rounded-lg">
                    <FaUsers className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Patients</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.patientsCount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FaPhone className="w-4 h-4 text-blue-600" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FaEnvelope className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                    <FaClock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Availability</span>
                  </div>
                  <p className="text-sm text-gray-600">{doctor.availability}</p>
                </div>

                {/* Action Button */}
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>View Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <FaUserMd className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
