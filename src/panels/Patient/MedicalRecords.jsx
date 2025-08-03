import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFileMedical,
  FaUpload,
  FaDownload,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaUserMd,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFilter,
  FaTimes,
  FaInfoCircle,
  FaCheckCircle,
  FaEye,
} from 'react-icons/fa';

// Modernized theme colors (reduced beige/off-white usage)
const COLORS = {
  primary: '#0F1ED1', // refined deep blue
  primaryDark: '#0B18A8',
  secondary: '#1B56FD',
  white: '#ffffff',
  background: '#F7F8FA', // light neutral app background
  surface: '#ffffff',
  border: '#ECEEF2',
  text: '#111827',
  textMuted: '#6B7280',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#d97706',
  warningBg: '#FEF3C7',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  infoBg: '#EEF2FF',
  info: '#4F46E5',
  gray50: '#F9FAFB',
};

const MedicalRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      title: 'General Checkup Report',
      doctor: 'Dr. John Doe',
      department: 'Internal Medicine',
      date: '2024-03-15',
      type: 'PDF',
      size: '2.4 MB',
      category: 'Checkup',
      notes: 'Annual physical examination.',
      isRecent: true,
    },
    {
      id: 2,
      title: 'Blood Test Results',
      doctor: 'City Hospital Lab',
      department: 'Laboratory',
      date: '2024-03-01',
      type: 'PDF',
      size: '1.8 MB',
      category: 'Lab Results',
      notes: 'Cholesterol levels slightly elevated.',
    },
    {
      id: 3,
      title: 'X-Ray Report',
      doctor: 'Radiology Department',
      department: 'Radiology',
      date: '2024-02-15',
      type: 'PDF',
      size: '3.1 MB',
      category: 'Imaging',
      notes: 'Chest X-ray shows clear lung fields.',
    },
    {
      id: 4,
      title: 'MRI Scan Results',
      doctor: 'Dr. Sarah Johnson',
      department: 'Radiology',
      date: '2024-01-28',
      type: 'PDF',
      size: '5.2 MB',
      category: 'Imaging',
      notes: 'Requested for knee pain follow-up.',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    title: '',
    doctor: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    'All',
    'Checkup',
    'Lab Results',
    'Imaging',
    'Prescription',
    'Vaccination',
    'Other',
  ];
  const departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Radiology',
    'Laboratory',
    'Dermatology',
    'Other',
  ];
  const doctors = [
    'Dr. John Doe',
    'Dr. Emily Chen',
    'Dr. Sarah Martinez',
    'Dr. James Wilson',
    'City Hospital Lab',
    'Radiology Department',
    'Other',
  ];

  const filteredRecords = records.filter((record) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      record.title.toLowerCase().includes(q) ||
      record.doctor.toLowerCase().includes(q) ||
      record.department.toLowerCase().includes(q);
    const matchesCategory =
      filterCategory === 'All' || record.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Motion helpers
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };
  const cardHover = { y: -2, transition: { duration: 0.2 } };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({
        ...prev,
        file,
        title: file.name.replace(/\.[^/.]+$/, ''),
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!uploadForm.file) errors.file = 'File is required';
    if (!uploadForm.title.trim()) errors.title = 'Title is required';
    if (!uploadForm.doctor.trim())
      errors.doctor = 'Doctor/Provider is required';
    if (!uploadForm.department.trim())
      errors.department = 'Department is required';
    if (!uploadForm.date) errors.date = 'Date is required';
    if (!uploadForm.category) errors.category = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsUploading(true);
      setIsModalOpen(false);

      setTimeout(() => {
        const newRecord = {
          id: records.length + 1,
          title: uploadForm.title,
          doctor: uploadForm.doctor,
          department: uploadForm.department,
          date: uploadForm.date,
          type: uploadForm.file
            ? uploadForm.file.name.split('.').pop().toUpperCase()
            : 'FILE',
          size: uploadForm.file
            ? `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`
            : '',
          category: uploadForm.category,
          notes: uploadForm.notes,
          isRecent: true,
        };
        setRecords([newRecord, ...records]);
        setIsUploading(false);
        setUploadForm({
          file: null,
          title: '',
          doctor: '',
          department: '',
          date: new Date().toISOString().split('T')[0],
          category: 'Other',
          notes: '',
        });
        setFormErrors({});
      }, 1200);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FaFilePdf className="w-5 h-5 text-red-500" />;
      case 'JPG':
      case 'PNG':
      case 'GIF':
      case 'JPEG':
        return <FaFileImage className="w-5 h-5 text-green-500" />;
      default:
        return (
          <FaFileAlt className="w-5 h-5" style={{ color: COLORS.primary }} />
        );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadForm({
      file: null,
      title: '',
      doctor: '',
      department: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Other',
      notes: '',
    });
    setFormErrors({});
  };

  const getCategoryColor = (category) => {
    const colors = {
      Checkup: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      'Lab Results': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
      Imaging: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
      Prescription: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      Vaccination: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
      Other: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="space-y-2">
            <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
              Medical Records
            </h1>
            <p className="text-gray-600">
              Manage and access all your medical documents securely
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-sm font-medium shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                color: COLORS.white,
              }}
            >
              <FaUpload className="w-4 h-4" />
              Upload Record
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: FaFileMedical,
              label: 'Total Records',
              value: records.length,
              bgIcon: 'bg-emerald-50',
              iconColor: 'text-emerald-600',
              bar: 'from-emerald-500 to-emerald-600',
            },
            {
              icon: FaCalendarAlt,
              label: 'Recent (Last 30 days)',
              value: records.filter((r) => {
                const recordDate = new Date(r.date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return recordDate >= thirtyDaysAgo;
              }).length,
              bgIcon: 'bg-indigo-50',
              iconColor: 'text-indigo-600',
              bar: 'from-indigo-500 to-indigo-600',
            },
            {
              icon: FaUserMd,
              label: 'Providers',
              value: new Set(records.map((r) => r.doctor)).size,
              bgIcon: 'bg-amber-50',
              iconColor: 'text-amber-600',
              bar: 'from-amber-500 to-amber-600',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl p-5 shadow-sm transition"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgIcon}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div
                className={`mt-4 h-1 bg-gradient-to-r ${stat.bar} rounded-full`}
              />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, doctor, or department..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl transition"
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    color: COLORS.text,
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                className="px-3 py-2.5 rounded-xl transition"
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  color: COLORS.text,
                }}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Uploading banner */}
        <AnimatePresence>
          {isUploading && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
              style={{
                background: COLORS.infoBg,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="font-medium" style={{ color: COLORS.primary }}>
                  Uploading your medical record...
                </p>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Please wait while we process your file
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Records List */}
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              background: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Your Medical Records
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                  {filteredRecords.length} records found
                </p>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: COLORS.textMuted }}
              >
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                <span>All files secured</span>
              </div>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: COLORS.border }}>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <div
                  key={record.id}
                  className="p-6 transition-colors"
                  style={{ background: COLORS.surface }}
                >
                  {record.isRecent && (
                    <div
                      className="absolute top-4 right-4 px-2 py-1 text-white text-[11px] font-medium rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    >
                      New
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                        style={{
                          background: COLORS.gray50,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        {getFileIcon(record.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className="font-semibold text-[1.05rem]"
                            style={{ color: COLORS.text }}
                          >
                            {record.title}
                          </h4>
                        </div>
                        <div
                          className="flex flex-wrap items-center gap-4 text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          <span className="flex items-center gap-2">
                            <FaUserMd style={{ color: COLORS.primary }} />
                            <span
                              className="font-medium"
                              style={{ color: COLORS.text }}
                            >
                              {record.doctor}
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <FaCalendarAlt style={{ color: COLORS.primary }} />
                            <span>{formatDate(record.date)}</span>
                          </span>
                          <span className="hidden md:inline text-gray-400">
                            •
                          </span>
                          <span className="hidden md:inline">
                            {record.department}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold ${getCategoryColor(
                              record.category
                            )}`}
                          >
                            {record.category}
                          </span>
                          <span
                            className="px-2.5 py-1.5 rounded-md text-xs font-medium"
                            style={{
                              background: COLORS.gray50,
                              color: COLORS.textMuted,
                              border: `1px solid ${COLORS.border}`,
                            }}
                          >
                            {record.type} • {record.size}
                          </span>
                        </div>

                        {record.notes && (
                          <div
                            className="flex items-start gap-2 p-3 rounded-xl"
                            style={{
                              background: COLORS.infoBg,
                              border: `1px solid ${COLORS.border}`,
                            }}
                          >
                            <FaInfoCircle
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: COLORS.primary }}
                            />
                            <p
                              className="text-sm"
                              style={{ color: COLORS.text }}
                            >
                              {record.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="p-2.5 rounded-xl transition flex items-center justify-center"
                        style={{
                          background: COLORS.white,
                          color: COLORS.primary,
                          border: `1px solid ${COLORS.border}`,
                        }}
                        title="View"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2.5 rounded-xl transition flex items-center justify-center"
                        style={{
                          background: COLORS.white,
                          color: COLORS.secondary,
                          border: `1px solid ${COLORS.border}`,
                        }}
                        title="Download"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2.5 rounded-xl transition flex items-center justify-center"
                        style={{
                          background: COLORS.white,
                          color: COLORS.danger,
                          border: `1px solid ${COLORS.border}`,
                        }}
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div
                  className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                  style={{
                    background: COLORS.gray50,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <FaFileMedical className="w-8 h-8 text-gray-400" />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  No records found
                </h3>
                <p className="mt-1" style={{ color: COLORS.textMuted }}>
                  {searchTerm || filterCategory !== 'All'
                    ? 'Try adjusting your search or filters'
                    : "You haven't uploaded any medical records yet"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{
                background: 'rgba(15, 23, 42, 0.35)',
                backdropFilter: 'saturate(140%) blur(6px)',
              }}
              onClick={closeModal}
            >
              <div
                className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="px-6 py-4 border-b flex items-center justify-between"
                  style={{
                    background: COLORS.white,
                    borderColor: COLORS.border,
                  }}
                >
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    Upload Medical Record
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-9 h-9 rounded-xl transition flex items-center justify-center"
                    style={{
                      background: COLORS.white,
                      color: COLORS.textMuted,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: COLORS.text }}
                    >
                      Select File <span className="text-red-500">*</span>
                    </label>
                    <label
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                        ${
                          formErrors.file
                            ? 'border-red-300 bg-red-50'
                            : `border-gray-300 ${COLORS.gray50}`
                        }`}
                    >
                      {uploadForm.file ? (
                        <div className="flex flex-col items-center">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                            style={{
                              background: `${COLORS.primary}10`,
                            }}
                          >
                            <FaFileAlt
                              className="w-6 h-6"
                              style={{ color: COLORS.primary }}
                            />
                          </div>
                          <p
                            className="text-sm font-medium truncate max-w-[90%]"
                            style={{ color: COLORS.text }}
                          >
                            {uploadForm.file.name}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: COLORS.textMuted }}
                          >
                            {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                            style={{
                              background: `${COLORS.primary}20`,
                            }}
                          >
                            <FaUpload
                              className="w-5 h-5"
                              style={{ color: COLORS.primary }}
                            />
                          </div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: COLORS.text }}
                          >
                            Upload File
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: COLORS.textMuted }}
                          >
                            PDF, PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                    {formErrors.file && (
                      <p className="text-red-500 text-sm">{formErrors.file}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium"
                      style={{ color: COLORS.text }}
                    >
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl transition"
                      style={{
                        background: COLORS.white,
                        border: `1px solid ${
                          formErrors.title ? '#DC2626' : COLORS.border
                        }`,
                        outline: 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        color: COLORS.text,
                      }}
                      placeholder="e.g., Annual Checkup Report"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Row: Date & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium"
                        style={{ color: COLORS.text }}
                      >
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={uploadForm.date}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl transition"
                        style={{
                          background: COLORS.white,
                          border: `1px solid ${
                            formErrors.date ? '#DC2626' : COLORS.border
                          }`,
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          color: COLORS.text,
                        }}
                      />
                      {formErrors.date && (
                        <p className="text-red-500 text-sm">
                          {formErrors.date}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium"
                        style={{ color: COLORS.text }}
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={uploadForm.category}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl transition"
                        style={{
                          background: COLORS.white,
                          border: `1px solid ${
                            formErrors.category ? '#DC2626' : COLORS.border
                          }`,
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          color: COLORS.text,
                        }}
                      >
                        {categories
                          .filter((c) => c !== 'All')
                          .map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                      {formErrors.category && (
                        <p className="text-red-500 text-sm">
                          {formErrors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row: Doctor & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="doctor"
                        className="block text-sm font-medium"
                        style={{ color: COLORS.text }}
                      >
                        Doctor/Provider <span className="text-red-500">*</span>
                      </label>
                      <input
                        list="doctor-list"
                        id="doctor"
                        name="doctor"
                        value={uploadForm.doctor}
                        onChange={handleInputChange}
                        placeholder="Select or type a name"
                        className="w-full px-3.5 py-2.5 rounded-xl transition"
                        style={{
                          background: COLORS.white,
                          border: `1px solid ${
                            formErrors.doctor ? '#DC2626' : COLORS.border
                          }`,
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          color: COLORS.text,
                        }}
                      />
                      <datalist id="doctor-list">
                        {doctors.map((d) => (
                          <option key={d} value={d} />
                        ))}
                      </datalist>
                      {formErrors.doctor && (
                        <p className="text-red-500 text-sm">
                          {formErrors.doctor}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium"
                        style={{ color: COLORS.text }}
                      >
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        list="dept-list"
                        id="department"
                        name="department"
                        value={uploadForm.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Radiology"
                        className="w-full px-3.5 py-2.5 rounded-xl transition"
                        style={{
                          background: COLORS.white,
                          border: `1px solid ${
                            formErrors.department ? '#DC2626' : COLORS.border
                          }`,
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          color: COLORS.text,
                        }}
                      />
                      <datalist id="dept-list">
                        {departments.map((d) => (
                          <option key={d} value={d} />
                        ))}
                      </datalist>
                      {formErrors.department && (
                        <p className="text-red-500 text-sm">
                          {formErrors.department}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium"
                      style={{ color: COLORS.text }}
                    >
                      Notes{' '}
                      <span style={{ color: COLORS.textMuted }}>
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={uploadForm.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl transition resize-none"
                      style={{
                        background: COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                        outline: 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        color: COLORS.text,
                      }}
                      placeholder="Add any relevant notes about this document..."
                    />
                  </div>

                  {/* Actions */}
                  <div
                    className="flex gap-3 pt-4"
                    style={{ borderTop: `1px solid ${COLORS.border}` }}
                  >
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 rounded-xl font-medium transition"
                      style={{
                        background: COLORS.gray50,
                        color: COLORS.text,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="flex-1 py-2.5 rounded-xl font-medium text-white shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="w-4 h-4" />
                          Upload Record
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicalRecords;
