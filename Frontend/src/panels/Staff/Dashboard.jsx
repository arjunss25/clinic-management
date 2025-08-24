import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
          <div className="text-3xl font-bold text-blue-600">15</div>
          <p className="text-gray-600 mt-2">Total for today</p>
        </div>

        {/* Registered Patients */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Registered Patients</h2>
          <div className="text-3xl font-bold text-green-600">250</div>
          <p className="text-gray-600 mt-2">Total patients</p>
        </div>

        {/* Available Doctors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Available Doctors</h2>
          <div className="text-3xl font-bold text-purple-600">5</div>
          <p className="text-gray-600 mt-2">On duty today</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 