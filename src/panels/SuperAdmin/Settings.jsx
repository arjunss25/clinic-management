import React from 'react';

const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {/* General Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Clinic Name</label>
                <input
                  type="text"
                  defaultValue="City Health Clinic"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  defaultValue="contact@cityhealthclinic.com"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Appointment Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Appointment Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Default Appointment Duration</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30" selected>30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="allowOnline" className="mr-2" defaultChecked />
                <label htmlFor="allowOnline" className="text-gray-700">Allow Online Appointments</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="requireApproval" className="mr-2" defaultChecked />
                <label htmlFor="requireApproval" className="text-gray-700">Require Staff Approval for New Appointments</label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="emailNotif" className="mr-2" defaultChecked />
                <label htmlFor="emailNotif" className="text-gray-700">Email Notifications</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="smsNotif" className="mr-2" defaultChecked />
                <label htmlFor="smsNotif" className="text-gray-700">SMS Notifications</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="reminderNotif" className="mr-2" defaultChecked />
                <label htmlFor="reminderNotif" className="text-gray-700">Appointment Reminders</label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 