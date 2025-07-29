import React from 'react';

const Patients = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Patients</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Patient Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">Age: 35 • Male</p>
                  <p className="text-gray-600">Last Visit: 15 Mar 2024</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-800">View Records</button>
                </div>
              </div>
            </div>

            {/* Patient Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Jane Smith</h3>
                  <p className="text-sm text-gray-500">Age: 28 • Female</p>
                  <p className="text-gray-600">Last Visit: 12 Mar 2024</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-800">View Records</button>
                </div>
              </div>
            </div>

            {/* Patient Item */}
            <div className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Robert Johnson</h3>
                  <p className="text-sm text-gray-500">Age: 45 • Male</p>
                  <p className="text-gray-600">Last Visit: 10 Mar 2024</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-800">View Records</button>
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