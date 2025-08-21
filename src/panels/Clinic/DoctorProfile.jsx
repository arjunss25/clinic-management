"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"

import {
  FaPhone,
  FaExclamationTriangle,
  FaStethoscope,
  FaArrowLeft,
  FaEdit,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaSave,
  FaGraduationCap,
  FaHospital,
  FaClock,
} from "react-icons/fa"
import { MdEmail, MdLocationOn, MdDateRange, MdSecurity, MdWork } from "react-icons/md"

const DoctorProfile = () => {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("professional")
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSpecializationsEdit, setShowSpecializationsEdit] = useState(false)
  const [showQualificationsEdit, setShowQualificationsEdit] = useState(false)
  const [newSpecialization, setNewSpecialization] = useState("")
  const [newQualification, setNewQualification] = useState("")

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Edit form state
  const [editForm, setEditForm] = useState({})

  // Handle form changes
  const handleFormChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  // Save profile changes
  const saveProfile = () => {
    setDoctor((prev) => ({
      ...prev,
      ...editForm,
    }))
    setShowEditModal(false)
    alert("Profile updated successfully!")
  }

  const addSpecialization = () => {
    if (newSpecialization.trim() && !doctor.specializations.includes(newSpecialization.trim())) {
      setDoctor((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }))
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (index) => {
    setDoctor((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }))
  }

  const addQualification = () => {
    if (newQualification.trim() && !doctor.qualifications.includes(newQualification.trim())) {
      setDoctor((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }))
      setNewQualification("")
    }
  }

  const removeQualification = (index) => {
    setDoctor((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }))
  }

  const doctorsDatabase = {
    "DOC-2024-001": {
      id: "DOC-2024-001",
      name: "Dr. Sarah Johnson",
      age: 42,
      gender: "Female",
      email: "sarah.johnson@hospital.com",
      phone: "+1 (555) 123-4567",
      address: "123 Medical Center Drive, New York, NY 10001",
      licenseNumber: "NY-MD-123456",
      specializations: ["Cardiology", "Internal Medicine"],
      qualifications: [
        "MD - Harvard Medical School",
        "Board Certified Cardiologist",
        "Fellowship in Interventional Cardiology",
      ],
      experience: "15 years",
      hospital: "New York Presbyterian Hospital",
      department: "Cardiology Department",
      availableHours: "Mon-Fri: 9:00 AM - 5:00 PM",
      consultationFee: "$200",
      languages: ["English", "Spanish"],
      rating: 4.8,
      totalPatients: 1250,
      status: "Active",
    },
    "DOC-2024-002": {
      id: "DOC-2024-002",
      name: "Dr. Michael Chen",
      age: 38,
      gender: "Male",
      email: "michael.chen@hospital.com",
      phone: "+1 (555) 234-5678",
      address: "456 Healthcare Plaza, Los Angeles, CA 90210",
      licenseNumber: "CA-MD-789012",
      specializations: ["Neurology", "Neurosurgery"],
      qualifications: ["MD - Stanford Medical School", "PhD in Neuroscience", "Board Certified Neurologist"],
      experience: "12 years",
      hospital: "UCLA Medical Center",
      department: "Neurology Department",
      availableHours: "Mon-Thu: 8:00 AM - 6:00 PM",
      consultationFee: "$250",
      languages: ["English", "Mandarin"],
      rating: 4.9,
      totalPatients: 980,
      status: "Active",
    },
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const doctorData = doctorsDatabase[doctorId] || doctorsDatabase["DOC-2024-001"]
      setDoctor(doctorData)
      setEditForm(doctorData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [doctorId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctor profile...</p>
        </motion.div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The requested doctor profile could not be found.</p>
          <button
            onClick={() => navigate("/clinic/doctors")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Doctors List
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        className="bg-white border-b border-gray-200"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/clinic/doctors")}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
                <p className="text-gray-500 mt-1">Comprehensive medical professional information</p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Doctor Info */}
          <motion.div
            className="lg:col-span-1"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
              <div className="text-center mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FaStethoscope className="text-white text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
                <p className="text-blue-600 font-semibold text-lg">
                  {doctor.specializations?.[0] || "Medical Professional"}
                </p>
                <div className="flex items-center justify-center mt-3">
                  <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200">
                    {doctor.status}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50">
                  <MdEmail className="text-blue-500 text-xl" />
                  <span className="text-gray-700 font-medium">{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50">
                  <FaPhone className="text-green-500 text-xl" />
                  <span className="text-gray-700 font-medium">{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50">
                  <MdLocationOn className="text-red-500 text-xl" />
                  <span className="text-gray-700 font-medium">{doctor.address}</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50">
                  <FaHospital className="text-purple-500 text-xl" />
                  <span className="text-gray-700 font-medium">{doctor.hospital}</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50">
                  <MdSecurity className="text-orange-500 text-xl" />
                  <span className="text-gray-700 font-medium">License: {doctor.licenseNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Experience</span>
                  <span className="font-bold text-gray-900">{doctor.experience}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Rating</span>
                  <span className="font-bold text-gray-900">⭐ {doctor.rating}/5.0</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Total Patients</span>
                  <span className="font-bold text-gray-900">{doctor.totalPatients}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Consultation Fee</span>
                  <span className="font-bold text-green-600">{doctor.consultationFee}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Tabs */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
              <div className="border-b border-gray-100">
                <nav className="flex space-x-8 px-8 py-2">
                  {[
                    { id: "professional", label: "Professional Info", icon: FaStethoscope },
                    { id: "schedule", label: "Schedule & Availability", icon: FaCalendarAlt },
                    { id: "qualifications", label: "Qualifications", icon: FaGraduationCap },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon className="text-lg" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "professional" && (
                    <motion.div
                      key="professional"
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div variants={containerVariants} className="space-y-8">
                        {/* Specializations */}
                        <motion.div
                          variants={cardVariants}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center text-lg">
                              <FaStethoscope className="mr-3 text-blue-500 text-xl" />
                              Specializations
                            </h4>
                            <button
                              onClick={() => setShowSpecializationsEdit(!showSpecializationsEdit)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                            >
                              <FaEdit />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {doctor.specializations?.map((spec, index) => (
                              <motion.span
                                key={index}
                                variants={itemVariants}
                                className="bg-white text-blue-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center shadow-sm border border-blue-200"
                              >
                                {spec}
                                {showSpecializationsEdit && (
                                  <button
                                    onClick={() => removeSpecialization(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <FaTimes className="text-xs" />
                                  </button>
                                )}
                              </motion.span>
                            ))}
                          </div>
                          {showSpecializationsEdit && (
                            <div className="mt-4 flex space-x-3">
                              <input
                                type="text"
                                value={newSpecialization}
                                onChange={(e) => setNewSpecialization(e.target.value)}
                                placeholder="Add new specialization"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={addSpecialization}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          )}
                        </motion.div>

                        {/* Department & Hospital */}
                        <motion.div
                          variants={cardVariants}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                        >
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                            <FaHospital className="mr-3 text-green-500 text-xl" />
                            Hospital & Department
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-100">
                              <span className="text-gray-600 font-medium">Hospital:</span>
                              <span className="font-bold text-gray-900">{doctor.hospital}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-100">
                              <span className="text-gray-600 font-medium">Department:</span>
                              <span className="font-bold text-gray-900">{doctor.department}</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Languages */}
                        <motion.div
                          variants={cardVariants}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100"
                        >
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                            <MdWork className="mr-3 text-purple-500 text-xl" />
                            Languages Spoken
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {doctor.languages?.map((language, index) => (
                              <span
                                key={index}
                                className="bg-white text-purple-800 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-purple-200"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === "schedule" && (
                    <motion.div
                      key="schedule"
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div variants={containerVariants} className="space-y-8">
                        <motion.div
                          variants={cardVariants}
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
                        >
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                            <FaClock className="mr-3 text-blue-500 text-xl" />
                            Available Hours
                          </h4>
                          <p className="text-gray-700 text-xl font-semibold bg-white p-4 rounded-xl border border-blue-100">
                            {doctor.availableHours}
                          </p>
                        </motion.div>

                        <motion.div
                          variants={cardVariants}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                        >
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                            <MdDateRange className="mr-3 text-green-500 text-xl" />
                            Consultation Information
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-100">
                              <span className="text-gray-600 font-medium">Consultation Fee:</span>
                              <span className="font-bold text-green-600 text-lg">{doctor.consultationFee}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-100">
                              <span className="text-gray-600 font-medium">Average Rating:</span>
                              <span className="font-bold text-gray-900">⭐ {doctor.rating}/5.0</span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === "qualifications" && (
                    <motion.div
                      key="qualifications"
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div variants={containerVariants} className="space-y-8">
                        <motion.div
                          variants={cardVariants}
                          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center text-lg">
                              <FaGraduationCap className="mr-3 text-indigo-500 text-xl" />
                              Education & Certifications
                            </h4>
                            <button
                              onClick={() => setShowQualificationsEdit(!showQualificationsEdit)}
                              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                            >
                              <FaEdit />
                            </button>
                          </div>
                          <div className="space-y-3">
                            {doctor.qualifications?.map((qualification, index) => (
                              <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white p-4 rounded-xl border border-indigo-100 flex items-center justify-between shadow-sm"
                              >
                                <span className="text-gray-700 font-medium">{qualification}</span>
                                {showQualificationsEdit && (
                                  <button
                                    onClick={() => removeQualification(index)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                                  >
                                    <FaTimes />
                                  </button>
                                )}
                              </motion.div>
                            ))}
                          </div>
                          {showQualificationsEdit && (
                            <div className="mt-4 flex space-x-3">
                              <input
                                type="text"
                                value={newQualification}
                                onChange={(e) => setNewQualification(e.target.value)}
                                placeholder="Add new qualification"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                              <button
                                onClick={addQualification}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Edit Doctor Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone || ""}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    value={editForm.licenseNumber || ""}
                    onChange={(e) => handleFormChange("licenseNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital</label>
                  <input
                    type="text"
                    value={editForm.hospital || ""}
                    onChange={(e) => handleFormChange("hospital", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={editForm.department || ""}
                    onChange={(e) => handleFormChange("department", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={editForm.address || ""}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 font-semibold shadow-sm"
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DoctorProfile
