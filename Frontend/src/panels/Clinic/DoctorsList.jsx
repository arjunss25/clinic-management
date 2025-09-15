import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import clinicAPI from '../../services/clinicApiService';
import doctorAPI from '../../services/doctorApiService';


const DoctorsList = ({ onDoctorSelect }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors data on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await clinicAPI.listAllDoctors();
      
      if (response.success) {
        setDoctors(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch doctors');
        setDoctors([]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('An unexpected error occurred while loading doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specializations from the fetched doctors data
  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean)),
  ];

  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter((doctor) => {
      const doctorName = doctor.doctor_name || doctor.name || '';
      const doctorSpecialization = doctor.specialization || '';
      
      const matchesSearch =
        doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctorSpecialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization =
        !selectedSpecialization ||
        doctorSpecialization === selectedSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = a.doctor_name || a.name || '';
          const nameB = b.doctor_name || b.name || '';
          return nameA.localeCompare(nameB);
        case 'experience':
          const expA = parseInt(a.experience_years || a.experience || 0);
          const expB = parseInt(b.experience_years || b.experience || 0);
          return expB - expA;
        case 'patients':
          const patientsA = parseInt(a.totalPatients || a.patientsCount || 0);
          const patientsB = parseInt(b.totalPatients || b.patientsCount || 0);
          return patientsB - patientsA;
        default:
          return 0;
      }
    });

  const handleDoctorSelect = async (doctor) => {
    if (onDoctorSelect) {
    onDoctorSelect(doctor);
    } else {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      try {
        // First, fetch full doctor details using the same endpoint as DoctorProfile
        const doctorDetailsResponse = await clinicAPI.getDoctorDetails(doctor.id);
        
        if (doctorDetailsResponse.success) {
          // Then fetch doctor availability for today using doctorAPI (same as doctor panel)
          const availabilityResponse = await doctorAPI.getDoctorAvailability(doctor.id, today);
          
          // Transform API data to match component structure based on actual API response
          const transformedDoctor = {
            id: doctorDetailsResponse.data.id,
            name: doctorDetailsResponse.data.doctor_name,
            specialization: doctorDetailsResponse.data.specialization,
            qualification: doctorDetailsResponse.data.education || 'MD',
            experience: doctorDetailsResponse.data.experince_years || 0,
            phone: doctorDetailsResponse.data.phone,
            email: doctorDetailsResponse.data.email,
            image: doctorDetailsResponse.data.profile_picture || null,
            rating: '4.5', // Default rating since not in API response
            bio: doctorDetailsResponse.data.bio || '',
            clinic_name: doctorDetailsResponse.data.clinic_name || '',
            appointment_amount: doctorDetailsResponse.data.appointment_amount || '0.00',
            additional_qualification: doctorDetailsResponse.data.additional_qualification || {},
            joinedDate: new Date(doctorDetailsResponse.data.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            status: 'Active',
            // Add any other fields that might be needed
            ...doctorDetailsResponse.data
          };
          
          // Navigate to appointments page with transformed doctor details and availability
          const navigationState = { 
            selectedDoctor: transformedDoctor, // Use transformed doctor details
            availability: availabilityResponse.success ? availabilityResponse.data : null,
            selectedDate: today,
            error: availabilityResponse.success ? null : availabilityResponse.message
          };
          
          
          navigate('/clinic/appointments', { state: navigationState });
        } else {
          // If doctor details fetch fails, still navigate with basic doctor info
          // Transform basic doctor info to match expected structure
          const basicDoctorInfo = {
            id: doctor.id,
            name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
            specialization: doctor.specialization || 'General',
            qualification: doctor.qualification || doctor.education || 'MD',
            experience: doctor.experience || doctor.experince_years || 0,
            phone: doctor.phone || '',
            email: doctor.email || '',
            image: doctor.image || doctor.profile_picture || null,
            rating: '4.5',
            bio: doctor.bio || '',
            clinic_name: doctor.clinic_name || '',
            appointment_amount: doctor.appointment_amount || '0.00',
            status: 'Active',
            ...doctor
          };
          
          navigate('/clinic/appointments', { 
            state: { 
              selectedDoctor: basicDoctorInfo, // Use transformed basic doctor info
              availability: null,
              selectedDate: today,
              error: doctorDetailsResponse.message
            } 
          });
        }
      } catch (error) {
        // Navigate anyway but with error state
        // Transform basic doctor info to match expected structure
        const fallbackDoctorInfo = {
          id: doctor.id,
          name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
          specialization: doctor.specialization || 'General',
          qualification: doctor.qualification || doctor.education || 'MD',
          experience: doctor.experience || doctor.experince_years || 0,
          phone: doctor.phone || '',
          email: doctor.email || '',
          image: doctor.image || doctor.profile_picture || null,
          rating: '4.5',
          bio: doctor.bio || '',
          clinic_name: doctor.clinic_name || '',
          appointment_amount: doctor.appointment_amount || '0.00',
          status: 'Active',
          ...doctor
        };
        
        navigate('/clinic/appointments', { 
          state: { 
            selectedDoctor: fallbackDoctorInfo,
            availability: null,
            selectedDate: today,
            error: 'Failed to load doctor data'
          } 
        });
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <FaUserMd className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Doctors</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDoctors}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900 mb-2">
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
            Showing{' '}
            <span className="font-medium text-gray-900">
              {filteredDoctors.length}
            </span>{' '}
            doctors
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={doctor.id || doctor.pk || doctor.doctor_name || doctor.name || `doctor-${index}`}
              className="bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              onClick={() => handleDoctorSelect(doctor)}
            >
              {/* Doctor Profile */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-gray-200">
                    <FaUserMd className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Dr. {doctor.doctor_name || doctor.name || 'Unknown'}
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                      {doctor.specialization || 'General'}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 border border-gray-200 rounded-lg">
                    <FaGraduationCap className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {doctor.experience_years || doctor.experience || 0} years
                    </p>
                  </div>
                  <div className="text-center p-3 border border-gray-200 rounded-lg">
                    <FaUsers className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Patients</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {(doctor.totalPatients || doctor.patientsCount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FaPhone className="w-4 h-4 text-blue-600" />
                    <span>{doctor.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FaEnvelope className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{doctor.email || 'N/A'}</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                    <FaUserMd className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">About</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {doctor.bio || 'No bio available'}
                  </p>
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
        {filteredDoctors.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaUserMd className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {doctors.length === 0 ? 'No doctors available' : 'No doctors found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {doctors.length === 0 
                ? 'There are no doctors registered in the system yet.' 
                : 'Try adjusting your search criteria or filters.'
              }
            </p>
            {doctors.length > 0 && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
              }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
