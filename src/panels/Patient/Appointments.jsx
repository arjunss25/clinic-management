import React from 'react';

const Appointments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Book New Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample Appointment */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">General Checkup</h3>
                  <p className="text-gray-600">Dr. John Doe</p>
                  <p className="text-gray-500">Monday, March 15, 2024</p>
                  <p className="text-gray-500">10:00 AM</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Upcoming
                </span>
              </div>
            </div>

            {/* Sample Past Appointment */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Dental Consultation</h3>
                  <p className="text-gray-600">Dr. Jane Smith</p>
                  <p className="text-gray-500">Monday, March 1, 2024</p>
                  <p className="text-gray-500">2:30 PM</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments; 