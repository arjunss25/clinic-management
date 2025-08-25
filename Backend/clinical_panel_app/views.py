from django.shortcuts import render

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
