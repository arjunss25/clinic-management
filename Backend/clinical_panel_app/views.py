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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from superadmin_app.models import Patient, ProfileUser
from .serializers import PatientRegisterSerializer
from .utils import generate_random_password
from django.shortcuts import get_object_or_404


class PatientRegisterAPI(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PatientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Generate random password
            password = generate_random_password()

            # Create user (ProfileUser)
            email = serializer.validated_data['email']
            user = ProfileUser.objects.create_user(
                email=email,
                password=password,
                role='Patient',
                phone=serializer.validated_data.get("phone_number", "")
            )

            # Create patient profile
            patient = Patient.objects.create(
                user=user,
                full_name=serializer.validated_data["full_name"],
                age=serializer.validated_data["age"],
                gender=serializer.validated_data["gender"],
                phone_number=serializer.validated_data["phone_number"],
                blood_group=serializer.validated_data["blood_group"],
                emergency_contact_name=serializer.validated_data["emergency_contact_name"],
                emergency_contact_phone=serializer.validated_data["emergency_contact_phone"],
                address=serializer.validated_data["address"],
                known_allergies=serializer.validated_data.get("known_allergies", "")
            )

            # Send email
            subject = "Your Patient Profile has been created"
            message = (
                f"Hello {patient.full_name},\n\n"
                f"Your patient account has been created successfully.\n\n"
                f"Login Credentials:\n"
                f"Username (Email): {user.email}\n"
                f"Password: {password}\n\n"
                f"Please log in and change your password after first login."
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return Response(
                {"message": "Patient registered successfully, login credentials sent to email."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, patient_id, *args, **kwargs):
        
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientRegisterSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            # Update ProfileUser (if phone/email given)
            if "phone_number" in serializer.validated_data:
                patient.user.phone = serializer.validated_data["phone_number"]
                patient.user.save()

            if "email" in serializer.validated_data:
                patient.user.email = serializer.validated_data["email"]
                patient.user.save()

            # Update Patient fields (only those provided)
            for field, value in serializer.validated_data.items():
                setattr(patient, field, value)
            patient.save()

            return Response({"message": "Patient profile updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDeleteAPI(APIView):
    def delete(self, request, pk, *args, **kwargs):
        print('----------',pk)
        # find the user by primary key (id)
        user = get_object_or_404(ProfileUser, pk=pk)        
        user.delete()

        return Response(
            {"message": "User and related profile deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


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
