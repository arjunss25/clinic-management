from django.shortcuts import render
from superadmin_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from superadmin_app.serializers import *
from .serializers import *
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

            send_doctor_credentials_email(doctor.email, password,clinic.clinic_name)

            return custom_201("Doctor registered successfully. Credentials sent to email.", {
                "doctor_id": doctor.id,
                "doctor_name": doctor.doctor_name,
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