import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCreditCard,
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaTimes,
  FaEdit,
  FaPlus,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
} from 'react-icons/fa';
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash,
  Eye,
} from 'lucide-react';

const Subscriptions = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('plans');
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const subscriptionData = {
    // Subscription Plans
    plans: [
      {
        id: 1,
        name: 'Basic Plan',
        price: 5000,
        billingCycle: 'monthly',
        features: [
          'Up to 10 doctors',
          'Basic appointment scheduling',
          'Patient management',
          'Email support',
          'Basic reporting'
        ],
        subscribers: 3,
        revenue: 15000,
        status: 'active'
      },
      {
        id: 2,
        name: 'Professional Plan',
        price: 10000,
        billingCycle: 'monthly',
        features: [
          'Up to 25 doctors',
          'Advanced appointment scheduling',
          'Patient management',
          'Priority support',
          'Advanced reporting',
          'Custom branding',
          'SMS notifications'
        ],
        subscribers: 3,
        revenue: 30000,
        status: 'active'
      },
      {
        id: 3,
        name: 'Enterprise Plan',
        price: 20000,
        billingCycle: 'monthly',
        features: [
          'Unlimited doctors',
          'Advanced appointment scheduling',
          'Patient management',
          '24/7 priority support',
          'Advanced reporting',
          'Custom branding',
          'SMS notifications',
          'API access',
          'Custom integrations',
          'Dedicated account manager'
        ],
        subscribers: 1,
        revenue: 20000,
        status: 'active'
      },
      {
        id: 4,
        name: 'Premium Plan',
        price: 15000,
        billingCycle: 'monthly',
        features: [
          'Up to 50 doctors',
          'Advanced appointment scheduling',
          'Patient management',
          'Priority support',
          'Advanced reporting',
          'Custom branding',
          'SMS notifications',
          'API access'
        ],
        subscribers: 0,
        revenue: 0,
        status: 'inactive'
      }
    ],

    // Subscription Analytics
    analytics: {
      totalSubscribers: 7,
      activeSubscriptions: 7,
      monthlyRecurringRevenue: 65000,
      averageRevenuePerUser: 9285,
      churnRate: 2.1,
      growthRate: 12.5,
      totalRevenue: 195000,
      revenueGrowth: 15.3
    },

    // Recent Subscriptions
    recentSubscriptions: [
      {
        id: 1,
        clinicName: 'City Medical Center',
        plan: 'Professional Plan',
        amount: 10000,
        status: 'active',
        startDate: '2024-01-15',
        nextBilling: '2024-02-15'
      },
      {
        id: 2,
        clinicName: 'Heart Care Clinic',
        plan: 'Basic Plan',
        amount: 5000,
        status: 'active',
        startDate: '2024-01-10',
        nextBilling: '2024-02-10'
      },
      {
        id: 3,
        clinicName: 'Downtown Medical Group',
        plan: 'Enterprise Plan',
        amount: 20000,
        status: 'active',
        startDate: '2024-01-05',
        nextBilling: '2024-02-05'
      }
    ],

    // Billing History
    billingHistory: [
      {
        id: 1,
        clinicName: 'City Medical Center',
        plan: 'Professional Plan',
        amount: 10000,
        status: 'paid',
        date: '2024-01-15',
        invoiceNumber: 'INV-2024-001'
      },
      {
        id: 2,
        clinicName: 'Heart Care Clinic',
        plan: 'Basic Plan',
        amount: 5000,
        status: 'paid',
        date: '2024-01-10',
        invoiceNumber: 'INV-2024-002'
      },
      {
        id: 3,
        clinicName: 'Downtown Medical Group',
        plan: 'Enterprise Plan',
        amount: 20000,
        status: 'paid',
        date: '2024-01-05',
        invoiceNumber: 'INV-2024-003'
      }
    ]
  };

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
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  const cardHover = { y: -2, transition: { duration: 0.2 } };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? (
      <FaArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <FaArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
            Subscription Management
          </h1>
          <p className="text-gray-600">
            Manage subscription plans, billing, and revenue analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-[#E9DFC3]/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8] focus:border-transparent bg-white text-gray-900"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={() => setShowAddPlan(true)}
            className="px-4 py-2 bg-[#0118D8] text-white rounded-lg hover:bg-[#1B56FD] transition-colors flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Plan
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0118D8]/5 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0118D8]" />
            </div>
            <p className="text-gray-500 text-sm">Total Subscribers</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {subscriptionData.analytics.totalSubscribers}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(subscriptionData.analytics.growthRate)}
              <span className={`text-sm font-medium ${getGrowthColor(subscriptionData.analytics.growthRate)}`}>
                +{subscriptionData.analytics.growthRate}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/5 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm">Active Subscriptions</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {subscriptionData.analytics.activeSubscriptions}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {((subscriptionData.analytics.activeSubscriptions / subscriptionData.analytics.totalSubscribers) * 100).toFixed(1)}% active rate
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-purple-500/5 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">Monthly Revenue</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(subscriptionData.analytics.monthlyRecurringRevenue)}
            </p>
            <div className="flex items-center gap-2">
              {getGrowthIcon(subscriptionData.analytics.revenueGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(subscriptionData.analytics.revenueGrowth)}`}>
                +{subscriptionData.analytics.revenueGrowth}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-500/5 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-500 text-sm">Avg Revenue/User</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(subscriptionData.analytics.averageRevenuePerUser)}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Per active subscriber
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm overflow-hidden">
        <div className="border-b border-[#E9DFC3]/70">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'plans', name: 'Subscription Plans', icon: FaCreditCard },
              { id: 'subscribers', name: 'Subscribers', icon: FaUsers },
              { id: 'billing', name: 'Billing History', icon: FaDollarSign },
              { id: 'analytics', name: 'Analytics', icon: FaChartLine }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0118D8] text-[#0118D8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Subscription Plans Tab */}
          {activeTab === 'plans' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subscriptionData.plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                          {plan.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-3xl font-bold text-[#0118D8]">
                          {formatCurrency(plan.price)}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">per {plan.billingCycle}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subscribers</span>
                          <span className="font-medium">{plan.subscribers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-medium">{formatCurrency(plan.revenue)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                        <ul className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCheckCircle className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-sm text-gray-500">
                              +{plan.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setEditingPlan(plan)}
                          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaEdit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm bg-[#0118D8] text-white rounded-lg hover:bg-[#1B56FD] transition-colors flex items-center justify-center gap-2">
                          <FaEye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Clinic</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Next Billing</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionData.recentSubscriptions.map((subscription) => (
                      <motion.tr
                        key={subscription.id}
                        variants={itemVariants}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{subscription.clinicName}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{subscription.plan}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{formatCurrency(subscription.amount)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{formatDate(subscription.startDate)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{formatDate(subscription.nextBilling)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Billing History Tab */}
          {activeTab === 'billing' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Clinic</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionData.billingHistory.map((billing) => (
                      <motion.tr
                        key={billing.id}
                        variants={itemVariants}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{billing.invoiceNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{billing.clinicName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{billing.plan}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{formatCurrency(billing.amount)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(billing.status)}`}>
                            {billing.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{formatDate(billing.date)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FaDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                  <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Revenue chart will be displayed here</p>
                  </div>
                </div>

                {/* Subscription Growth Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Growth</h3>
                  <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Growth chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Subscriptions;
