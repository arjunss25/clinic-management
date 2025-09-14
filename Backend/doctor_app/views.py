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
    # authentication_classes = [CookieJWTAuthentication]
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

# edit doctor profile patch
class DoctorProfileEditAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to edit this profile.")

            doctor = get_object_or_404(Doctor, user=user)
            serializer = DoctorProfileSerializer(doctor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return custom_200("Doctor profile updated successfully.", serializer.data)
            return custom_404(serializer.errors)
        except Exception as e:
            return custom_404(str(e))


# list appointments of logged in doctor
class DoctorAppointmentsListAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
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
    # authentication_classes = [CookieJWTAuthentication]
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
    # authentication_classes = [CookieJWTAuthentication]
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
    # authentication_classes = [CookieJWTAuthentication]
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
        

# list all patients of logged in doctor
class DoctorPatientsListAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view these patients.")

            doctor = get_object_or_404(Doctor, user=user)
            appointments = AppointmentBooking.objects.filter(doctor=doctor).select_related('patient').distinct('patient')
            patients = [appointment.patient for appointment in appointments]
            serializer = PatientRegisterSerializer(patients, many=True)
            return custom_200("Patients retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))        
        

# patient search by name or email or phone number
class DoctorPatientSearchAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to search patients.")

            doctor = get_object_or_404(Doctor, user=user)
            query = request.query_params.get('query', '')

            appointments = AppointmentBooking.objects.filter(
                doctor=doctor,
                patient__isnull=False
            ).select_related('patient').distinct('patient')

            patients = [appointment.patient for appointment in appointments]

            filtered_patients = [
                patient for patient in patients
                if query.lower() in patient.full_name.lower() or
                   query.lower() in patient.user.email.lower() or
                   query in patient.phone_number
            ]

            serializer = PatientRegisterSerializer(filtered_patients, many=True)
            return custom_200("Search results retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))        
        

# consultation with prescription and medications
class ConsultationCreateAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ConsultationSerializer(data=request.data)
        if serializer.is_valid():
            consultation = serializer.save()
            # ✅ Update appointment status to Completed
            if consultation.appointment:  
                consultation.appointment.status = "Completed"
                consultation.appointment.save()
            return custom_201("Consultation with prescription and medications created successfully", ConsultationSerializer(consultation).data
             )
        return custom_404(serializer.errors)        

# list of prescriptions of a patient
class PatientPrescriptionsListAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, patient_id):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view these prescriptions.")

            patient = get_object_or_404(Patient, id=patient_id)
            prescriptions = Prescription.objects.filter(patient=patient).order_by('-created_at')
            serializer = PrescriptionSerializer(prescriptions, many=True)
            return custom_200("Prescriptions retrieved successfully.", serializer.data)
        except Exception as e:
            return custom_404(str(e))    

# follow-up appointment creation
class FollowUpAppointmentAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = FollowUpAppointmentSerializer(data=request.data)
        if serializer.is_valid():
            follow_up = serializer.save()
            return custom_201("Follow-up appointment created successfully", FollowUpAppointmentSerializer(follow_up).data
              )
        return custom_404(serializer.errors)    
    
    
#count of total patients of logged in doctor, today's appointments, todays completed appointments,waiting list appointments, today's no-show appointments
class DoctorDashboardStatsAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role != "Doctor":
                return custom_404("You are not authorized to view these stats.")

            doctor = get_object_or_404(Doctor, user=user)
            today = timezone.now().date()

            total_patients = AppointmentBooking.objects.filter(doctor=doctor).values('patient').distinct().count()
            todays_appointments = AppointmentBooking.objects.filter(doctor=doctor, appointment_date=today).count()
            todays_completed_appointments = AppointmentBooking.objects.filter(doctor=doctor, appointment_date=today, status="Completed").count()
            waiting_list_appointments = AppointmentBooking.objects.filter(doctor=doctor, appointment_date=today, status="Waiting List").count()
            todays_no_show_appointments = AppointmentBooking.objects.filter(doctor=doctor, appointment_date=today, status="No-Show").count()

            data = {
                "total_patients": total_patients,
                "todays_appointments": todays_appointments,
                "todays_completed_appointments": todays_completed_appointments,
                "waiting_list_appointments": waiting_list_appointments,
                "todays_no_show_appointments": todays_no_show_appointments
            }

            return custom_200("Dashboard stats retrieved successfully.", data)
        except Exception as e:
            return custom_404(str(e))
