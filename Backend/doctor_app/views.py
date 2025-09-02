from django.shortcuts import render
from superadmin_app.models import *
from clinical_panel_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from superadmin_app.serializers import *
from . serializers import *
from clinical_panel_app.serializers import *
from superadmin_app.utils import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime, timedelta
import calendar
from authentication_app.authentication import CookieJWTAuthentication
from django.utils import timezone




# get login doctor profile
class DoctorProfileAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view this profile.")

            doctor = get_object_or_404(Doctor, user=user)
            serializer = DoctorProfileSerializer(doctor)
            return custom_200("Doctor profile retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))
        
# list appointments of logged in doctor
class DoctorAppointmentsListAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view these appointments.")

            doctor = get_object_or_404(Doctor, user=user)
            appointments = AppointmentBooking.objects.filter(doctor=doctor).order_by('-appointment_date', '-start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200("Appointments retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))

# list today's appointments of logged in doctor
class TodaysDoctorAppointmentsListAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view these appointments.")

            doctor = get_object_or_404(Doctor, user=user)
            today = timezone.now().date()
            appointments = AppointmentBooking.objects.filter(doctor=doctor, appointment_date=today).order_by('start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200("Today's appointments retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))
        

# get details of a specific patient by patient id
class PatientDetailAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view patient details.")

            patient = get_object_or_404(Patient, id=patient_id)
            serializer = PatientRegisterSerializer(patient)
            return custom_200("Patient details retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))        
        
# list appointments of doctor by date    
class DoctorAppointmentsByDateAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, date):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view these appointments.")

            doctor = get_object_or_404(Doctor, user=user)
            appointments = AppointmentBooking.objects.filter(doctor=doctor, appointment_date=date).order_by('start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200(f"Appointments for {date} retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))    