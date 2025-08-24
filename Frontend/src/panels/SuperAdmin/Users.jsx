import React from 'react';

const Users = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search users..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="staff">Staff</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <div className="flex flex-col space-y-4">
            {/* User Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Dr. Sarah Wilson</h3>
                  <p className="text-gray-600">Doctor</p>
                  <p className="text-sm text-gray-500">sarah.wilson@example.com</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                  <div className="mt-2">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Deactivate</button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Michael Brown</h3>
                  <p className="text-gray-600">Staff</p>
                  <p className="text-sm text-gray-500">michael.brown@example.com</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                  <div className="mt-2">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Deactivate</button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Item */}
            <div className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Emily Davis</h3>
                  <p className="text-gray-600">Doctor</p>
                  <p className="text-sm text-gray-500">emily.davis@example.com</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
                  <div className="mt-2">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Deactivate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 