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
  FaEye
} from 'react-icons/fa';
import { FaWeightScale } from "react-icons/fa6";

const MedicalRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      title: "General Checkup Report",
      doctor: "Dr. John Doe",
      department: "Internal Medicine",
      date: "2024-03-15",
      type: "PDF",
      size: "2.4 MB",
      category: "Checkup",
      notes: "Annual physical examination.",
      isRecent: true
    },
    {
      id: 2,
      title: "Blood Test Results",
      doctor: "City Hospital Lab",
      department: "Laboratory",
      date: "2024-03-01",
      type: "PDF",
      size: "1.8 MB",
      category: "Lab Results",
      notes: "Cholesterol levels slightly elevated."
    },
    {
      id: 3,
      title: "X-Ray Report",
      doctor: "Radiology Department",
      department: "Radiology",
      date: "2024-02-15",
      type: "PDF",
      size: "3.1 MB",
      category: "Imaging",
      notes: "Chest X-ray shows clear lung fields."
    },
    {
      id: 4,
      title: "MRI Scan Results",
      doctor: "Dr. Sarah Johnson",
      department: "Radiology",
      date: "2024-01-28",
      type: "PDF",
      size: "5.2 MB",
      category: "Imaging",
      notes: "Requested for knee pain follow-up."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    title: '',
    doctor: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = ["All", "Checkup", "Lab Results", "Imaging", "Prescription", "Vaccination", "Other"];
  const departments = ["General Medicine", "Cardiology", "Orthopedics", "Pediatrics", "Radiology", "Laboratory", "Dermatology", "Other"];
  const doctors = ["Dr. John Doe", "Dr. Emily Chen", "Dr. Sarah Martinez", "Dr. James Wilson", "City Hospital Lab", "Radiology Department", "Other"];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || record.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        file: file,
        title: file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!uploadForm.file) errors.file = "File is required";
    if (!uploadForm.title.trim()) errors.title = "Title is required";
    if (!uploadForm.doctor.trim()) errors.doctor = "Doctor/Provider is required";
    if (!uploadForm.department.trim()) errors.department = "Department is required";
    if (!uploadForm.date) errors.date = "Date is required";
    if (!uploadForm.category) errors.category = "Category is required";
    
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
          type: uploadForm.file.name.split('.').pop().toUpperCase(),
          size: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
          category: uploadForm.category,
          notes: uploadForm.notes,
          isRecent: true
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
          notes: ''
        });
        setFormErrors({});
      }, 1500);
    }
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF': return <FaFilePdf className="w-5 h-5 text-red-500" />;
      case 'JPG': case 'PNG': case 'GIF': case 'JPEG': return <FaFileImage className="w-5 h-5 text-green-500" />;
      default: return <FaFileAlt className="w-5 h-5 text-[#1B56FD]" />;
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
      notes: ''
    });
    setFormErrors({});
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Checkup': 'bg-blue-100 text-blue-800 border-blue-200',
      'Lab Results': 'bg-green-100 text-green-800 border-green-200',
      'Imaging': 'bg-purple-100 text-purple-800 border-purple-200',
      'Prescription': 'bg-orange-100 text-orange-800 border-orange-200',
      'Vaccination': 'bg-teal-100 text-teal-800 border-teal-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0118D8] to-[#1B56FD] bg-clip-text text-transparent">
            Medical Records
          </h1>
          <p className="text-gray-600 text-lg">Manage and access all your medical documents securely</p>
        </div>
        
        <motion.button 
  whileHover={{ y: -2 }} // Subtle upward movement on hover
  whileTap={{ scale: 0.98 }} // Slight scale down on tap
  onClick={() => setIsModalOpen(true)}
  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white rounded-lg hover:from-[#0115c0] hover:to-[#184fdb] transition-all duration-200 font-medium text-sm"
>
  <FaUpload className="w-4 h-4" /> 
  <span>Upload Record</span>
</motion.button>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: FaFileMedical,
            label: "Total Records",
            value: records.length,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
          },
          {
            icon: FaCalendarAlt,
            label: "Recent Records",
            value: records.filter(r => {
              const recordDate = new Date(r.date);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return recordDate >= thirtyDaysAgo;
            }).length,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
          },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[#E9DFC3] hover:border-[#1B56FD]/30 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className={`mt-4 h-1 bg-gradient-to-r ${stat.color} rounded-full`}></div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Filters and Search */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E9DFC3] rounded-xl focus:ring-2 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-all duration-300 text-gray-700 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 min-w-0 lg:min-w-[180px]">
            <FaFilter className="text-gray-500 w-4 h-4 flex-shrink-0" />
            <select
              className="flex-1 px-3 py-2.5 border border-[#E9DFC3] rounded-xl focus:ring-2 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-all duration-300 text-gray-700 bg-white text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Upload Status */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm"
          >
            <div className="w-8 h-8 border-3 border-[#1B56FD] border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-[#0118D8] font-semibold">Uploading your medical record...</p>
              <p className="text-blue-600 text-sm">Please wait while we process your file</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Records List */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-[#E9DFC3] overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-[#E9DFC3] bg-gradient-to-r from-[#FFF8F8] to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">Your Medical Records</h3>
              <p className="text-gray-600 mt-1">{filteredRecords.length} records found</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaCheckCircle className="w-4 h-4 text-green-500" />
              <span>All files secured</span>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-[#E9DFC3]">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 hover:bg-gradient-to-r hover:from-[#FFF8F8] hover:to-white transition-all duration-300 group relative"
              >
                {record.isRecent && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white text-xs font-medium rounded-full">
                    New
                  </div>
                )}
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm">
                      {getFileIcon(record.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{record.title}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <FaUserMd className="w-4 h-4 text-[#1B56FD]" />
                            <span className="font-medium">{record.doctor}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4 text-[#1B56FD]" />
                            <span>{formatDate(record.date)}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getCategoryColor(record.category)}`}>
                          {record.category}
                        </span>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {record.type} • {record.size}
                        </span>
                      </div>
                      
                      {record.notes && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border-l-4 border-[#1B56FD]">
                          <FaInfoCircle className="w-4 h-4 text-[#1B56FD] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-[#0118D8] hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
                      title="View"
                    >
                      <FaEye className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-[#1B56FD] hover:bg-purple-50 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200"
                      title="Download"
                    >
                      <FaDownload className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaFileMedical className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || filterCategory !== "All" 
                  ? "Try adjusting your search criteria or filter settings" 
                  : "Upload your first medical record to get started"}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Enhanced Upload Modal */}
      <AnimatePresence>
  {isModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-500 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }} // Smoother animation
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E9DFC3]" // Changed rounded, max-w, border
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Simplified */}
        <div className="px-6 py-4 border-b border-[#E9DFC3] flex justify-between items-center bg-[#FFF8F8]/30"> {/* Softer background */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900"> {/* Smaller title */}
              Upload Medical Record
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} // Simplified hover
            whileTap={{ scale: 0.95 }}  // Simplified tap
            onClick={closeModal}
            className="p-1.5 text-gray-500 hover:bg-[#E9DFC3]/50 rounded-lg transition-colors" // Softer button
          >
            <FaTimes className="w-4 h-4" /> {/* Smaller icon */}
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5"> {/* Adjusted padding and spacing */}
          {/* Enhanced File Upload Area - Refined */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select File <span className="text-red-500">*</span>
            </label>
            <motion.label
              whileHover={{ borderColor: "#1B56FD" }} // Subtle hover effect
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E9DFC3] rounded-xl cursor-pointer transition-colors bg-[#FFF8F8]/50" // Softer colors, consistent rounding
            >
              {uploadForm.file ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-[#0118D8]/10 rounded-lg flex items-center justify-center mb-2"> {/* Softer blue background */}
                    <FaFileAlt className="w-6 h-6 text-[#0118D8]" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-full px-2">{uploadForm.file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#E9DFC3]/50 rounded-lg flex items-center justify-center mb-2"> {/* Warm beige background */}
                    <FaUpload className="w-5 h-5 text-[#1B56FD]" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-0.5">Upload File</p> {/* Smaller text */}
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p> {/* Smaller hint */}
                </div>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </motion.label>
            {formErrors.file && <p className="text-red-500 text-sm">{formErrors.file}</p>}
          </div>

          {/* Form Fields - Adjusted spacing and styling */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={uploadForm.title}
                onChange={handleInputChange}
                className={`w-full px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-colors ${
                  formErrors.title ? 'border-red-500 bg-red-50' : 'border-[#E9DFC3] bg-white'
                }`} // Slightly smaller padding, consistent border/rounded
                placeholder="e.g., Annual Checkup Report"
              />
              {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
            </div>

            {/* Date & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={uploadForm.date}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-colors ${
                    formErrors.date ? 'border-red-500 bg-red-50' : 'border-[#E9DFC3] bg-white'
                  }`}
                />
                {formErrors.date && <p className="text-red-500 text-sm">{formErrors.date}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={uploadForm.category}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:16px_16px] ${ // Custom arrow
                    formErrors.category ? 'border-red-500 bg-red-50' : 'border-[#E9DFC3] bg-white'
                  }`}
                >
                  {categories.filter(c => c !== "All").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={uploadForm.notes}
              onChange={handleInputChange}
              rows={3} // Slightly smaller
              className="w-full px-3.5 py-2.5 border border-[#E9DFC3] rounded-lg focus:ring-2 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-colors resize-none"
              placeholder="Add any relevant notes about this document..."
            />
          </div>

          {/* Action Buttons - Refined */}
          <div className="flex justify-end gap-3">
            <motion.button
              whileHover={{ y: -1 }} // Subtle lift
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 border border-[#E9DFC3] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isUploading}
              className="px-4 py-2.5 bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white rounded-lg hover:from-[#0115c0] hover:to-[#184fdb] transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div>
  );
};

export default MedicalRecords;
