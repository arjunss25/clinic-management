from pyexpat import expat_CAPI
from tkinter import N
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
from .models import *
from datetime import datetime, timedelta
import calendar
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from superadmin_app.models import Patient, ProfileUser
from .serializers import *
from .utils import generate_random_password
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from .utils import *

class PatientRegisterAPI(APIView):
    def get(self, request, patient_id, *args, **kwargs):
        """Fetch a patient's details by ID"""
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return custom_404("Patient not found")

        serializer = PatientRegisterSerializer(patient)
        return custom_200('Here is the patient details',serializer.data)

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

            return  custom_200("Patient registered successfully, login credentials sent to email.")
        return custom_404(serializer.errors)
    
    def patch(self, request, patient_id, *args, **kwargs):
        
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return custom_404( "Patient not found")
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

            return custom_200('Patient profile updated successfully')
        return custom_404(serializer.errors)


class UserDeleteAPI(APIView):
    def delete(self, request, pk, *args, **kwargs):
        print('----------',pk)
        # find the user by primary key (id)
        try:
            user=get_object_or_404(ProfileUser, pk=pk)   
            user.delete()
            return custom_200('User and related profile deleted successfully.')
        except:
            return custom_404('This patient profile not found.')


# Custom permission: Only Doctors and Clinics can access.
class IsDoctorOrClinic(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["Doctor", "Clinic"]

class AddPatientVitalsAPI(APIView):
    permission_classes = [IsDoctorOrClinic]
    def post(self, request, patient_id, *args, **kwargs):
        """Add vitals for a patient"""
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientVitalsSerializer(data=request.data,context={'patient': patient})
        
        if serializer.is_valid():
            serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdatePatientVitalsAPI(APIView):
    # permission_classes = [IsDoctorOrClinic]
    def patch(self, request, vital_id, *args, **kwargs):
        """Update an existing vitals record"""
        try:
            vitals = PatientVitals.objects.get(id=vital_id)
        except PatientVitals.DoesNotExist:
            return Response({"error": "Vitals record not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientVitalsSerializer(vitals, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

            send_doctor_credentials_email(doctor.email, password , clinic.clinic_name)

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
    

# add doctor availability by doctor or clinic
class AddDoctorAvailabilityAPIView(APIView):
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
            doctor_id = request.data.get("doctor")
            if not doctor_id:
                return custom_404("doctor_id is required when clinic is setting availability")
            try:
                doctor = Doctor.objects.get(id=doctor_id, clinic=user.clinic_profile)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found for this clinic")

        else:
            return custom_404("Only Doctor or Clinic users can set availability")

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
    


# update availability by clinic or doctor
class DoctorAvailabilityUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, availability_id):
        user = request.user

        try:
            availability = DoctorAvailability.objects.get(id=availability_id)
        except DoctorAvailability.DoesNotExist:
            return custom_404("Availability not found")

        # Case 1: Doctor updating their own availability
        if user.role == "Doctor":
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")

            if availability.doctor != doctor:
                return custom_404("You are not allowed to update another doctor's availability")

        # Case 2: Clinic updating their doctor's availability
        elif user.role == "Clinic":
            try:
                doctor = availability.doctor
                if doctor.clinic != user.clinic_profile:
                    return custom_404("You can only update availability for doctors in your clinic")
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")

        else:
            return custom_404("Only Doctor or Clinic users can update availability")

        serializer = DoctorAvailabilitySerializer(
            availability, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return custom_200("Availability updated successfully", serializer.data)

        return custom_404(serializer.errors)



# list available slots for a doctor on a given date

class DoctorAvailabilityListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id=None, date=None):
        user = request.user

       
        if not date:
            return custom_404("date is required (format: YYYY-MM-DD)")

        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return custom_404("Invalid date format, expected YYYY-MM-DD")

        # Logged-in Doctor (no doctor_id required)
        if user.role == "Doctor" and doctor_id is None:
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")

        #  Clinic or Patient providing doctor_id
        else:
            if not doctor_id:
                return custom_404("doctor_id is required for this request")
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found")

        
        day_of_week = calendar.day_name[selected_date.weekday()]

        #  Query doctor availability
        availabilities_qs = DoctorAvailability.objects.filter(
            doctor=doctor,
            start_date__lte=selected_date
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=selected_date)
        )

        #  Filter by weekday in Python
        availabilities = [
            a for a in availabilities_qs
            if day_of_week in a.day_of_week
        ]

        if not availabilities:
            return custom_404("No availability found for this doctor on given date")

        all_slots = []

        for availability in availabilities:
            start_time = datetime.combine(selected_date, availability.start_time)
            end_time = datetime.combine(selected_date, availability.end_time)

            try:
                slot_minutes = int("".join([c for c in availability.slot_duration if c.isdigit()]))
                duration = timedelta(minutes=slot_minutes)
            except (ValueError, TypeError):
                return custom_404("Invalid slot_duration format, must contain integer minutes")

           
            break_periods = []
            if availability.break_duration:
             
                breaks = availability.break_duration if isinstance(availability.break_duration, list) else [availability.break_duration]

                for b in breaks:
                    try:
                        break_minutes = int("".join([c for c in str(b) if c.isdigit()]))
                       
                        mid_point = start_time + (end_time - start_time) / 2
                        break_start = mid_point
                        break_end = break_start + timedelta(minutes=break_minutes)
                        break_periods.append((break_start, break_end))
                    except (ValueError, TypeError):
                        continue

            # ✅ Generate slots
            current_time = start_time
            while current_time + duration <= end_time:
                slot_start = current_time
                slot_end = current_time + duration

                # Exclude break overlaps
                in_break = any(
                    slot_start < b_end and slot_end > b_start
                    for b_start, b_end in break_periods
                )

                if not in_break:
                    all_slots.append({
                        "slot_start": slot_start.strftime("%H:%M"),
                        "slot_end": slot_end.strftime("%H:%M"),
                    })

                current_time += duration

        return custom_200("Available slots fetched successfully", {
            "doctor_id": doctor.id,
            "doctor_name": doctor.doctor_name,
            "date": selected_date.strftime("%Y-%m-%d"),
            "slots": all_slots
        })


# Block or unblock doctor slots
class DoctorSlotBlockUnblockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Block a slot for a doctor
        Doctor login: { "date": "2025-08-26", "slot_start": "10:00", "slot_end": "10:30" }
        Clinic login: { "doctor_id": 1, "date": "2025-08-26", "slot_start": "10:00", "slot_end": "10:30" }
        """
        user = request.user
        doctor_id = request.data.get("doctor_id")
        date = request.data.get("date")
        slot_start = request.data.get("slot_start")
        slot_end = request.data.get("slot_end")

        if not all([date, slot_start, slot_end]):
            return custom_404("date, slot_start, slot_end are required")

       
        if user.role == "Doctor":
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")
     
        else:
            if not doctor_id:
                return custom_404("doctor_id is required for clinic/staff request")
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found")

        try:
            slot_date = datetime.strptime(date, "%Y-%m-%d").date()
            slot_start_time = datetime.strptime(slot_start, "%H:%M").time()
            slot_end_time = datetime.strptime(slot_end, "%H:%M").time()
        except ValueError:
            return custom_404("Invalid date/time format")

        blocked_slot, created = DoctorBlockedSlot.objects.update_or_create(
            doctor=doctor,
            date=slot_date,
            slot_start=slot_start_time,
            slot_end=slot_end_time,
            defaults={"is_blocked": True}
        )

        return custom_200("Slot blocked successfully", {
            "doctor": doctor.doctor_name,
            "date": slot_date,
            "slot_start": slot_start,
            "slot_end": slot_end,
            "is_blocked": blocked_slot.is_blocked
        })

    def delete(self, request):
        """
        Unblock a slot for a doctor
        Doctor login: { "date": "2025-08-26", "slot_start": "10:00", "slot_end": "10:30" }
        Clinic login: { "doctor_id": 1, "date": "2025-08-26", "slot_start": "10:00", "slot_end": "10:30" }
        """
        user = request.user
        doctor_id = request.data.get("doctor_id")
        date = request.data.get("date")
        slot_start = request.data.get("slot_start")
        slot_end = request.data.get("slot_end")

        if not all([date, slot_start, slot_end]):
            return custom_404("date, slot_start, slot_end are required")

        # Case 1: If Doctor is logged in
        if user.role == "Doctor":
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")
        # Case 2: Clinic/Staff must provide doctor_id
        else:
            if not doctor_id:
                return custom_404("doctor_id is required for clinic/staff request")
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found")

        try:
            slot_date = datetime.strptime(date, "%Y-%m-%d").date()
            slot_start_time = datetime.strptime(slot_start, "%H:%M").time()
            slot_end_time = datetime.strptime(slot_end, "%H:%M").time()
        except ValueError:
            return custom_404("Invalid date/time format")

        try:
            blocked_slot = DoctorBlockedSlot.objects.get(
                doctor=doctor,
                date=slot_date,
                slot_start=slot_start_time,
                slot_end=slot_end_time,
            )
            blocked_slot.is_blocked = False
            blocked_slot.save()
        except DoctorBlockedSlot.DoesNotExist:
            return custom_404("This slot is not blocked")

        return custom_200("Slot unblocked successfully", {
            "doctor": doctor.user.get_full_name(),
            "date": slot_date,
            "slot_start": slot_start,
            "slot_end": slot_end,
            "is_blocked": blocked_slot.is_blocked
        })


# booking appointment by clinic or patient
class AppointmentBookingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, user):
        if user.role == "Patient":
            return PatientAppointmentBookingSerializer
        elif user.role == "Doctor":
            return DoctorAppointmentBookingSerializer
        elif user.role == "Clinic":
            return ClinicAppointmentBookingSerializer
        elif user.role == "SuperAdmin":
            return SuperAdminAppointmentBookingSerializer
        return BaseAppointmentBookingSerializer

    def post(self, request):
        user = request.user
        data = request.data.copy()

        # Patient auto-attach
        if user.role == "Patient" and hasattr(user, "patient_profile"):
            data["patient"] = user.patient_profile.id
        print('----------',data)

        # Doctor auto-attach doctor_id if not provided
        if user.role == "Doctor" and hasattr(user, "doctor_profile") and not data.get("doctor"):
            data["doctor"] = user.doctor_profile.id

        serializer_class = self.get_serializer_class(user)
        serializer = serializer_class(data=data)

        if serializer.is_valid():
            appointment = serializer.save()
            send_appointment_email(appointment)
            return custom_201("Appointment booked successfully", serializer.data)

        # Now you’ll get field-level validation errors like in your example
        return custom_404(serializer.errors)




 