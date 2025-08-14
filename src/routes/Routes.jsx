import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import StaffLayout from '../layouts/StaffLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import Login from '../panels/Auth/Login';
import OtpVerification from '../panels/Auth/OtpVerification';

// Patient Panel Imports
import PatientDashboard from '../panels/Patient/Dashboard';
import PatientAppointments from '../panels/Patient/Appointments';
import PatientBookedAppointments from '../panels/Patient/BookedPatientAppointments';
import PatientProfile from '../panels/Patient/Profile';
import PatientMedicalRecords from '../panels/Patient/MedicalRecords';
import PatientHealthTips from '../panels/Patient/HealthTips';
import PaymentHistory from '../panels/Patient/PaymentHistory';

// Doctor Panel Imports
import DoctorDashboard from '../panels/Doctor/Dashboard';
import DoctorAppointments from '../panels/Doctor/Appointments';
import DoctorPatients from '../panels/Doctor/Patients';
import DoctorPatientProfile from '../panels/Doctor/PatientProfile';


// Staff Panel Imports
import StaffDashboard from '../panels/Staff/Dashboard';
import StaffAppointments from '../panels/Staff/Appointments';
import StaffPatients from '../panels/Staff/Patients';

// SuperAdmin Panel Imports
import SuperAdminDashboard from '../panels/SuperAdmin/Dashboard';
import SuperAdminUsers from '../panels/SuperAdmin/Users';
import SuperAdminSettings from '../panels/SuperAdmin/Settings';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OtpVerification />} />

      {/* Patient Routes */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route
          path="booked-appointments"
          element={<PatientBookedAppointments />}
        />
        <Route path="health-tips" element={<PatientHealthTips />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="medical-records" element={<PatientMedicalRecords />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="patients/:patientId" element={<DoctorPatientProfile />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="appointments" element={<StaffAppointments />} />
        <Route path="patients" element={<StaffPatients />} />
      </Route>

      {/* SuperAdmin Routes */}
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="settings" element={<SuperAdminSettings />} />
      </Route>

      {/* Redirect to login for unknown routes */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
