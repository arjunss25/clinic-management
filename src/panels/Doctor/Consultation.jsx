import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Printer, FileDown, Plus, X, Calendar, User, 
  CreditCard, AlertTriangle, Pill, Stethoscope, Thermometer, 
  Heart, Droplets, Activity, Clock, CheckCircle, Edit3,
  FileText, CalendarPlus, Brain, Eye, Zap
} from 'lucide-react';

const Consultation = () => {
  // Mock data for demonstration
  const selectedAppointment = {
    patientName: "Sarah Johnson",
    patientId: "PT-2024-001",
    age: 32,
    gender: "Female",
    condition: "General Checkup",
    allergies: "Penicillin, Shellfish",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      oxygenSaturation: "98%"
    }
  };

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

  const [activeTab, setActiveTab] = useState('consultation');

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

  const saveConsultation = () => {
    alert('Consultation saved successfully!');
  };

  const tabs = [
    { id: 'consultation', label: 'Consultation', icon: Stethoscope },
    { id: 'prescription', label: 'Prescription', icon: Pill },
    { id: 'followup', label: 'Follow-up', icon: Calendar }
  ];

  return (
    <div className="min-h-screen ">
      {/* Modern Header with Glassmorphism - Reduced Height */}
      <div className="backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.href = 'http://localhost:5173/doctor'}
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-100/50 hover:bg-slate-200/70 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                <span className="text-slate-700 font-medium text-sm">Dashboard</span>
              </button>
              
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
              
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Consultation Record
                </h1>
                <p className="text-slate-600 text-xs">Complete patient consultation and care plan</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={saveConsultation}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-sm"
              >
                <Save className="w-3.5 h-3.5" />
                Save Consultation
              </button>
              
              <button className="flex items-center gap-1 px-2 py-1.5 bg-white/70 hover:bg-white/90 border border-slate-200/50 text-slate-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 text-sm">
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              
              <button className="flex items-center gap-1 px-2 py-1.5 bg-white/70 hover:bg-white/90 border border-slate-200/50 text-slate-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 text-sm">
                <FileDown className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Patient Header - Reduced Height */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    {selectedAppointment.patientName}
                  </h2>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="font-medium">ID:</span> {selectedAppointment.patientId}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">Age:</span> {selectedAppointment.age}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">Gender:</span> {selectedAppointment.gender}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-200/50 font-medium text-xs">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    {selectedAppointment.condition}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-lg border border-red-200/50 font-medium text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {selectedAppointment.allergies}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Vital Signs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { icon: Droplets, label: 'BP', value: selectedAppointment.vitalSigns.bloodPressure, color: 'red' },
                { icon: Heart, label: 'HR', value: selectedAppointment.vitalSigns.heartRate, color: 'pink' },
                { icon: Thermometer, label: 'Temp', value: selectedAppointment.vitalSigns.temperature, color: 'orange' },
                { icon: Activity, label: 'SpO2', value: selectedAppointment.vitalSigns.oxygenSaturation, color: 'blue' }
              ].map(({ icon: Icon, label, value, color }, index) => (
                <div key={index} className="text-center p-2 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-lg mb-1 mx-auto`}>
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{label}</div>
                  <div className="text-xs font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Modern Tabs - Reduced Spacing */}
      <div className="px-6 py-4 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex items-center gap-0.5 p-0.5 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm mb-4 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'consultation' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Clinical Assessment</h3>
                <p className="text-slate-600">Document examination findings and treatment plan</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { key: 'diagnosis', label: 'Primary Diagnosis', placeholder: 'Enter primary diagnosis and ICD codes...', icon: FileText },
                { key: 'examination', label: 'Physical Examination', placeholder: 'Document physical examination findings...', icon: Eye },
                { key: 'treatmentPlan', label: 'Treatment Plan', placeholder: 'Outline comprehensive treatment approach...', icon: Zap },
                { key: 'recommendations', label: 'Patient Instructions', placeholder: 'Lifestyle recommendations and follow-up care...', icon: CheckCircle }
              ].map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key} className="group">
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                    <Icon className="w-5 h-5 text-slate-500" />
                    {label}
                  </label>
                  <textarea
                    value={consultation[key]}
                    onChange={(e) => setConsultation((prev) => ({ ...prev, [key]: e.target.value }))}
                    rows="4"
                    placeholder={placeholder}
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none group-hover:shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prescription' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl flex items-center justify-center">
                  <Pill className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Prescription Management</h3>
                  <p className="text-slate-600">Add medications and treatment instructions</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                Add to Record
              </button>
            </div>

            {/* Modern Medications Table */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200/50">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200/50">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700">
                    <div className="col-span-3">Medication</div>
                    <div className="col-span-2">Dosage</div>
                    <div className="col-span-3">Frequency</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Action</div>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-200/50">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="px-6 py-4 hover:bg-slate-50/50 transition-colors duration-200">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Enter medication name"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="w-full px-4 py-3 bg-white/70 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="500mg"
                            value={med.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="w-full px-4 py-3 bg-white/70 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Twice daily"
                            value={med.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full px-4 py-3 bg-white/70 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="7 days"
                            value={med.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="w-full px-4 py-3 bg-white/70 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                        <div className="col-span-2">
                          <button
                            onClick={() => removeMedication(index)}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.medications.length < 5 && (
                <button
                  onClick={addMedication}
                  className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-dashed border-blue-300 text-blue-700 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Medication
                </button>
              )}

              {/* Instructions Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-slate-200/50">
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                    <FileText className="w-5 h-5 text-slate-500" />
                    Special Instructions
                  </label>
                  <textarea
                    value={prescription.instructions}
                    onChange={(e) => setPrescription((prev) => ({ ...prev, instructions: e.target.value }))}
                    rows="4"
                    placeholder="Instructions for patient (e.g., take with food, avoid alcohol)"
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                    <Edit3 className="w-5 h-5 text-slate-500" />
                    Additional Notes
                  </label>
                  <textarea
                    value={prescription.notes}
                    onChange={(e) => setPrescription((prev) => ({ ...prev, notes: e.target.value }))}
                    rows="4"
                    placeholder="Additional notes for pharmacy or patient"
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'followup' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <CalendarPlus className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Schedule Follow-up</h3>
                <p className="text-slate-600">Plan next appointment and care continuity</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUp.date}
                  onChange={(e) => setFollowUp((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                  <Clock className="w-5 h-5 text-slate-500" />
                  Time
                </label>
                <input
                  type="time"
                  value={followUp.time}
                  onChange={(e) => setFollowUp((prev) => ({ ...prev, time: e.target.value }))}
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-slate-700 font-semibold mb-3 block">Appointment Type</label>
                <select
                  value={followUp.type}
                  onChange={(e) => setFollowUp((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Review">Review</option>
                  <option value="Test Results">Test Results</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-semibold mb-3 block">Priority</label>
                <select className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300">
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="asap">ASAP</option>
                </select>
              </div>
            </div>
            
            <div className="mb-8">
              <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                <FileText className="w-5 h-5 text-slate-500" />
                Follow-up Notes
              </label>
              <textarea
                value={followUp.notes}
                onChange={(e) => setFollowUp((prev) => ({ ...prev, notes: e.target.value }))}
                rows="4"
                placeholder="Reason for follow-up, specific instructions, tests required..."
                className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 resize-none"
              />
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <CalendarPlus className="w-5 h-5" />
                Schedule Appointment
              </button>
              <button className="px-8 py-4 bg-white/70 hover:bg-white/90 border border-slate-200/50 text-slate-700 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                Save as Draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;