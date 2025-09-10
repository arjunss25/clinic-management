from django.urls import path 
from . views import *
urlpatterns = [

    path('get-dcotor-profile/', DoctorProfileAPIView.as_view(), name='get-doctor-profile'),
    path('list-doctor-appointments/', DoctorAppointmentsListAPIView.as_view(), name='list-doctor-appointments'),
    path('list-todays-doctor-appointments/', TodaysDoctorAppointmentsListAPIView.as_view(), name='list-todays-doctor-appointments'),
    path('get-patient-details/<int:patient_id>/', PatientDetailAPIView.as_view(), name='get-patient-details'),
    path('doctor-appointments-by-date/<str:date>/', DoctorAppointmentsByDateAPIView.as_view(), name='doctor-appointments-by-date'),
    path('patients-list/',DoctorPatientsListAPIView.as_view(),name='patients-list'),
    path('patients-search/',DoctorPatientSearchAPIView.as_view(),name='patients-search'),
    path('consultation-create/',ConsultationCreateAPIView.as_view(),name='consultation-create'),
    path('follow-up-appointment/',FollowUpAppointmentAPIView.as_view(),name='follow-up-appointment'),
    
]
