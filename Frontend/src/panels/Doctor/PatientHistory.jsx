import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaStethoscope,
  FaPills,
  FaSyringe,
  FaXRay,
  FaHeartbeat,
  FaThermometerHalf,
  FaNotesMedical,
  FaDownload,
  FaEye,
  FaClock,
  FaUserMd,
  FaHospital,
  FaMicroscope,
  FaHeart,
  FaTooth,
} from 'react-icons/fa';
import { MdTimeline } from 'react-icons/md';
import { BsClockHistory } from 'react-icons/bs';

const PatientHistory = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Animation variants
  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  // Sample patient data
  const patientsDatabase = {
    'PAT-2024-001': {
      id: 'PAT-2024-001',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      conditions: ['Hypertension', 'Diabetes Type 2'],
    },
  };

  // Sample medical history data
  const sampleMedicalHistory = [
    {
      id: 1,
      date: '2024-03-15',
      time: '14:30',
      type: 'consultation',
      category: 'visit',
      title: 'Regular Check-up',
      doctor: 'Dr. Sarah Johnson',
      department: 'General Medicine',
      description: 'Routine health check-up and blood pressure monitoring',
      symptoms: ['Mild headache', 'Fatigue'],
      diagnosis: 'Normal blood pressure, slight vitamin D deficiency',
      treatment:
        'Prescribed vitamin D supplements, recommended lifestyle changes',
      medications: [
        {
          name: 'Vitamin D3',
          dosage: '1000 IU',
          frequency: 'Once daily',
          duration: '3 months',
        },
      ],
      vitalSigns: {
        bloodPressure: '120/80 mmHg',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        weight: '75 kg',
        height: '175 cm',
      },
      labReports: [
        {
          id: 'LAB-001',
          name: 'Complete Blood Count',
          status: 'completed',
          uploaded: '2024-03-16',
        },
        {
          id: 'LAB-002',
          name: 'Vitamin D Test',
          status: 'completed',
          uploaded: '2024-03-16',
        },
      ],
      imagingReports: [],
      followUp: '2024-04-15',
      notes:
        'Patient shows improvement in overall health. Continue with current medication.',
    },
    {
      id: 2,
      date: '2024-02-28',
      time: '10:15',
      type: 'emergency',
      category: 'visit',
      title: 'Emergency Visit - Chest Pain',
      doctor: 'Dr. Michael Chen',
      department: 'Cardiology',
      description: 'Patient presented with chest pain and shortness of breath',
      symptoms: ['Chest pain', 'Shortness of breath', 'Anxiety'],
      diagnosis: 'Anxiety-induced chest pain, no cardiac issues detected',
      treatment: 'Prescribed anti-anxiety medication and breathing exercises',
      medications: [
        {
          name: 'Alprazolam',
          dosage: '0.5mg',
          frequency: 'As needed',
          duration: '1 week',
        },
      ],
      vitalSigns: {
        bloodPressure: '140/90 mmHg',
        heartRate: '95 bpm',
        temperature: '98.8°F',
        weight: '75 kg',
        height: '175 cm',
      },
      labReports: [
        {
          id: 'LAB-003',
          name: 'Troponin Test',
          status: 'completed',
          uploaded: '2024-02-28',
        },
        {
          id: 'LAB-004',
          name: 'ECG',
          status: 'completed',
          uploaded: '2024-02-28',
        },
      ],
      imagingReports: [
        {
          id: 'IMG-001',
          name: 'Chest X-Ray',
          status: 'completed',
          uploaded: '2024-02-28',
        },
      ],
      followUp: '2024-03-07',
      notes:
        'Patient responded well to treatment. No cardiac abnormalities found.',
    },
    {
      id: 3,
      date: '2024-01-20',
      time: '16:45',
      type: 'consultation',
      category: 'visit',
      title: 'Diabetes Management',
      doctor: 'Dr. Emily Rodriguez',
      department: 'Endocrinology',
      description: 'Diabetes follow-up and medication adjustment',
      symptoms: ['Increased thirst', 'Frequent urination'],
      diagnosis: 'Type 2 Diabetes - well controlled',
      treatment: 'Adjusted metformin dosage and dietary recommendations',
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: 'Ongoing',
        },
      ],
      vitalSigns: {
        bloodPressure: '125/82 mmHg',
        heartRate: '68 bpm',
        temperature: '98.4°F',
        weight: '76 kg',
        height: '175 cm',
      },
      labReports: [
        {
          id: 'LAB-005',
          name: 'HbA1c Test',
          status: 'completed',
          uploaded: '2024-01-21',
        },
        {
          id: 'LAB-006',
          name: 'Blood Glucose',
          status: 'completed',
          uploaded: '2024-01-21',
        },
      ],
      imagingReports: [],
      followUp: '2024-02-20',
      notes:
        'Blood sugar levels are well controlled. Continue current treatment plan.',
    },
    {
      id: 4,
      date: '2023-12-10',
      time: '11:30',
      type: 'procedure',
      category: 'procedure',
      title: 'Dental Cleaning and Check-up',
      doctor: 'Dr. Lisa Thompson',
      department: 'Dentistry',
      description: 'Regular dental cleaning and oral health assessment',
      symptoms: ['Minor tooth sensitivity'],
      diagnosis: 'Good oral health, minor tartar buildup',
      treatment: 'Professional cleaning, fluoride treatment',
      medications: [],
      vitalSigns: {
        bloodPressure: '118/78 mmHg',
        heartRate: '70 bpm',
        temperature: '98.6°F',
        weight: '75 kg',
        height: '175 cm',
      },
      labReports: [],
      imagingReports: [
        {
          id: 'IMG-002',
          name: 'Dental X-Ray',
          status: 'completed',
          uploaded: '2023-12-10',
        },
      ],
      followUp: '2024-06-10',
      notes: 'No cavities detected. Maintain good oral hygiene practices.',
    },
    {
      id: 5,
      date: '2023-11-05',
      time: '09:00',
      type: 'consultation',
      category: 'visit',
      title: 'Annual Physical Examination',
      doctor: 'Dr. Sarah Johnson',
      department: 'General Medicine',
      description: 'Comprehensive annual health check-up',
      symptoms: ['None'],
      diagnosis: 'Overall good health, minor vitamin deficiencies',
      treatment: 'Multivitamin supplements, exercise recommendations',
      medications: [
        {
          name: 'Multivitamin',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: 'Ongoing',
        },
      ],
      vitalSigns: {
        bloodPressure: '122/80 mmHg',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        weight: '74 kg',
        height: '175 cm',
      },
      labReports: [
        {
          id: 'LAB-007',
          name: 'Comprehensive Metabolic Panel',
          status: 'completed',
          uploaded: '2023-11-06',
        },
        {
          id: 'LAB-008',
          name: 'Lipid Panel',
          status: 'completed',
          uploaded: '2023-11-06',
        },
        {
          id: 'LAB-009',
          name: 'Thyroid Function Test',
          status: 'completed',
          uploaded: '2023-11-06',
        },
      ],
      imagingReports: [],
      followUp: '2024-11-05',
      notes:
        'Patient is in good health. Continue with preventive care measures.',
    },
  ];

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      setTimeout(() => {
        const patientData = patientsDatabase[patientId];
        if (patientData) {
          setPatient(patientData);
          setMedicalHistory(sampleMedicalHistory);
        }
        setLoading(false);
      }, 500);
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  const getCategoryIcon = (category) => {
    const icons = {
      visit: FaStethoscope,
      procedure: FaHospital,
      lab: FaMicroscope,
      imaging: FaXRay,
      medication: FaPills,
      vaccination: FaSyringe,
    };
    return icons[category] || FaNotesMedical;
  };

  const getTypeColor = (type) => {
    const colors = {
      consultation: 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800',
      procedure: 'bg-purple-100 text-purple-800',
      followup: 'bg-green-100 text-green-800',
      routine: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDepartmentIcon = (department) => {
    const icons = {
      'General Medicine': FaStethoscope,
      Cardiology: FaHeart,
      Endocrinology: FaThermometerHalf,
      Dentistry: FaTooth,
      Radiology: FaXRay,
      Laboratory: FaMicroscope,
      Emergency: FaHeartbeat,
    };
    return icons[department] || FaUserMd;
  };

  const filteredHistory = medicalHistory.filter((item) => {
    const categoryMatch =
      selectedCategory === 'all' || item.category === selectedCategory;
    const yearMatch =
      selectedYear === 'all' ||
      new Date(item.date).getFullYear().toString() === selectedYear;
    return categoryMatch && yearMatch;
  });

  const years = [
    ...new Set(
      medicalHistory.map((item) => new Date(item.date).getFullYear().toString())
    ),
  ].sort((a, b) => b - a);
  const categories = [...new Set(medicalHistory.map((item) => item.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0118D8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient history...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Patient Not Found
          </h2>
          <p className="text-gray-600">
            The patient with ID "{patientId}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E9DFC3]/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[#E9DFC3] rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-[#E9DFC3] rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E9DFC3]/50 overflow-hidden">
        <div className="p-6 border-b border-[#E9DFC3]/50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MdTimeline className="w-5 h-5 text-[#0118D8]" />
            Medical Timeline
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredHistory.length} events found
          </p>
        </div>

        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <BsClockHistory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No History Found
              </h3>
              <p className="text-gray-600">
                No medical events match the selected filters.
              </p>
            </div>
          ) : (
            <motion.div
              variants={timelineVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Timeline line - Modern gradient design */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0118D8] via-[#1B56FD] to-[#4F8FF0] rounded-full shadow-sm"></div>

              {/* Timeline line glow effect */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0118D8]/20 via-[#1B56FD]/20 to-[#4F8FF0]/20 rounded-full blur-sm"></div>

              {filteredHistory.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="relative mb-8 last:mb-0"
                >
                  {/* Timeline arrow with date */}
                  <div className="absolute left-0 top-8 z-10 flex items-center">
                    {/* Date badge */}
                    <div className="bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg mr-2">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    {/* Arrow pointing to the card */}
                    <div className="relative">
                      {/* Arrow body */}
                      <div className="w-8 h-6 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] rounded-l-lg shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      {/* Arrow head */}
                      <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                        <div className="w-0 h-0 border-l-4 border-l-[#1B56FD] border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 w-8 h-6 bg-[#0118D8]/30 rounded-l-lg blur-sm -z-10"></div>
                    </div>
                  </div>

                  {/* Event card */}
                  <div className="ml-24 bg-gray-50 rounded-2xl p-6 border border-[#E9DFC3]/50 hover:border-[#1B56FD]/20 transition-all duration-300">
                    {/* Event header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(
                            event.type
                          )}`}
                        >
                          {React.createElement(
                            getCategoryIcon(event.category),
                            { className: 'w-5 h-5' }
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {event.time}
                            </span>
                            <span>•</span>
                            <span>{new Date(event.date).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            event.type
                          )}`}
                        >
                          {event.type.charAt(0).toUpperCase() +
                            event.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Doctor and department */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      {React.createElement(
                        getDepartmentIcon(event.department),
                        { className: 'w-4 h-4' }
                      )}
                      <span>{event.doctor}</span>
                      <span>•</span>
                      <span>{event.department}</span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {event.description}
                      </p>
                    </div>

                    {/* Symptoms and Diagnosis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {event.symptoms.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Symptoms
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {event.symptoms.map((symptom, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Diagnosis
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {event.diagnosis}
                        </p>
                      </div>
                    </div>

                    {/* Treatment */}
                    {event.treatment && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Treatment
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {event.treatment}
                        </p>
                      </div>
                    )}

                    {/* Medications */}
                    {event.medications.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Medications
                        </h4>
                        <div className="space-y-2">
                          {event.medications.map((med, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-lg p-3 border border-[#E9DFC3]/50"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <FaPills className="w-4 h-4 text-[#0118D8]" />
                                <span className="font-medium text-sm">
                                  {med.name}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                <span>
                                  {med.dosage} • {med.frequency}
                                </span>
                                {med.duration && (
                                  <span> • Duration: {med.duration}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vital Signs */}
                    {event.vitalSigns && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Vital Signs
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {Object.entries(event.vitalSigns).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="bg-white rounded-lg p-3 border border-[#E9DFC3]/50 text-center"
                              >
                                <div className="text-xs text-gray-500 mb-1">
                                  {key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {value}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reports */}
                    {(event.labReports.length > 0 ||
                      event.imagingReports.length > 0) && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Reports
                        </h4>
                        <div className="space-y-2">
                          {event.labReports.map((report) => (
                            <div
                              key={report.id}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border border-[#E9DFC3]/50"
                            >
                              <div className="flex items-center gap-2">
                                <FaMicroscope className="w-4 h-4 text-[#0118D8]" />
                                <span className="text-sm font-medium">
                                  {report.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({report.id})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    report.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {report.status}
                                </span>
                                <button className="p-1 text-[#0118D8] hover:bg-[#FFF8F8] rounded">
                                  <FaEye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-[#0118D8] hover:bg-[#FFF8F8] rounded">
                                  <FaDownload className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {event.imagingReports.map((report) => (
                            <div
                              key={report.id}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border border-[#E9DFC3]/50"
                            >
                              <div className="flex items-center gap-2">
                                <FaXRay className="w-4 h-4 text-[#0118D8]" />
                                <span className="text-sm font-medium">
                                  {report.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({report.id})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    report.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {report.status}
                                </span>
                                <button className="p-1 text-[#0118D8] hover:bg-[#FFF8F8] rounded">
                                  <FaEye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-[#0118D8] hover:bg-[#FFF8F8] rounded">
                                  <FaDownload className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up and Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.followUp && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Follow-up
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {new Date(event.followUp).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {event.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Notes
                          </h4>
                          <p className="text-gray-600 text-sm">{event.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
