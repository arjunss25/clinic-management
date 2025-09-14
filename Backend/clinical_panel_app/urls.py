from django.urls import path 
from . views import *
urlpatterns = [
    path('dashboard-counts/', ClinicDashboardStatsCountAPIView.as_view(), name='dashboard-counts'),
    path('get-clinic-profile/', ClinicProfileAPIView.as_view(), name='get-clinic-profile'),
    path('register-doctor/', DoctorRegisterAPIView.as_view(), name='register-doctor'),
    path('list-clinic-specializations/', ClinicSpecialtiesListAPIView.as_view(), name='list-clinic-specializations'),
    path('list-doctor-by-specialization/<str:specialty_name>/', ClinicDoctorsBySpecialtyAPIView.as_view(), name='list-doctor-by-specialization'),
    path('list-all-doctors/', ClinicDoctorsListAPIView.as_view(), name='list-all-doctors'),
    path('search-doctors/', DoctorSearchAPIView.as_view(), name='search-doctors'),
    path('doctor-details/<int:doctor_id>/', DoctorDetailAPIView.as_view(), name='doctor-details'),
    path('set-doctor-availability/', AddDoctorAvailabilityAPIView.as_view(), name='set-doctor-availability'),
    path('update-doctor-availability/<int:availability_id>/', DoctorAvailabilityUpdateAPIView.as_view(), name='update-doctor-availability'),
    path('list-doctor-availability/<int:doctor_id>/<str:date>/', DoctorAvailabilityListAPIView.as_view(), name='list-doctor-availability'),
    path('list-doctor-availability/<str:date>/', DoctorAvailabilityListAPIView.as_view(), name='list-doctor-availability'),
    path('slots-block-unblock/', DoctorSlotBlockUnblockAPIView.as_view(), name='slots-block-unblock'),
    path('appointment-booking/', AppointmentBookingAPI.as_view(), name='appointment-booking'),
    path('list-all-appointments-clinic/', ClinicAppointmentsListAPIView.as_view(), name='list-all-appointments-clinic'),
    path('list-appointments-by-specialization/<str:specialization>/', AppointmentFilterBySpecializationAPI.as_view(), name='list-appointments-by-specialization'),
    path('list-todays-appointments/<str:specialization>/', TodaysAppointmentFilterBySpecializationAPI.as_view(), name='list-todays-appointments'),


      # patient section
    path("patients/register/", PatientRegisterAPI.as_view(), name="patient-register"),
    path("patients/edit/<int:patient_id>/", PatientRegisterAPI.as_view(), name="patient-edit"),
    path("patients/get/<int:patient_id>/", PatientRegisterAPI.as_view(), name="patient-detail"),

    path("delete_users/<int:pk>/", PatientUserDeleteAPI.as_view(), name="user-delete"),
    path("delete_users/<int:pk>/", UserDeleteAPI.as_view(), name="user-delete"),



    # clinic profile section
    path('update-clinic-profile/', ClinicProfileEditAPIView.as_view(), name='update-clinic-profile'),
    # accreditation crud
    path('add-accreditation/', ClinicAccreditationAPIView.as_view(), name='add-accreditation'),
    path('list-accreditations/', ClinicAccreditationAPIView.as_view(), name='list-accreditations'),
    path('edit-accreditations/<int:accreditation_id>/', ClinicAccreditationAPIView.as_view(), name='edit-accreditations'),
    path('delete-accreditation/<int:accreditation_id>/', ClinicAccreditationDeleteAPIView.as_view(), name='delete-accreditation'),
    # medical facility crud
    path('add-facility/', ClinicMedicalFacilityAPIView.as_view(), name='add-facility'),
    path('list-facilities/', ClinicMedicalFacilityAPIView.as_view(), name='list-facilities'),
    path('edit-facilities/<int:facility_id>/', ClinicMedicalFacilityAPIView.as_view(), name='edit-facilities'),
    path('delete-facility/<int:facility_id>/', ClinicMedicalFacilitiesDeleteAPIView.as_view(), name='delete-facility'),
    # patients amenity crud
    path('add-patient-amenity/',ClinicPatientAmenitiesAPIView.as_view(),name='add-patient-amenity'),
    path('list-patient-amenity/',ClinicPatientAmenitiesAPIView.as_view(),name='list-patient-amenity'),
    path('edit-patient-amenity/<int:amenity_id>/',ClinicPatientAmenitiesAPIView.as_view(),name='edit-patient-amenity'),
    path('delete-patient-amenity/<int:amenity_id>/',ClinicPatientAmenityDeleteAPIView.as_view(),name='delete-patient-amenity'),

    # working hours crud
    path('clinic-working-hours/', ClinicWorkingHoursAPIView.as_view(), name='clinic-working-hours'),
    path('list-clinic-working-hours/', ClinicWorkingHoursAPIView.as_view(), name='list-clinic-working-hours'),
]
