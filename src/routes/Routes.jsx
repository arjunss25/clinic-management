import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import ClinicLayout from '../layouts/ClinicLayout';
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
import AppointmentHistory from '../panels/Doctor/AppointmentHistory';
import DoctorPatients from '../panels/Doctor/Patients';
import DoctorPatientProfile from '../panels/Doctor/PatientProfile';
import DoctorPatientBooking from '../panels/Doctor/PatientBooking';
import Consultation from '../panels/Doctor/Consultation';

// Clinic Panel Imports
import ClinicDashboard from '../panels/Clinic/Dashboard';
import ClinicAppointments from '../panels/Clinic/Appointments';
import ClinicPatients from '../panels/Clinic/Patients';
import ClinicPatientProfile from '../panels/Clinic/PatientProfile';
import ClinicPatientBooking from '../panels/Clinic/PatientBooking';

// SuperAdmin Panel Imports
import SuperAdminDashboard from '../panels/SuperAdmin/Dashboard';
import SuperAdminClinics from '../panels/SuperAdmin/Clinics';
import SuperAdminDoctors from '../panels/SuperAdmin/Doctors';
import SuperAdminStaff from '../panels/SuperAdmin/Staff';
import SuperAdminApprovals from '../panels/SuperAdmin/Approvals';
import SuperAdminAnalytics from '../panels/SuperAdmin/Analytics';

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
        <Route path="appointments-history" element={<AppointmentHistory />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="patients/:patientId" element={<DoctorPatientProfile />} />
        <Route path="patient-booking/:patientId" element={<DoctorPatientBooking />} />
        <Route path="consultation" element={<Consultation />} />
      </Route>

      {/* Clinic Routes */}
      <Route path="/clinic" element={<ClinicLayout />}>
        <Route index element={<ClinicDashboard />} />
        <Route path="appointments" element={<ClinicAppointments />} />
        <Route
          path="patient-booking/:patientId"
          element={<ClinicPatientBooking />}
        />
        <Route path="patients" element={<ClinicPatients />} />
        <Route path="patients/:patientId" element={<ClinicPatientProfile />} />
      </Route>

      {/* SuperAdmin Routes */}
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="clinics" element={<SuperAdminClinics />} />
        <Route path="doctors" element={<SuperAdminDoctors />} />
        <Route path="staff" element={<SuperAdminStaff />} />
        <Route path="approvals" element={<SuperAdminApprovals />} />
        <Route path="analytics" element={<SuperAdminAnalytics />} />
      </Route>

      {/* Redirect to login for unknown routes */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
