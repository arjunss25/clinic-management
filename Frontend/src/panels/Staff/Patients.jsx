import React from 'react';

const Patients = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patient Records</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-4">
            {/* Patient Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">Age: 35 • Male</p>
                  <p className="text-gray-600">ID: PAT-2024-001</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>

            {/* Patient Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Jane Smith</h3>
                  <p className="text-sm text-gray-500">Age: 28 • Female</p>
                  <p className="text-gray-600">ID: PAT-2024-002</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>

            {/* Patient Item */}
            <div className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Robert Johnson</h3>
                  <p className="text-sm text-gray-500">Age: 45 • Male</p>
                  <p className="text-gray-600">ID: PAT-2024-003</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients; 