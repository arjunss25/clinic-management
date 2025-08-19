import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Printer, FileDown, Plus, X, Calendar, User, 
  CreditCard, AlertTriangle, Pill, Stethoscope, Thermometer, 
  Heart, Droplets, Activity, Clock, CheckCircle, Edit3,
  FileText, CalendarPlus, Brain, Eye, Zap, Upload, Download,
  File, Search, Filter, Eye as EyeIcon
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
    startTime: '',
    startAmPm: 'AM',
    endTime: '',
    endAmPm: 'PM',
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

  // Reports state - only for viewing
  const [reports, setReports] = useState({
    existingReports: [
      {
        id: 1,
        title: 'Blood Test Results',
        type: 'Lab Report',
        uploadedBy: 'Lab Staff',
        uploadedDate: '2024-01-15',
        status: 'Completed',
        priority: 'Normal',
        description: 'Complete blood count and metabolic panel results',
        fileName: 'blood_test_results.pdf'
      },
      {
        id: 2,
        title: 'X-Ray Report',
        type: 'Imaging Report',
        uploadedBy: 'Radiology Staff',
        uploadedDate: '2024-01-14',
        status: 'Completed',
        priority: 'High',
        description: 'Chest X-ray examination report',
        fileName: 'chest_xray_report.pdf'
      },
      {
        id: 3,
        title: 'Patient Self-Report',
        type: 'Patient Report',
        uploadedBy: 'Sarah Johnson',
        uploadedDate: '2024-01-13',
        status: 'Pending Review',
        priority: 'Normal',
        description: 'Patient reported symptoms and concerns',
        fileName: 'patient_symptoms.pdf'
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('consultation');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    weight: '',
    height: '',
    bmi: '',
    notes: ''
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

  const saveConsultation = () => {
    alert('Consultation saved successfully!');
  };

  const tabs = [
    { id: 'consultation', label: 'Consultation', icon: Stethoscope },
    { id: 'prescription', label: 'Prescription', icon: Pill },
    { id: 'reports', label: 'Reports', icon: File },
    { id: 'followup', label: 'Follow-up', icon: Calendar }
  ];

  const filteredReports = reports.existingReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
                         report.description.toLowerCase().includes(reportSearch.toLowerCase());
    return matchesSearch;
  });

  const viewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleVitalsSubmit = () => {
    // Here you would typically save the vitals data
    alert('Vitals recorded successfully!');
    setShowVitalsModal(false);
    setVitalsForm({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: '',
      respiratoryRate: '',
      weight: '',
      height: '',
      bmi: '',
      notes: ''
    });
  };

  const calculateBMI = () => {
    const weight = parseFloat(vitalsForm.weight);
    const height = parseFloat(vitalsForm.height) / 100; // Convert cm to meters
    if (weight && height) {
      const bmi = (weight / (height * height)).toFixed(1);
      setVitalsForm(prev => ({ ...prev, bmi }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = 'http://localhost:5173/doctor'}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Consultation Record
            </h1>
            <p className="text-gray-600">Complete patient consultation and care plan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={saveConsultation}
            className="flex items-center gap-2 px-4 py-2 bg-[#0118D8] hover:bg-[#0118D8]/90 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Consultation
          </button>
        </div>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-[#0118D8] rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedAppointment.patientName}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">ID:</span> {selectedAppointment.patientId}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {selectedAppointment.age}
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {selectedAppointment.gender}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium text-sm">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  {selectedAppointment.condition}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium text-sm">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {selectedAppointment.allergies}
                </span>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Droplets, label: 'BP', value: selectedAppointment.vitalSigns.bloodPressure, color: 'red' },
              { icon: Heart, label: 'HR', value: selectedAppointment.vitalSigns.heartRate, color: 'pink' },
              { icon: Thermometer, label: 'Temp', value: selectedAppointment.vitalSigns.temperature, color: 'orange' },
              { icon: Activity, label: 'SpO2', value: selectedAppointment.vitalSigns.oxygenSaturation, color: 'blue' }
            ].map(({ icon: Icon, label, value, color }, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`flex items-center justify-center w-8 h-8 bg-${color}-100 rounded-lg mb-1 mx-auto`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
                <div className="text-sm font-bold text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tab Navigation with Add Vitals Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-[#0118D8] text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowVitalsModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#0118D8]/5 border border-[#0118D8] text-[#0118D8] rounded-lg font-medium transition-all hover:bg-[#0118D8]/10 hover:shadow-md"
          >
            <div className="w-6 h-6 bg-[#0118D8]/10 rounded-lg flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-[#0118D8]" />
            </div>
            <span className="text-sm">Add Vitals</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'consultation' && (
          <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Clinical Assessment</h3>
                <p className="text-gray-600">Document examination findings and treatment plan</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'diagnosis', label: 'Primary Diagnosis', placeholder: 'Enter primary diagnosis and ICD codes...', icon: FileText },
                { key: 'examination', label: 'Physical Examination', placeholder: 'Document physical examination findings...', icon: EyeIcon },
                { key: 'treatmentPlan', label: 'Treatment Plan', placeholder: 'Outline comprehensive treatment approach...', icon: Zap },
                { key: 'recommendations', label: 'Patient Instructions', placeholder: 'Lifestyle recommendations and follow-up care...', icon: CheckCircle }
              ].map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {label}
                  </label>
                  <textarea
                    value={consultation[key]}
                    onChange={(e) => setConsultation((prev) => ({ ...prev, [key]: e.target.value }))}
                    rows="4"
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prescription' && (
          <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Prescription Management</h3>
                  <p className="text-gray-600">Add medications and treatment instructions</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Add to Record
              </button>
            </div>

            {/* Medications Table */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-3">Medication</div>
                    <div className="col-span-2">Dosage</div>
                    <div className="col-span-3">Frequency</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Action</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Enter medication name"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="500mg"
                            value={med.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Twice daily"
                            value={med.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="7 days"
                            value={med.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                          />
                        </div>
                        <div className="col-span-2">
                          <button
                            onClick={() => removeMedication(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
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
                  className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 text-blue-700 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Medication
                </button>
              )}

              {/* Instructions Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Special Instructions
                  </label>
                  <textarea
                    value={prescription.instructions}
                    onChange={(e) => setPrescription((prev) => ({ ...prev, instructions: e.target.value }))}
                    rows="4"
                    placeholder="Instructions for patient (e.g., take with food, avoid alcohol)"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                    Additional Notes
                  </label>
                  <textarea
                    value={prescription.notes}
                    onChange={(e) => setPrescription((prev) => ({ ...prev, notes: e.target.value }))}
                    rows="4"
                    placeholder="Additional notes for pharmacy or patient"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'followup' && (
          <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Schedule Follow-up</h3>
                <p className="text-gray-600">Plan next appointment and care continuity</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUp.date}
                  onChange={(e) => setFollowUp((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Start Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={followUp.startTime}
                    onChange={(e) => setFollowUp((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                  />
                  <select
                    value={followUp.startAmPm}
                    onChange={(e) => setFollowUp((prev) => ({ ...prev, startAmPm: e.target.value }))}
                    className="px-3 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  End Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={followUp.endTime}
                    onChange={(e) => setFollowUp((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                  />
                  <select
                    value={followUp.endAmPm}
                    onChange={(e) => setFollowUp((prev) => ({ ...prev, endAmPm: e.target.value }))}
                    className="px-3 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-gray-700 font-semibold mb-2 block">Appointment Type</label>
                <select
                  value={followUp.type}
                  onChange={(e) => setFollowUp((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Review">Review</option>
                  <option value="Test Results">Test Results</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold mb-2 block">Priority</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors">
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="asap">ASAP</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Follow-up Notes
              </label>
              <textarea
                value={followUp.notes}
                onChange={(e) => setFollowUp((prev) => ({ ...prev, notes: e.target.value }))}
                rows="4"
                placeholder="Reason for follow-up, specific instructions, tests required..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors resize-none"
              />
            </div>
            
            <div className="flex gap-4 flex items-center justify-end">
              <button className="flex items-center  gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                <CalendarPlus className="w-4 h-4" />
                Schedule Appointment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl border border-[#E9DFC3]/70 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Patient Reports</h3>
                <p className="text-gray-600">View and manage patient's medical reports</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
              />
            </div>

                          <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-4">Report</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Uploaded By</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <File className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{report.title}</h4>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                  {report.fileName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                            {report.type}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-gray-700 font-medium">
                            {report.uploadedBy}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-gray-600">
                            {report.uploadedDate}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => viewReport(report)}
                              className="flex items-center gap-2 px-3 py-2 bg-[#0118D8]/5 text-[#0118D8] rounded-lg hover:bg-[#0118D8]/10 transition-colors text-sm font-medium border border-[#0118D8]/20"
                              title="View Report"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View
                            </button>
                            <button 
                              className="flex items-center gap-2 px-3 py-2 bg-[#4CAF50]/5 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/10 transition-colors text-sm font-medium border border-[#4CAF50]/20"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        )}
      </div>

      {/* Report View Modal */}
      {showReportModal && selectedReport && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ background: '#0F1ED115' }}>
                  <File className="w-5 h-5" style={{ color: '#0F1ED1' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: '#111827' }}>
                    {selectedReport.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Medical Report Details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Report Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg">
                  <div className="text-sm mb-1" style={{ color: '#6B7280' }}>Report Type</div>
                  <div className="font-semibold" style={{ color: '#111827' }}>{selectedReport.type}</div>
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg">
                  <div className="text-sm mb-1" style={{ color: '#6B7280' }}>Uploaded By</div>
                  <div className="font-semibold" style={{ color: '#111827' }}>{selectedReport.uploadedBy}</div>
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg">
                  <div className="text-sm mb-1" style={{ color: '#6B7280' }}>Upload Date</div>
                  <div className="font-semibold" style={{ color: '#111827' }}>{selectedReport.uploadedDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg">
                  <div className="text-sm mb-1" style={{ color: '#6B7280' }}>Status</div>
                  <div className="font-semibold" style={{ color: '#111827' }}>{selectedReport.status}</div>
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg">
                  <div className="text-sm mb-1" style={{ color: '#6B7280' }}>Priority</div>
                  <div className="font-semibold" style={{ color: '#111827' }}>{selectedReport.priority}</div>
                </div>
              </div>

              {/* Report Description */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                  Report Description
                </label>
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg">
                  <p style={{ color: '#111827' }}>{selectedReport.description}</p>
                </div>
              </div>

              {/* File Information */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                  Attached File
                </label>
                <div style={{ background: '#F9FAFB', border: '1px solid #ECEEF2' }} className="p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5" style={{ color: '#6B7280' }} />
                    <span className="font-medium" style={{ color: '#111827' }}>{selectedReport.fileName}</span>
                  </div>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                      color: '#ffffff',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
              </div>

              {/* Report Preview Section */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                  Report Preview
                </label>
                <div 
                  style={{ 
                    background: '#F9FAFB', 
                    border: '1px solid #ECEEF2',
                    minHeight: '200px'
                  }} 
                  className="p-4 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center">
                    <File className="w-12 h-12 mx-auto mb-3" style={{ color: '#9CA3AF' }} />
                    <p style={{ color: '#6B7280' }} className="text-sm">
                      Report preview will be displayed here
                    </p>
                    <p style={{ color: '#9CA3AF' }} className="text-xs mt-1">
                      PDF, Image, or Document viewer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t" style={{ borderColor: '#ECEEF2' }}>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6B728010';
                  e.target.style.borderColor = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Report
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vitals Modal */}
      {showVitalsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowVitalsModal(false)}
        >
          <div
            className="w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
              style={{
                background: '#ffffff',
                borderColor: '#ECEEF2',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ background: '#0F1ED115' }}>
                  <Activity className="w-5 h-5" style={{ color: '#0F1ED1' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: '#111827' }}>
                    Add Patient Vitals
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    Record current vital signs for {selectedAppointment.patientName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVitalsModal(false)}
                className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
                style={{
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '1px solid #ECEEF2',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0F1ED115';
                  e.target.style.borderColor = '#0F1ED1';
                  e.target.style.color = '#0F1ED1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#ECEEF2';
                  e.target.style.color = '#6B7280';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleVitalsSubmit(); }} className="p-6 space-y-6">
              {/* Cardiovascular Vitals */}
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
                  Cardiovascular
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      value={vitalsForm.bloodPressure}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, bloodPressure: e.target.value }))}
                      placeholder="e.g., 120/80"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={vitalsForm.heartRate}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="e.g., 72"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Respiratory Vitals */}
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
                  Respiratory
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Temperature (°F)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsForm.temperature}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="e.g., 98.6"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Oxygen Saturation (%)
                    </label>
                    <input
                      type="number"
                      value={vitalsForm.oxygenSaturation}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                      placeholder="e.g., 98"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Respiratory Rate (breaths/min)
                    </label>
                    <input
                      type="number"
                      value={vitalsForm.respiratoryRate}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                      placeholder="e.g., 16"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#ffffff',
                        border: '2px solid #ECEEF2',
                        color: '#111827',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0F1ED1';
                        e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ECEEF2';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Anthropometric Measurements */}
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
                  Anthropometric Measurements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Weight (kg)
                    </label>
                                         <input
                       type="number"
                       step="0.1"
                       value={vitalsForm.weight}
                       onChange={(e) => setVitalsForm(prev => ({ ...prev, weight: e.target.value }))}
                       placeholder="e.g., 70.5"
                       className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                       style={{
                         background: '#ffffff',
                         border: '2px solid #ECEEF2',
                         color: '#111827',
                         outline: 'none',
                       }}
                       onFocus={(e) => {
                         e.target.style.borderColor = '#0F1ED1';
                         e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                       }}
                       onBlur={(e) => {
                         e.target.style.borderColor = '#ECEEF2';
                         e.target.style.boxShadow = 'none';
                         calculateBMI();
                       }}
                     />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Height (cm)
                    </label>
                                         <input
                       type="number"
                       step="0.1"
                       value={vitalsForm.height}
                       onChange={(e) => setVitalsForm(prev => ({ ...prev, height: e.target.value }))}
                       placeholder="e.g., 170"
                       className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                       style={{
                         background: '#ffffff',
                         border: '2px solid #ECEEF2',
                         color: '#111827',
                         outline: 'none',
                       }}
                       onFocus={(e) => {
                         e.target.style.borderColor = '#0F1ED1';
                         e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                       }}
                       onBlur={(e) => {
                         e.target.style.borderColor = '#ECEEF2';
                         e.target.style.boxShadow = 'none';
                         calculateBMI();
                       }}
                     />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      BMI (kg/m²)
                    </label>
                    <input
                      type="text"
                      value={vitalsForm.bmi}
                      readOnly
                      placeholder="Auto-calculated"
                      className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2"
                      style={{
                        background: '#F9FAFB',
                        border: '2px solid #ECEEF2',
                        color: '#6B7280',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                  Additional Notes
                </label>
                <textarea
                  value={vitalsForm.notes}
                  onChange={(e) => setVitalsForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  placeholder="Any additional observations or notes about the patient's vital signs..."
                  className="w-full px-4 py-3 rounded-lg transition-all text-sm resize-none border-2"
                  style={{
                    background: '#ffffff',
                    border: '2px solid #ECEEF2',
                    color: '#111827',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0F1ED1';
                    e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ECEEF2';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: '#ECEEF2' }}>
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: '#ffffff',
                    color: '#6B7280',
                    border: '2px solid #ECEEF2',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#6B728010';
                    e.target.style.borderColor = '#6B7280';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#ECEEF2';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                    color: '#ffffff',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  Record Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;