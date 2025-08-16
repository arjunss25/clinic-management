import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaSave,
  FaPrint,
  FaPills,
  FaPlus,
  FaTimes,
  FaCalendarPlus,
  FaUser,
  FaIdCard,
  FaAllergies,
  FaStethoscope,
  FaThermometerHalf,
  FaHeartbeat,
  FaTint,
  FaLungs,
  FaHistory,
  FaNotesMedical,
  FaFileDownload,
  FaEdit,
} from 'react-icons/fa';

const Consultation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAppointment = location.state?.selectedAppointment;
  const [prescription, setPrescription] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
    notes: '',
  });
  const [followUp, setFollowUp] = useState({
    date: '',
    time: '',
    type: 'Follow-up',
    notes: '',
  });
  const [consultation, setConsultation] = useState({
    diagnosis: '',
    symptoms: '',
    examination: '',
    treatmentPlan: '',
    recommendations: '',
  });

  const addMedication = () => {
    if (prescription.medications.length < 5) {
      setPrescription((prev) => ({
        ...prev,
        medications: [
          ...prev.medications,
          { name: '', dosage: '', frequency: '', duration: '' },
        ],
      }));
    }
  };

  const removeMedication = (index) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const updateMedication = (index, field, value) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const addPrescription = () => {
    console.log('Add Prescription clicked', {
      appointment: selectedAppointment,
      prescription,
    });
    alert(
      'Prescription added. You can still edit before saving the consultation.'
    );
  };

  const saveConsultation = () => {
    console.log('Saving consultation:', {
      appointment: selectedAppointment,
      prescription,
      followUp,
      consultation,
    });
    alert('Consultation saved successfully!');
  };

  if (!selectedAppointment) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No appointment selected for consultation</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/doctor')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Consultation Record
              </h1>
              <p className="text-sm text-gray-500">
                Complete patient consultation and prescription
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveConsultation}
              className="flex items-center gap-2 px-6 py-2 bg-[#0118D8] text-white rounded-lg font-medium"
            >
              <FaSave className="w-4 h-4" />
              Save Consultation
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium">
              <FaPrint className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium">
              <FaFileDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Patient Information Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#0118D8] rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedAppointment.patientName}
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <FaIdCard className="w-3 h-3" />
                    ID: {selectedAppointment.patientId}
                  </span>
                  <span className="text-sm text-gray-600">
                    Age: {selectedAppointment.age}
                  </span>
                  <span className="text-sm text-gray-600">
                    Gender: {selectedAppointment.gender || 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  {selectedAppointment.condition}
                </span>
                {selectedAppointment.allergies && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                    <FaAllergies className="w-3 h-3 mr-1" />
                    {selectedAppointment.allergies}
                  </span>
                )}
                {selectedAppointment.currentMedications && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    <FaPills className="w-3 h-3 mr-1" />
                    Current Medications
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Vital Signs Quick View */}
          {selectedAppointment.vitalSigns && (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-red-50 rounded-full mb-1">
                  <FaTint className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-xs text-gray-500">BP</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedAppointment.vitalSigns.bloodPressure}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-pink-50 rounded-full mb-1">
                  <FaHeartbeat className="w-4 h-4 text-pink-600" />
                </div>
                <div className="text-xs text-gray-500">HR</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedAppointment.vitalSigns.heartRate}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-full mb-1">
                  <FaThermometerHalf className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-xs text-gray-500">Temp</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedAppointment.vitalSigns.temperature}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full mb-1">
                  <FaLungs className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-500">SpO2</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedAppointment.vitalSigns.oxygenSaturation}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Consultation Area */}
            <div className="xl:col-span-4 space-y-6">
              {/* Consultation Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStethoscope className="w-5 h-5 text-gray-600" />
                  Consultation Notes
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Primary Diagnosis
                    </label>
                    <textarea
                      value={consultation.diagnosis}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          diagnosis: e.target.value,
                        }))
                      }
                      rows="3"
                      placeholder="Enter primary diagnosis..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Clinical Examination
                    </label>
                    <textarea
                      value={consultation.examination}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          examination: e.target.value,
                        }))
                      }
                      rows="3"
                      placeholder="Physical examination findings..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Treatment Plan
                    </label>
                    <textarea
                      value={consultation.treatmentPlan}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          treatmentPlan: e.target.value,
                        }))
                      }
                      rows="3"
                      placeholder="Detailed treatment plan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Recommendations
                    </label>
                    <textarea
                      value={consultation.recommendations}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          recommendations: e.target.value,
                        }))
                      }
                      rows="3"
                      placeholder="Lifestyle recommendations, follow-up care..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Prescription Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaPills className="w-5 h-5 text-gray-600" />
                    Prescription
                  </h3>
                  <button
                    onClick={addPrescription}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm"
                  >
                    Add to Record
                  </button>
                </div>

                {/* Medications Table */}
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Medication
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Dosage
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Frequency
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Duration
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.medications.map((med, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-2">
                              <input
                                type="text"
                                placeholder="Medication name"
                                value={med.name}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    'name',
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0118D8] focus:border-transparent text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="text"
                                placeholder="e.g., 500mg"
                                value={med.dosage}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    'dosage',
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0118D8] focus:border-transparent text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="text"
                                placeholder="e.g., Twice daily"
                                value={med.frequency}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    'frequency',
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0118D8] focus:border-transparent text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="text"
                                placeholder="e.g., 7 days"
                                value={med.duration}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    'duration',
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0118D8] focus:border-transparent text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <button
                                onClick={() => removeMedication(index)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {prescription.medications.length < 5 && (
                    <button
                      onClick={addMedication}
                      className="flex items-center gap-2 px-4 py-2 border border-[#0118D8] text-[#0118D8] rounded-lg font-medium"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add Medication
                    </button>
                  )}

                  {/* Instructions and Notes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Special Instructions
                      </label>
                      <textarea
                        value={prescription.instructions}
                        onChange={(e) =>
                          setPrescription((prev) => ({
                            ...prev,
                            instructions: e.target.value,
                          }))
                        }
                        rows="3"
                        placeholder="Instructions for patient (e.g., take with food, avoid alcohol)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Additional Notes
                      </label>
                      <textarea
                        value={prescription.notes}
                        onChange={(e) =>
                          setPrescription((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows="3"
                        placeholder="Additional notes for pharmacy or patient"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow-up Appointment */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarPlus className="w-5 h-5 text-gray-600" />
                  Schedule Follow-up
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUp.date}
                      onChange={(e) =>
                        setFollowUp((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Time
                    </label>
                    <input
                      type="time"
                      value={followUp.time}
                      onChange={(e) =>
                        setFollowUp((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Appointment Type
                    </label>
                    <select
                      value={followUp.type}
                      onChange={(e) =>
                        setFollowUp((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                    >
                      <option value="Follow-up">Follow-up</option>
                      <option value="Review">Review</option>
                      <option value="Test Results">Test Results</option>
                      <option value="Procedure">Procedure</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Priority
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent">
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="asap">ASAP</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Follow-up Notes
                  </label>
                  <textarea
                    value={followUp.notes}
                    onChange={(e) =>
                      setFollowUp((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows="2"
                    placeholder="Reason for follow-up, specific instructions, tests required..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#0118D8] text-white rounded-lg font-medium">
                    <FaCalendarPlus className="w-4 h-4" />
                    Schedule Appointment
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium">
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Consultation;
