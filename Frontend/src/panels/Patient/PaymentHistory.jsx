import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaHospital,
  FaUserMd,
} from 'react-icons/fa';
import { MdPayment, MdReceipt, MdAccountBalance } from 'react-icons/md';

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const cardHover = { 
    y: -4, 
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' } 
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  // Sample payment data
  const payments = [
    {
      id: 'PAY-2024-001',
      date: '2024-03-15',
      amount: 150.00,
      status: 'completed',
      method: 'credit_card',
      description: 'Annual Checkup & Consultation',
      doctor: 'Dr. Emily Chen',
      department: 'General Medicine',
      invoiceNumber: 'INV-2024-0892',
      cardLast4: '4242',
      transactionId: 'TXN-789456123',
      insuranceCoverage: 120.00,
      patientResponsibility: 30.00,
      notes: 'Insurance covered 80% of the visit cost'
    },
    {
      id: 'PAY-2024-002',
      date: '2024-02-28',
      amount: 85.50,
      status: 'completed',
      method: 'insurance',
      description: 'Follow-up Consultation',
      doctor: 'Dr. Sarah Martinez',
      department: 'Cardiology',
      invoiceNumber: 'INV-2024-0756',
      insuranceCoverage: 85.50,
      patientResponsibility: 0.00,
      notes: 'Fully covered by insurance'
    },
    {
      id: 'PAY-2024-003',
      date: '2024-02-15',
      amount: 200.00,
      status: 'pending',
      method: 'bank_transfer',
      description: 'Blood Tests & Lab Work',
      doctor: 'Dr. Michael Rodriguez',
      department: 'Laboratory',
      invoiceNumber: 'INV-2024-0689',
      insuranceCoverage: 160.00,
      patientResponsibility: 40.00,
      notes: 'Awaiting insurance approval'
    },
    {
      id: 'PAY-2024-004',
      date: '2024-01-30',
      amount: 75.00,
      status: 'completed',
      method: 'cash',
      description: 'Prescription Refill',
      doctor: 'Dr. Emily Chen',
      department: 'Pharmacy',
      invoiceNumber: 'INV-2024-0543',
      insuranceCoverage: 60.00,
      patientResponsibility: 15.00,
      notes: 'Co-pay for medication'
    },
    {
      id: 'PAY-2024-005',
      date: '2024-01-15',
      amount: 300.00,
      status: 'failed',
      method: 'credit_card',
      description: 'Specialist Consultation',
      doctor: 'Dr. James Wilson',
      department: 'Neurology',
      invoiceNumber: 'INV-2024-0432',
      insuranceCoverage: 240.00,
      patientResponsibility: 60.00,
      notes: 'Payment declined - insufficient funds'
    }
  ];

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [searchTerm, filterStatus, filterMethod]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completed = payments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
    const failed = payments.filter(p => p.status === 'failed').reduce((sum, payment) => sum + payment.amount, 0);
    
    return { total, completed, pending, failed };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'failed': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <FaCreditCard className="text-blue-500" />;
      case 'bank_transfer': return <MdAccountBalance className="text-green-500" />;
      case 'cash': return <FaMoneyBillWave className="text-green-600" />;
      case 'insurance': return <MdReceipt className="text-purple-500" />;
      default: return <MdPayment className="text-gray-500" />;
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      case 'insurance': return 'Insurance';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
      >
        <div className="space-y-2">
          <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
            Payment History
          </h1>
          <p className="text-gray-600">
            Track all your medical payments, insurance claims, and billing information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaDownload className="text-sm" />
            Export History
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      {/* <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">${summary.total.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <MdPayment className="text-2xl text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">${summary.completed.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${summary.pending.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">${summary.failed.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
          </div>
        </motion.div>
      </motion.div> */}

      {/* Filters and Search */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments, doctors, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Payment List */}
      <motion.div
        variants={containerVariants}
        className="space-y-4"
      >
        {filteredPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            variants={itemVariants}
            whileHover={cardHover}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
            onClick={() => openPaymentDetails(payment)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getMethodIcon(payment.method)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaUserMd className="text-gray-400" />
                      <span>{payment.doctor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHospital className="text-gray-400" />
                      <span>{payment.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{formatDate(payment.date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Invoice: {payment.invoiceNumber}</span>
                    <span className="text-gray-500">ID: {payment.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{getMethodLabel(payment.method)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Insurance: ${payment.insuranceCoverage.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    You pay: ${payment.patientResponsibility.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

             {/* Payment Details Modal */}
       <AnimatePresence>
         {showPaymentDetails && selectedPayment && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-[9999]"
             onClick={() => setShowPaymentDetails(false)}
           >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Payment Header */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        {getMethodIcon(selectedPayment.method)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedPayment.description}</h3>
                        <p className="text-gray-600">{selectedPayment.doctor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">${selectedPayment.amount.toFixed(2)}</p>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedPayment.status)}`}>
                        {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Payment Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-medium">{selectedPayment.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="font-medium">{selectedPayment.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedPayment.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">{getMethodLabel(selectedPayment.method)}</span>
                      </div>
                      {selectedPayment.cardLast4 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card:</span>
                          <span className="font-medium">•••• {selectedPayment.cardLast4}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Service Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedPayment.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{selectedPayment.doctor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance Coverage:</span>
                        <span className="font-medium text-green-600">${selectedPayment.insuranceCoverage.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Responsibility:</span>
                        <span className="font-medium text-blue-600">${selectedPayment.patientResponsibility.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedPayment.notes && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedPayment.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaDownload className="text-sm" />
                    Download Receipt
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaEye className="text-sm" />
                    View Invoice
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaFileInvoiceDollar className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaymentHistory;
