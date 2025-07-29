import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
          <div className="text-3xl font-bold text-blue-600">8</div>
          <p className="text-gray-600 mt-2">Scheduled for today</p>
        </div>

        {/* Total Patients */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Total Patients</h2>
          <div className="text-3xl font-bold text-green-600">145</div>
          <p className="text-gray-600 mt-2">Under your care</p>
        </div>

        {/* Pending Reports */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pending Reports</h2>
          <div className="text-3xl font-bold text-orange-600">3</div>
          <p className="text-gray-600 mt-2">Need your attention</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 