import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHospital,
  FaUserMd,
  FaUserNurse,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaSearch,
} from 'react-icons/fa';

const Approvals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const pendingApprovals = [
    {
      id: 'AP-001',
      type: 'clinic',
      name: 'Downtown Medical Group',
      location: 'Chicago, IL',
      submittedBy: 'Dr. Michael Brown',
      submittedDate: '2024-03-15',
    },
    {
      id: 'AP-002',
      type: 'doctor',
      name: 'Dr. Jennifer Lee',
      specialization: 'Neurology',
      clinic: 'City Medical Center',
      submittedDate: '2024-03-14',
    },
    {
      id: 'AP-003',
      type: 'staff',
      name: 'Nurse Robert Johnson',
      role: 'Registered Nurse',
      clinic: 'Heart Care Clinic',
      submittedDate: '2024-03-13',
    },
  ];

  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesSearch = approval.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || approval.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'clinic':
        return <FaHospital className="w-5 h-5 text-blue-600" />;
      case 'doctor':
        return <FaUserMd className="w-5 h-5 text-green-600" />;
      case 'staff':
        return <FaUserNurse className="w-5 h-5 text-purple-600" />;
      default:
        return <FaEye className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleApprove = (approvalId) => {
    console.log('Approved:', approvalId);
  };

  const handleReject = (approvalId) => {
    console.log('Rejected:', approvalId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600">Review and manage registration requests</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {pendingApprovals.length} Pending
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="clinic">Clinic</option>
            <option value="doctor">Doctor</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <motion.div
            key={approval.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    {getTypeIcon(approval.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{approval.name}</h3>
                    <p className="text-sm text-gray-600">
                      {approval.type === 'clinic' && approval.location}
                      {approval.type === 'doctor' && approval.specialization}
                      {approval.type === 'staff' && approval.role}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {approval.submittedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(approval.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(approval.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredApprovals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaCheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
          <p className="text-gray-600">All registration requests have been processed.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Approvals;
