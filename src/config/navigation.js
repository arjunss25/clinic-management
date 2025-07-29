import { FaHome, FaCalendarAlt, FaNotesMedical, FaUser, FaUsers, FaCog } from 'react-icons/fa';

export const navigationConfig = {
  patient: [
    {
      name: 'Dashboard',
      path: '/patient',
      icon: FaHome, // Export the component itself
    },
    {
      name: 'Appointments',
      path: '/patient/appointments',
      icon: FaCalendarAlt, // Export the component itself
    },
    {
      name: 'Medical Records',
      path: '/patient/medical-records',
      icon: FaNotesMedical,
    },
    {
      name: 'Profile',
      path: '/patient/profile',
      icon: FaUser,
    },
  ],
  doctor: [
    {
      name: 'Dashboard',
      path: '/doctor',
      icon: FaHome,
    },
    {
      name: 'Appointments',
      path: '/doctor/appointments',
      icon: FaCalendarAlt,
    },
    {
      name: 'Patients',
      path: '/doctor/patients',
      icon: FaUsers,
    },
  ],
  staff: [
    {
      name: 'Dashboard',
      path: '/staff',
      icon: FaHome,
    },
    {
      name: 'Appointments',
      path: '/staff/appointments',
      icon: FaCalendarAlt,
    },
    {
      name: 'Patients',
      path: '/staff/patients',
      icon: FaUsers,
    },
  ],
  superadmin: [
    {
      name: 'Dashboard',
      path: '/superadmin',
      icon: FaHome,
    },
    {
      name: 'Users',
      path: '/superadmin/users',
      icon: FaUsers,
    },
    {
      name: 'Settings',
      path: '/superadmin/settings',
      icon: FaCog,
    },
  ],
};