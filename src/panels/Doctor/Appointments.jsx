import React from 'react';

const Appointments = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Appointment Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-gray-600">General Checkup</p>
                  <p className="text-sm text-gray-500">Age: 35 • Male</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">09:00 AM</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </div>

            {/* Appointment Item */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Jane Smith</h3>
                  <p className="text-gray-600">Follow-up</p>
                  <p className="text-sm text-gray-500">Age: 28 • Female</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">10:30 AM</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </div>

            {/* Appointment Item */}
            <div className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Robert Johnson</h3>
                  <p className="text-gray-600">Consultation</p>
                  <p className="text-sm text-gray-500">Age: 45 • Male</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">02:00 PM</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments; 