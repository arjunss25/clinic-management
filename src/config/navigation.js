import {
  FaHome,
  FaCalendarAlt,
  FaNotesMedical,
  FaUser,
  FaUsers,
  FaCog,
  FaLightbulb,
  FaMoneyBill,
  FaCreditCard,
  FaHospital,
  FaUserMd,
  FaUserNurse,
  FaCheckCircle,
  FaChartLine,
} from 'react-icons/fa';

export const navigationConfig = {
  patient: [
    {
      name: 'Dashboard',
      path: '/patient',
      icon: FaHome,
    },
    {
      name: 'Appointments',
      path: '/patient/appointments',
      icon: FaCalendarAlt,
      subItems: [
        {
          name: 'Book Appointments',
          path: '/patient/appointments',
        },
        {
          name: 'Appointment History',
          path: '/patient/booked-appointments',
        },
      ],
    },
    {
      name: 'Medical Records',
      path: '/patient/medical-records',
      icon: FaNotesMedical,
    },
    {
      name: 'Health Tips',
      path: '/patient/health-tips',
      icon: FaLightbulb,
    },
    {
      name: 'Payment History',
      path: '/patient/payments',
      icon: FaCreditCard,
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
  clinic: [
    {
      name: 'Dashboard',
      path: '/clinic',
      icon: FaHome,
    },
    {
      name: 'Appointments',
      path: '/clinic/appointments',
      icon: FaCalendarAlt,
      subItems: [
        {
          name: 'Manage Slots',
          path: '/clinic/appointments',
        },
        {
          name: 'Book for Patient',
          path: '/clinic/patient-booking',
        },
      ],
    },
     {
      name: 'Doctors',
      path: '/clinic/doctors',
      icon: FaUserMd,
    },
    {
      name: 'Patients',
      path: '/clinic/patients',
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
      name: 'Analytics',
      path: '/superadmin/analytics',
      icon: FaChartLine,
    },
    {
      name: 'Clinics',
      path: '/superadmin/clinics',
      icon: FaHospital,
    },
    {
      name: 'Doctors',
      path: '/superadmin/doctors',
      icon: FaUserMd,
    },
    {
      name: 'Staff',
      path: '/superadmin/staff',
      icon: FaUserNurse,
    },
    {
      name: 'Approvals',
      path: '/superadmin/approvals',
      icon: FaCheckCircle,
    },
  ],
};
