from django.urls import path 
from . views import *
urlpatterns = [
    path('get-clinic-profile/', ClinicProfileAPIView.as_view(), name='get-clinic-profile'),
    path('register-doctor/', DoctorRegisterAPIView.as_view(), name='register-doctor'),  
    path('list-all-doctors/', ClinicDoctorsListAPIView.as_view(), name='list-all-doctors'),
    path('search-doctors/', DoctorSearchAPIView.as_view(), name='search-doctors'),
    path('doctor-details/<int:doctor_id>/', DoctorDetailAPIView.as_view(), name='doctor-details'),
    path('set-doctor-availability/', AddDoctorAvailabilityAPIView.as_view(), name='set-doctor-availability'),
    path('update-doctor-availability/<int:availability_id>/', DoctorAvailabilityUpdateAPIView.as_view(), name='update-doctor-availability'),
    path('list-doctor-availability/<int:doctor_id>/<str:date>/', DoctorAvailabilityListAPIView.as_view(), name='list-doctor-availability'),
    path('list-doctor-availability/<str:date>/', DoctorAvailabilityListAPIView.as_view(), name='list-doctor-availability'),
    path('slots-block-unblock/', DoctorSlotBlockUnblockAPIView.as_view(), name='slots-block-unblock'),


    # patient section
    path("patients/register/", PatientRegisterAPI.as_view(), name="patient-register"),
    path("patients/edit/<int:patient_id>/", PatientRegisterAPI.as_view(), name="patient-edit"),
    path("patients/get/<int:patient_id>/", PatientRegisterAPI.as_view(), name="patient-detail"),
    path("delete_user/<int:pk>/", UserDeleteAPI.as_view(), name="user-delete"),

    path("patients/vitals/<int:patient_id>/", AddPatientVitalsAPI.as_view(), name="add-patient-vitals"),
    path("patients/vitals/update/<int:vital_id>/", UpdatePatientVitalsAPI.as_view(), name="update-patient-vitals"),
    
    # clinic or patient
    path('appointment-booking/', AppointmentBookingAPI.as_view(), name='appointment-booking'),

]
