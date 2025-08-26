from django.shortcuts import render
from superadmin_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from superadmin_app.serializers import *
from . serializers import *
from superadmin_app.utils import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
# Create your views here.


# get login clinic profile
class ClinicProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can access this endpoint")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        serializer = ClinicRegisterSerializer(clinic)
        return custom_200("Clinic profile fetched successfully", serializer.data)


#register doctor by clinic
class DoctorRegisterAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can register doctors")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        password = generate_random_password()
        serializer = DoctorRegisterSerializer(data=request.data, context={"password": password, "clinic": clinic})

        if serializer.is_valid():
            doctor = serializer.save()

            send_doctor_credentials_email(doctor.email, password)

            return custom_201("Doctor registered successfully. Credentials sent to email.", {
                "doctor_id": doctor.id,
                "doctor_name": doctor.name,
                "user_id": doctor.user.id,
                "email": doctor.email,
                "role": doctor.user.role
            })

        return custom_404(serializer.errors)
    

# list all doctors of a clinic
class ClinicDoctorsListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can access this endpoint")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        doctors = Doctor.objects.filter(clinic=clinic)
        serializer = DoctorRegisterSerializer(doctors, many=True)
        return custom_200("Doctors fetched successfully", serializer.data)    
    

# search doctors by name or specialization
class DoctorSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return custom_404("Please provide a search query")

        # Search by doctor_name OR specialization (case-insensitive)
        doctors = Doctor.objects.filter(
            Q(doctor_name__icontains=query) | Q(specialization__icontains=query)
        )

        serializer = DoctorRegisterSerializer(doctors, many=True)
        return custom_200("Doctor listed successfully",serializer.data) 
    
# list doctor details by id
class DoctorDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, doctor_id):
        doctor = get_object_or_404(Doctor, id=doctor_id)
        serializer = DoctorRegisterSerializer(doctor)
        return custom_200("Doctor details fetched successfully", serializer.data)    
    

# add doctor availability
class DoctorAvailabilityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Case 1: Doctor sets their own availability
        if user.role == "Doctor":
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")

        # Case 2: Clinic sets availability for a doctor
        elif user.role == "Clinic":
            doctor_id = request.data.get("doctor_id")
            if not doctor_id:
                return custom_404("doctor_id is required when clinic is setting availability")
            try:
                doctor = Doctor.objects.get(id=doctor_id, clinic=user.clinic_profile)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found for this clinic")

        else:
            return custom_404("Only Doctor or Clinic users can set availability")

        # Validate and save availability
        serializer = DoctorAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            availability = serializer.save(doctor=doctor)
            return custom_201("Availability set successfully", {
                "availability_id": availability.id,
                "doctor_id": doctor.id,
                "day_of_week": availability.day_of_week,
                "start_time": availability.start_time,
                "end_time": availability.end_time
            })

        return custom_404(serializer.errors)