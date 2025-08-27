from django.urls import path 
from . views import *
urlpatterns = [
    path('get-clinic-profile/', ClinicProfileAPIView.as_view(), name='get-clinic-profile'),
    path('register-doctor/', DoctorRegisterAPIView.as_view(), name='register-doctor'),
    path('list-all-doctors/', ClinicDoctorsListAPIView.as_view(), name='list-all-doctors'),
    path('search-doctors/', DoctorSearchAPIView.as_view(), name='search-doctors'),

    # patient section
    path("patients/register/", PatientRegisterAPI.as_view(), name="patient-register"),
    path("patients/edit/<int:patient_id>/", PatientRegisterAPI.as_view(), name="patient-edit"),
    path("delete_users/<int:pk>/", UserDeleteAPI.as_view(), name="user-delete"),
]
