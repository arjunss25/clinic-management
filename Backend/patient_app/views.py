
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

# Create your views here.
# get login patient profile
class PatientProfileAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientProfileSerializer(patient)
            return custom_200("Patient profile fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")
        
# list all appointments of a patient
class PatientAppointmentsListAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            appointments = AppointmentBooking.objects.filter(patient=patient).order_by('-appointment_date', '-start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200("Patient appointments fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")


# list appointments by date
class PatientAppointmentsByDateAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, date):
        try:

            patient = Patient.objects.get(user=request.user)
            appointments = AppointmentBooking.objects.filter(patient=patient, appointment_date=date).order_by('start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200(f"Patient appointments for {date} fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")
        

# list patients appointments by appointment id 
class PatientAppointmentDetailAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):
        try:
            patient = Patient.objects.get(user=request.user)
            appointment = get_object_or_404(AppointmentBooking, id=appointment_id, patient=patient)
            serializer = AppointmentBookingSerializer(appointment)
            return custom_200("Patient appointment details fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")        