# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path("patients/register/", PatientRegisterAPI.as_view(), name="patient-register"),
    path("delete_users/<int:pk>/", UserDeleteAPI.as_view(), name="user-delete"),

]
