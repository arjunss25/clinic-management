import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Total Users</h2>
          <div className="text-3xl font-bold text-blue-600">320</div>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm">+12%</span>
            <span className="text-gray-500 text-sm ml-2">vs last month</span>
          </div>
        </div>

        {/* Active Doctors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Active Doctors</h2>
          <div className="text-3xl font-bold text-green-600">15</div>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm">+2</span>
            <span className="text-gray-500 text-sm ml-2">new this month</span>
          </div>
        </div>

        {/* Staff Members */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Staff Members</h2>
          <div className="text-3xl font-bold text-purple-600">25</div>
          <div className="flex items-center mt-2">
            <span className="text-gray-500 text-sm">Active members</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Total Revenue</h2>
          <div className="text-3xl font-bold text-indigo-600">$52,450</div>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm">+8%</span>
            <span className="text-gray-500 text-sm ml-2">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 