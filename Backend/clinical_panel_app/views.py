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
from django.db import IntegrityError
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import *
from datetime import datetime, timedelta
import calendar
from authentication_app.authentication import CookieJWTAuthentication
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


<<<<<<< HEAD
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

=======
>>>>>>> 8c4c14b04225f36ed5634b20fa4755841e0dfe89

# get login clinic profile
class ClinicProfileAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
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
    # authentication_classes = [CookieJWTAuthentication]
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
            try:
                doctor = serializer.save()
            except IntegrityError:
                return custom_404("A user with this email already exists.")

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
    

# list all patients of a clinic
class ClinicPatientsListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        patients = Patient.objects.all()
        serializer = PatientRegisterSerializer(patients, many=True)
        return custom_200("Patients fetched successfully", serializer.data)

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
# class AddDoctorAvailabilityAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         user = request.user

#         # Case 1: Doctor sets their own availability
#         if user.role == "Doctor":
#             try:
#                 doctor = Doctor.objects.get(user=user)
#             except Doctor.DoesNotExist:
#                 return custom_404("Doctor profile not found")

#         # Case 2: Clinic sets availability for a doctor
#         elif user.role == "Clinic":
#             doctor_id = request.data.get("doctor")
#             if not doctor_id:
#                 return custom_404("doctor_id is required when clinic is setting availability")
#             try:
#                 doctor = Doctor.objects.get(id=doctor_id, clinic=user.clinic_profile)
#             except Doctor.DoesNotExist:
#                 return custom_404("Doctor not found for this clinic")

#         else:
#             return custom_404("Only Doctor or Clinic users can set availability")

#         serializer = DoctorAvailabilitySerializer(data=request.data)
#         if serializer.is_valid():
#             availability = serializer.save(doctor=doctor)
#             return custom_201("Availability set successfully", {
#                 "availability_id": availability.id,
#                 "doctor_id": doctor.id,
#                 "day_of_week": availability.day_of_week,
#                 "start_time": availability.start_time,
#                 "end_time": availability.end_time
#             })

#         return custom_404(serializer.errors)
    
import json
from datetime import datetime, date, time


# class AddDoctorAvailabilityAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def _parse_day_list(self, raw):
#         """
#         Normalize day_of_week field to a list of weekday names.
#         Accepts: list, JSON-string list ('["Monday","Tuesday"]'), comma-separated string.
#         """
#         if raw is None:
#             return []
#         if isinstance(raw, list):
#             return [str(x).strip() for x in raw if str(x).strip()]
#         if isinstance(raw, str):
#             raw = raw.strip()
#             # try json first
#             if raw.startswith('['):
#                 try:
#                     parsed = json.loads(raw)
#                     return [str(x).strip() for x in parsed if str(x).strip()]
#                 except Exception:
#                     pass
#             # fallback: comma separated
#             return [p.strip() for p in raw.split(',') if p.strip()]
#         return []

#     def _parse_date(self, v):
#         if not v:
#             return None
#         if isinstance(v, date):
#             return v
#         try:
#             return datetime.strptime(v, "%Y-%m-%d").date()
#         except Exception:
#             raise ValueError("Invalid date, expected YYYY-MM-DD")

#     def _parse_time(self, v):
#         if not v:
#             return None
#         if isinstance(v, time):
#             return v
#         try:
#             return datetime.strptime(v, "%H:%M").time()
#         except Exception:
#             raise ValueError("Invalid time, expected HH:MM (24h)")

#     def _date_ranges_overlap(self, s1, e1, s2, e2):
#         # None means open-ended: treat as -inf / +inf
#         s1 = s1 or date.min
#         e1 = e1 or date.max
#         s2 = s2 or date.min
#         e2 = e2 or date.max
#         return not (e1 < s2 or e2 < s1)

#     def _time_ranges_overlap(self, a_start, a_end, b_start, b_end):
#         # If any end is None, consider it overlapping (defensive)
#         if a_start is None or b_start is None:
#             return True
#         if a_end is None or b_end is None:
#             return True
#         # Normal overlap condition for same-day times:
#         return not (a_end <= b_start or b_end <= a_start)

#     def post(self, request):
#         user = request.user

#         # Determine doctor by role (same logic as you had)
#         if user.role == "Doctor":
#             try:
#                 doctor = Doctor.objects.get(user=user)
#             except Doctor.DoesNotExist:
#                 return custom_404("Doctor profile not found")
#         elif user.role == "Clinic":
#             doctor_id = request.data.get("doctor")
#             if not doctor_id:
#                 return custom_404("doctor_id is required when clinic is setting availability")
#             try:
#                 doctor = Doctor.objects.get(id=doctor_id, clinic=user.clinic_profile)
#             except Doctor.DoesNotExist:
#                 return custom_404("Doctor not found for this clinic")
#         else:
#             return custom_404("Only Doctor or Clinic users can set availability")

#         # Copy data and normalize fields
#         data = request.data.copy()

#         # day_of_week normalization
#         try:
#             day_list = self._parse_day_list(data.get("day_of_week"))
#         except Exception:
#             return custom_404("Invalid day_of_week format. Provide a list of weekdays.")
#         if not day_list:
#             return custom_404("day_of_week is required and must contain at least one weekday")

#         # parse times and dates (validate format early)
#         try:
#             start_time = self._parse_time(data.get("start_time"))
#             end_time = self._parse_time(data.get("end_time"))
#         except ValueError as e:
#             return custom_404(str(e))

#         if start_time is None:
#             return custom_404("start_time is required")
#         if end_time is None:
#             return custom_404("end_time is required")

#         # Reject overnight ranges for simplicity (start_time must be before end_time).
#         if start_time >= end_time:
#             return custom_404("start_time must be before end_time (overnight ranges are not supported)")

#         try:
#             start_date = self._parse_date(data.get("start_date"))
#             end_date = self._parse_date(data.get("end_date"))
#         except ValueError as e:
#             return custom_404(str(e))

#         # slot_duration basic parse: must contain integer minutes
#         slot_duration_raw = data.get("slot_duration")
#         try:
#             slot_minutes = int("".join([c for c in str(slot_duration_raw) if c.isdigit()]))
#             if slot_minutes <= 0:
#                 raise ValueError
#         except Exception:
#             return custom_404("slot_duration must contain positive integer minutes (e.g. '15' or '15m')")

#         # Now check for conflicts with existing availabilities of the same doctor
#         conflicts = []
#         existing_qs = doctor.availabilities.all()  # related_name in your model
#         for existing in existing_qs:
#             # normalize existing day's field which might be json/list/string
#             existing_days = existing.day_of_week if isinstance(existing.day_of_week, list) else self._parse_day_list(existing.day_of_week)

#             # If weekdays don't intersect, skip
#             if not set(day_list).intersection(set(existing_days)):
#                 continue

#             # Check date-range overlap
#             if not self._date_ranges_overlap(existing.start_date, existing.end_date, start_date, end_date):
#                 continue

#             # Check time overlap
#             if self._time_ranges_overlap(existing.start_time, existing.end_time, start_time, end_time):
#                 # Build a helpful conflict message
#                 conflicts.append({
#                     "availability_id": existing.id,
#                     "days": existing_days,
#                     "start_time": existing.start_time.strftime("%H:%M") if existing.start_time else None,
#                     "end_time": existing.end_time.strftime("%H:%M") if existing.end_time else None,
#                     "start_date": existing.start_date.strftime("%Y-%m-%d") if existing.start_date else None,
#                     "end_date": existing.end_date.strftime("%Y-%m-%d") if existing.end_date else None,
#                 })

#         if conflicts:
#             return custom_404({
#                 "message": "Conflicting availability found. The new availability overlaps with existing ones.",
#                 "conflicts": conflicts
#             })

#         # No conflicts — proceed to serializer/save
#         serializer = DoctorAvailabilitySerializer(data=data)
#         if serializer.is_valid():
#             availability = serializer.save(doctor=doctor)
#             return custom_201("Availability set successfully", {
#                 "availability_id": availability.id,
#                 "doctor_id": doctor.id,
#                 "day_of_week": availability.day_of_week,
#                 "start_time": availability.start_time,
#                 "end_time": availability.end_time
#             })

#         return custom_404(serializer.errors)
import calendar
from datetime import datetime, date as date_cls, time as time_cls, timedelta

class AddDoctorAvailabilityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Determine doctor (doctor sets their own OR clinic sets for a doctor)
        if user.role == "Doctor":
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")

        elif user.role == "Clinic":
            doctor_id = request.data.get("doctor")
            if not doctor_id:
                return custom_404("doctor_id is required when clinic is setting availability")
            try:
                # assuming clinic relation is user.clinic_profile as in your earlier code
                doctor = Doctor.objects.get(id=doctor_id, clinic=user.clinic_profile)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found for this clinic")
        else:
            return custom_404("Only Doctor or Clinic users can set availability")

        serializer = DoctorAvailabilitySerializer(data=request.data)
        if not serializer.is_valid():
            return custom_404(serializer.errors)

        # Helper functions -------------------------------------------------
        def normalize_days(value):
            """
            Accept list or comma-separated string or single string.
            Return set of weekday names like {'Monday', 'Tuesday', ...}.
            If empty or None -> treat as ALL days (for duplication safety).
            """
            ALL_DAYS = {d for d in calendar.day_name}
            if not value:
                return ALL_DAYS
            if isinstance(value, str):
                # tolerate single day or comma separated e.g. "Monday,Tuesday"
                items = [s.strip() for s in value.split(",") if s.strip()]
            elif isinstance(value, (list, tuple, set)):
                items = [str(s).strip() for s in value if s is not None]
            else:
                # unknown type -> treat as all days (safe)
                return ALL_DAYS

            days = set()
            for it in items:
                # unify to full weekday name if possible
                name = it.strip()
                if not name:
                    continue
                # allow lower/upper variants
                for d in calendar.day_name:
                    if d.lower() == name.lower():
                        days.add(d)
                        break
                else:
                    # if not recognized, ignore
                    continue
            return days or ALL_DAYS

        def parse_date(val):
            if val is None:
                return None
            if isinstance(val, date_cls):
                return val
            try:
                return datetime.strptime(val, "%Y-%m-%d").date()
            except Exception:
                return None

        def parse_time(val):
            if val is None:
                return None
            if isinstance(val, time_cls):
                return val
            for fmt in ("%H:%M", "%H:%M:%S"):
                try:
                    return datetime.strptime(val, fmt).time()
                except Exception:
                    continue
            return None

        def date_ranges_overlap(start1, end1, start2, end2):
            # treat None as open-ended range
            s1 = start1 or date_cls.min
            e1 = end1 or date_cls.max
            s2 = start2 or date_cls.min
            e2 = end2 or date_cls.max
            return not (e1 < s2 or e2 < s1)

        def time_ranges_overlap(t1_start, t1_end, t2_start, t2_end):
            # treat None end as end of day
            def _norm_start(s):
                if s is None:
                    return time_cls(0, 0, 0)
                return s
            def _norm_end(e):
                if e is None:
                    return time_cls(23, 59, 59)
                return e

            a1 = _norm_start(t1_start)
            b1 = _norm_end(t1_end)
            a2 = _norm_start(t2_start)
            b2 = _norm_end(t2_end)
            # overlap if intervals intersect
            return (a1 < b2) and (a2 < b1)

        # Extract new availability values (use validated data when possible)
        validated = serializer.validated_data

        new_day_set = normalize_days(validated.get("day_of_week") or request.data.get("day_of_week"))
        new_start_time = parse_time(validated.get("start_time") or request.data.get("start_time"))
        new_end_time = parse_time(validated.get("end_time") or request.data.get("end_time"))
        new_start_date = parse_date(validated.get("start_date") or request.data.get("start_date"))
        new_end_date = parse_date(validated.get("end_date") or request.data.get("end_date"))

        # Defensive: must have a start_time to perform meaningful duplication check
        if new_start_time is None:
            return custom_404("start_time is required or must be in HH:MM or HH:MM:SS format for duplication check")

        # Query existing availabilities for this doctor
        existing_qs = DoctorAvailability.objects.filter(doctor=doctor)

        # Check overlaps
        for exist in existing_qs:
            exist_day_set = normalize_days(exist.day_of_week)
            # If weekdays do not intersect, skip
            if new_day_set.isdisjoint(exist_day_set):
                continue

            # Parse existing date/time fields
            exist_start_date = exist.start_date
            exist_end_date = exist.end_date
            # if either range doesn't intersect in date dimension -> skip
            if not date_ranges_overlap(new_start_date, new_end_date, exist_start_date, exist_end_date):
                continue

            exist_start_time = exist.start_time
            exist_end_time = exist.end_time

            # If times overlap -> this is a duplication / overlap
            if time_ranges_overlap(new_start_time, new_end_time, exist_start_time, exist_end_time):
                # Build useful message with conflict details
                conflict_days = sorted(list(new_day_set.intersection(exist_day_set)))
                msg = (
                    "Availability overlaps with an existing availability."
                    f" Existing availability id={exist.id}, days={exist.day_of_week},"
                    f" time={exist.start_time} - {exist.end_time},"
                    f" date_range={exist.start_date} - {exist.end_date}."
                    f" Overlapping weekdays: {conflict_days}."
                )
                return custom_404(msg)

        # No overlaps found -> safe to save
        availability = serializer.save(doctor=doctor)
        return custom_201("Availability set successfully", {
            "availability_id": availability.id,
            "doctor_id": doctor.id,
            "day_of_week": availability.day_of_week,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "start_date": availability.start_date,
            "end_date": availability.end_date,
        })


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



# # list available slots for a doctor on a given date

# class DoctorAvailabilityListAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, doctor_id=None, date=None):
#         user = request.user

       
#         if not date:
#             return custom_404("date is required (format: YYYY-MM-DD)")

#         try:
#             selected_date = datetime.strptime(date, "%Y-%m-%d").date()
#         except ValueError:
#             return custom_404("Invalid date format, expected YYYY-MM-DD")

#         # Logged-in Doctor (no doctor_id required)
#         if user.role == "Doctor" and doctor_id is None:
#             try:
#                 doctor = Doctor.objects.get(user=user)
#             except Doctor.DoesNotExist:
#                 return custom_404("Doctor profile not found")

#         #  Clinic or Patient providing doctor_id
#         else:
#             if not doctor_id:
#                 return custom_404("doctor_id is required for this request")
#             try:
#                 doctor = Doctor.objects.get(id=doctor_id)
#             except Doctor.DoesNotExist:
#                 return custom_404("Doctor not found")

        
#         day_of_week = calendar.day_name[selected_date.weekday()]

#         #  Query doctor availability
#         availabilities_qs = DoctorAvailability.objects.filter(
#             doctor=doctor,
#             start_date__lte=selected_date
#         ).filter(
#             models.Q(end_date__isnull=True) | models.Q(end_date__gte=selected_date)
#         )

#         #  Filter by weekday in Python
#         availabilities = [
#             a for a in availabilities_qs
#             if day_of_week in a.day_of_week
#         ]

#         if not availabilities:
#             return custom_404("No availability found for this doctor on given date")

#         all_slots = []

#         for availability in availabilities:
#             start_time = datetime.combine(selected_date, availability.start_time)
#             end_time = datetime.combine(selected_date, availability.end_time)

#             try:
#                 slot_minutes = int("".join([c for c in availability.slot_duration if c.isdigit()]))
#                 duration = timedelta(minutes=slot_minutes)
#             except (ValueError, TypeError):
#                 return custom_404("Invalid slot_duration format, must contain integer minutes")

           
#             break_periods = []
#             if availability.break_duration:
             
#                 breaks = availability.break_duration if isinstance(availability.break_duration, list) else [availability.break_duration]

#                 for b in breaks:
#                     try:
#                         break_minutes = int("".join([c for c in str(b) if c.isdigit()]))
                       
#                         mid_point = start_time + (end_time - start_time) / 2
#                         break_start = mid_point
#                         break_end = break_start + timedelta(minutes=break_minutes)
#                         break_periods.append((break_start, break_end))
#                     except (ValueError, TypeError):
#                         continue

#             # ✅ Generate slots
#             current_time = start_time
#             while current_time + duration <= end_time:
#                 slot_start = current_time
#                 slot_end = current_time + duration

#                 # Exclude break overlaps
#                 in_break = any(
#                     slot_start < b_end and slot_end > b_start
#                     for b_start, b_end in break_periods
#                 )

#                 if not in_break:
#                     all_slots.append({
#                         "slot_start": slot_start.strftime("%H:%M"),
#                         "slot_end": slot_end.strftime("%H:%M"),
#                     })

#                 current_time += duration

#         return custom_200("Available slots fetched successfully", {
#             "doctor_id": doctor.id,
#             "doctor_name": doctor.doctor_name,
#             "date": selected_date.strftime("%Y-%m-%d"),
#             "slots": all_slots
#         })
    
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

        # Clinic or Patient providing doctor_id
        else:
            if not doctor_id:
                return custom_404("doctor_id is required for this request")
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found")

        day_of_week = calendar.day_name[selected_date.weekday()]

        # Query doctor availability
        availabilities_qs = DoctorAvailability.objects.filter(
            doctor=doctor,
            start_date__lte=selected_date
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=selected_date)
        )

        # Filter by weekday in Python
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

        # 🚫 Exclude unavailable slots from DoctorUnavailableSlot
        unavailable = DoctorUnavailableSlot.objects.filter(
            doctor=doctor,
            date=selected_date
        ).values_list("slot_start", "slot_end")

        unavailable_set = {(s.strftime("%H:%M"), e.strftime("%H:%M")) for s, e in unavailable}

        filtered_slots = [
            slot for slot in all_slots
            if (slot["slot_start"], slot["slot_end"]) not in unavailable_set
        ]

        return custom_200("Available slots fetched successfully", {
            "doctor_id": doctor.id,
            "doctor_name": doctor.doctor_name,
            "date": selected_date.strftime("%Y-%m-%d"),
            "slots": filtered_slots
        })
<<<<<<< HEAD
=======

>>>>>>> 8c4c14b04225f36ed5634b20fa4755841e0dfe89


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

# delete slots
class DoctorSlotDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, doctor_id=None):
        user = request.user
        data = request.data

        date = data.get("date")
        slot_start = data.get("slot_start")
        slot_end = data.get("slot_end")

        if not all([date, slot_start, slot_end]):
            return custom_404("date, slot_start, and slot_end are required")

        try:
            date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            start_time = datetime.strptime(slot_start, "%H:%M").time()
            end_time = datetime.strptime(slot_end, "%H:%M").time()
        except ValueError:
            return custom_404("Invalid date or time format")

        # If doctor logs in, use their ID
        if user.role == "Doctor" and doctor_id is None:
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")
        else:
            if not doctor_id:
                return custom_404("doctor_id is required")
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found")

        # Save to DoctorUnavailableSlot
        unavailable, created = DoctorUnavailableSlot.objects.get_or_create(
            doctor=doctor,
            date=date_obj,
            slot_start=start_time,
            slot_end=end_time
        )

        if not created:
            return custom_404("Slot already marked as deleted")

        return custom_200("Slot deleted successfully", {
            "doctor_id": doctor.id,
            "date": date,
            "slot_start": slot_start,
            "slot_end": slot_end
        })

# patient register and profile view and update
class PatientRegisterAPI(APIView):
    def get(self, request, patient_id, *args, **kwargs):
        """Fetch a patient's details by ID"""
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return custom_404("Patient not found")

        serializer = PatientRegisterSerializer(patient)
        return custom_200("Profile listed successfully",serializer.data)


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

            return custom_201( "Patient registered successfully, login credentials sent to email.")
        return custom_404(serializer.errors)
    
    def patch(self, request, patient_id, *args, **kwargs):
        
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return custom_404("Patient not found")

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

            return custom_200("Patient profile updated successfully")
        return custom_404(serializer.errors)


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


# list all patients of the clinic
# class ClinicPatientsListAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         if request.user.role != "Clinic":
#             return custom_404("Only Clinic users can access this endpoint")

#         try:
#             clinic = Clinic.objects.get(user=request.user)
#         except Clinic.DoesNotExist:
#             return custom_404("Clinic profile not found")

#         # Get all doctors in this clinic
#         doctors = Doctor.objects.filter(clinic=clinic)

#         # Get all patients who have appointments with these doctors
#         patients = Patient.objects.filter(appointments__doctor__in=doctors).distinct()

#         serializer = PatientRegisterSerializer(patients, many=True)
#         return custom_200("Patients fetched successfully", serializer.data)

<<<<<<< HEAD
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

=======
#booking appointment by clinic or patient

class AppointmentBookingAPI(APIView):
    permission_classes = [IsAuthenticated]

>>>>>>> 8c4c14b04225f36ed5634b20fa4755841e0dfe89
    def post(self, request):
        user = request.user
        data = request.data.copy()

<<<<<<< HEAD
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
=======
        # Case 1: Patient booking themselves
        if hasattr(user, "patient_profile"):  
            data["patient"] = user.patient_profile.id

        # Case 2: Clinic/staff booking by giving patient_id
        else:
            patient_id = data.get("patient")
            if not patient_id:
                return custom_404("patient_id is required when clinic is booking")
            data["patient"] = patient_id

        serializer = AppointmentBookingSerializer(data=data)
        if serializer.is_valid():
            appointment = serializer.save()

            # Send notification emails
            send_appointment_email(appointment)

            return custom_201( "Appointment booked successfully", serializer.data )
        return custom_404(serializer.errors)


# list all todays appointments of doctors in the clinic 
class TodaysAppointmentFilterBySpecializationAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, specialization):
        if not specialization:
            return custom_404("specialization query param is required")

        # Find all doctors with given specialization
        doctors = Doctor.objects.filter(specialization__iexact=specialization)

        if not doctors.exists():
            return custom_404(f"No doctors found for specialization '{specialization}'")

        # Get today's date
        today = timezone.now().date()

        # Fetch today's appointments for those doctors
        appointments = AppointmentBooking.objects.filter(
            doctor__in=doctors,
            appointment_date=today
        ).order_by("appointment_date", "start_time")

        if not appointments.exists():
            return custom_404(f"No appointments found for specialization '{specialization}' today")

        serializer = AppointmentBookingSerializer(appointments, many=True)
        return custom_200("Today's appointments listed successfully", serializer.data)
# list all appointments of doctors in the clinic
class ClinicAppointmentsListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can access this endpoint")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

       
        doctors = Doctor.objects.filter(clinic=clinic)

       
        appointments = AppointmentBooking.objects.filter(doctor__in=doctors).order_by('-appointment_date', '-start_time')

        serializer = AppointmentBookingSerializer(appointments, many=True)
        return custom_200("Appointments fetched successfully", serializer.data)    

# list appointments based on each specialization

class AppointmentFilterBySpecializationAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,specialization):
        # specialization = request.query_params.get("specialization")

        if not specialization:
            return custom_404("specialization query param is required")

        # Find all doctors with given specialization
        doctors = Doctor.objects.filter(specialization__iexact=specialization)

        if not doctors.exists():
            return custom_404(f"No doctors found for specialization '{specialization}'" )

        # Fetch appointments for those doctors
        appointments = AppointmentBooking.objects.filter(doctor__in=doctors).order_by("appointment_date", "start_time")

        serializer = AppointmentBookingSerializer(appointments, many=True)
        return custom_200("Appointment listed successfully",serializer.data)



# list clinics specialties based on login clinic
class ClinicSpecialtiesListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can access this endpoint")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        specialties = clinic.specialties.all()
        serializer = SpecialtySerializer(specialties, many=True)
        return custom_200("Specialties fetched successfully", serializer.data)
   

# list doctors based on clinic specializations
class ClinicDoctorsBySpecialtyAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, specialty_name):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can access this endpoint")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        doctors = Doctor.objects.filter(
            clinic=clinic,
            specialization__iexact=specialty_name
        )

        if not doctors.exists():
            return custom_404("No doctors found for this specialty in your clinic")

        serializer = DoctorRegisterSerializer(doctors, many=True)
        return custom_200("Doctors fetched successfully", serializer.data)   
    

# total patients , todays appointments , todays appointments completed , total wiating list and total no shows appointments count for clinic dashboard
class ClinicDashboardStatsCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can access this endpoint")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        # Total patients associated with this clinic's doctors
        doctors = Doctor.objects.filter(clinic=clinic)
        total_patients = Patient.objects.count()

        # Today's date
        today = datetime.now().date()

        # Today's appointments for this clinic's doctors
        todays_appointments = AppointmentBooking.objects.filter(
            doctor__in=doctors,
            appointment_date=today
        )

        total_todays_appointments = todays_appointments.count()
        total_completed_appointments = todays_appointments.filter(status="Completed").count()
        total_waiting_list = AppointmentBooking.objects.filter(
            doctor__in=doctors,
            status="Waiting List"
        ).count()
        total_no_shows = AppointmentBooking.objects.filter(
            doctor__in=doctors,
            status="No-Show"
        ).count()

        stats = {
            "total_patients": total_patients,
            "total_todays_appointments": total_todays_appointments,
            "total_completed_appointments": total_completed_appointments,
            "total_waiting_list": total_waiting_list,
            "total_no_shows": total_no_shows
        }

        return custom_200("Dashboard stats fetched successfully", stats)    
    


# clinic profile section api s
class ClinicProfileEditAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        # ✅ Ensure only clinic users can edit their profile
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can edit clinic profile")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        serializer = ClinicProfileEditSerializer(clinic, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return custom_201("Clinic profile updated successfully", serializer.data)

        return custom_404(serializer.errors)

# add and list clinic accreditations
class ClinicAccreditationAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Only Clinic users can list their accreditations
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can view accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        accreditations = clinic.accreditations.all()
        serializer = ClinicAccreditationSerializer(accreditations, many=True)
        return custom_201("Clinic accreditations fetched successfully", serializer.data)

    # def post(self, request):
    #     if request.user.role != "Clinic":
    #         return custom_404("Only Clinic users can add accreditations")

    #     try:
    #         clinic = Clinic.objects.get(user=request.user)
    #     except Clinic.DoesNotExist:
    #         return custom_404("Clinic profile not found")
    #     name = request.data.get("name")
    #     if ClinicAccreditation.objects.filter(clinic=clinic, name__iexact=name).exists():
    #      return custom_404(f"Accreditation with name '{name}' already exists for this clinic")
    #     serializer = ClinicAccreditationSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save(clinic=clinic)
    #         return custom_201("Accreditation added successfully", serializer.data)
    #     return custom_404(serializer.errors)
    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        # ✅ Handle both single and multiple accreditations
        data = request.data
        if isinstance(data, dict):  
            data = [data]  # wrap single object into a list

        serializer = ClinicAccreditationSerializer(data=data, many=True)
        if serializer.is_valid():
            # Check duplicates before saving
            for item in serializer.validated_data:
                name = item.get("name")
                if ClinicAccreditation.objects.filter(clinic=clinic, name__iexact=name).exists():
                    return custom_404(f"Accreditation with name '{name}' already exists for this clinic")

            # Save with clinic reference
            serializer.save(clinic=clinic)
            return custom_201("Accreditation(s) added successfully", serializer.data)

        return custom_404(serializer.errors)   
    def patch(self, request, accreditation_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can update accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            accreditation = ClinicAccreditation.objects.get(id=accreditation_id, clinic=clinic)
        except ClinicAccreditation.DoesNotExist:
            return custom_404("Accreditation not found")

        serializer = ClinicAccreditationSerializer(accreditation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return custom_201("Accreditation updated successfully", serializer.data)
        return custom_404(serializer.errors)


# delete clinic accreditations
class ClinicAccreditationDeleteAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, accreditation_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can delete accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            accreditation = ClinicAccreditation.objects.get(id=accreditation_id, clinic=clinic)
        except ClinicAccreditation.DoesNotExist:
            return custom_404("Accreditation not found")

        accreditation.delete()
        return custom_201("Accreditation deleted successfully", None)


# add list delete clinic medical patient facilities
class ClinicMedicalFacilityAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Only Clinic users can list their facilities
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can view medical patient facilities")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        facilities = clinic.medical_facilities.all()
        serializer = ClinicMedicalFacilitySerializer(facilities, many=True)
        return custom_201("Medical facilities fetched successfully", serializer.data)

    # def post(self, request):
    #     if request.user.role != "Clinic":
    #         return custom_404("Only Clinic users can add medical patient facilities")

    #     try:
    #         clinic = Clinic.objects.get(user=request.user)
    #     except Clinic.DoesNotExist:
    #         return custom_404("Clinic profile not found")
        

    #     name = request.data.get("name")
    #     if ClinicMedicalFacility.objects.filter(clinic=clinic, name__iexact=name).exists():
    #         return custom_404(f"Facility with name '{name}' already exists for this clinic")

    #     serializer = ClinicMedicalFacilitySerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save(clinic=clinic)
    #         return custom_201("Medical  facility added successfully", serializer.data)
    #     return custom_404(serializer.errors)
    
    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add medical patient facilities")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        # ✅ Handle both single and multiple objects
        data = request.data
        if isinstance(data, dict):
            data = [data]

        serializer = ClinicMedicalFacilitySerializer(data=data, many=True)
        if serializer.is_valid():
            for item in serializer.validated_data:
                name = item.get("name")
                if ClinicMedicalFacility.objects.filter(clinic=clinic, name__iexact=name).exists():
                    return custom_404(f"Facility with name '{name}' already exists for this clinic")

            serializer.save(clinic=clinic)
            return custom_201("Medical facilities added successfully", serializer.data)

        return custom_404(serializer.errors)
    def patch(self, request, facility_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can update accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            facility = ClinicMedicalFacility.objects.get(id=facility_id, clinic=clinic)
        except ClinicMedicalFacility.DoesNotExist:
            return custom_404("Facility not found")

        serializer = ClinicMedicalFacilitySerializer(facility, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return custom_201("Facility updated successfully", serializer.data)
        return custom_404(serializer.errors)
    



# delete clinic accreditations
class ClinicMedicalFacilitiesDeleteAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, facility_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can delete accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            accreditation = ClinicMedicalFacility.objects.get(id=facility_id, clinic=clinic)
        except ClinicMedicalFacility.DoesNotExist:
            return custom_404("Facility not found")

        accreditation.delete()
        return custom_201("Facility deleted successfully", None)    
    

# add , list , delete patient amenities    
class ClinicPatientAmenitiesAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Only Clinic users can list their facilities
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can view medical patient facilities")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        facilities = clinic.patient_amenities.all()
        serializer = ClinicPatientsAmenitySerializer(facilities, many=True)
        return custom_201("Medical facilities fetched successfully", serializer.data)

    # def post(self, request):
    #     if request.user.role != "Clinic":
    #         return custom_404("Only Clinic users can add medical patient facilities")

    #     try:
    #         clinic = Clinic.objects.get(user=request.user)
    #     except Clinic.DoesNotExist:
    #         return custom_404("Clinic profile not found")

    #     patient_amenities = request.data.get("patient_amenities")
    #     if ClinicPatientAmenity.objects.filter(clinic=clinic, patient_amenities__iexact=patient_amenities).exists():
    #         return custom_404(f"Amenity with name '{patient_amenities}' already exists for this clinic")

    #     serializer = ClinicPatientsAmenitySerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save(clinic=clinic)
    #         return custom_201("Patient Amenity added successfully", serializer.data)
    #     return custom_404(serializer.errors)
    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add patient amenities")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        # ✅ Handle both single and multiple objects
        data = request.data
        if isinstance(data, dict):
            data = [data]

        serializer = ClinicPatientsAmenitySerializer(data=data, many=True)
        if serializer.is_valid():
            for item in serializer.validated_data:
                name = item.get("patient_amenities")
                if ClinicPatientAmenity.objects.filter(clinic=clinic, patient_amenities__iexact=name).exists():
                    return custom_404(f"Amenity with name '{name}' already exists for this clinic")

            serializer.save(clinic=clinic)
            return custom_201("Patient amenities added successfully", serializer.data)

        return custom_404(serializer.errors)
    def patch(self, request, amenity_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can update accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            amenity = ClinicPatientAmenity.objects.get(id=amenity_id, clinic=clinic)
        except ClinicPatientAmenity.DoesNotExist:
            return custom_404("Amenity not found")

        serializer = ClinicPatientsAmenitySerializer(amenity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return custom_201("Amenity updated successfully", serializer.data)
        return custom_404(serializer.errors)
    
# delete clinic patient amenity
class ClinicPatientAmenityDeleteAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, amenity_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can delete accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            amenity = ClinicPatientAmenity.objects.get(id=amenity_id, clinic=clinic)
        except ClinicPatientAmenity.DoesNotExist:
            return custom_404("Amenity not found")

        amenity.delete()
        return custom_201("Amenity deleted successfully", None) 


# working hours add , list , update , delete
class ClinicWorkingHoursAPIView(APIView):
    """
    API for a logged-in clinic to GET and PATCH its working hours
    """

    def get(self, request):
        """List working hours for the logged-in clinic"""
        try:
            clinic = request.user.clinic_profile  # because of OneToOneField in Clinic model
        except Clinic.DoesNotExist:
            return custom_404("Clinic not found for this user")

        hours = clinic.working_hours.all()
        serializer = ClinicWorkingHoursSerializer(hours, many=True)
        return custom_200("Working hours listed successfully", serializer.data)

    def patch(self, request):
        """
        Add or update working hours for multiple days (for the logged-in clinic).
        Payload: {
            "working_hours": [
                {"day_of_week": "Monday", "opening_time": "08:00", "closing_time": "20:00", "is_available": true},
                {"day_of_week": "Sunday", "is_available": false}
            ]
        }
        """
        try:
            clinic = request.user.clinic_profile
        except Clinic.DoesNotExist:
            return custom_404("Clinic not found for this user")

        data = request.data.get("working_hours", [])
        response_data = []

        for wh in data:
            day = wh.get("day_of_week")
            opening = wh.get("opening_time")
            closing = wh.get("closing_time")
            available = wh.get("is_available", True)

            obj, created = ClinicWorkingHours.objects.update_or_create(
                clinic=clinic,
                day_of_week=day,
                defaults={
                    "opening_time": opening if available else None,
                    "closing_time": closing if available else None,
                    "is_available": available
                }
            )
            response_data.append({
                "day_of_week": obj.day_of_week,
                "opening_time": obj.opening_time,
                "closing_time": obj.closing_time,
                "is_available": obj.is_available,
                "created": created
            })

        return custom_201("Working hours created or updated successfully", response_data)


# edit clinic address
class ClinicAddressEditAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        # ✅ Ensure only clinic users can edit their profile
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can edit clinic address")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        serializer = ClinicAddressEditSerializer(clinic, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return custom_201("Clinic address updated successfully", serializer.data)

        return custom_404(serializer.errors)
    
# edit contact information
class ClinicContactInfoEditAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        # ✅ Ensure only clinic users can edit their profile
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can edit clinic contact information")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        serializer = ClinicContactInfoEditSerializer(clinic, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return custom_201("Clinic contact information updated successfully", serializer.data)

        return custom_404(serializer.errors)    
    

# add specialties as list and edit
class ClinicSpecialtiesAddListAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Only Clinic users can list their specialties
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can view specialties")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        specialties = clinic.specialties.all()
        serializer = SpecialtySerializer(specialties, many=True)
        return custom_201("Specialties fetched successfully", serializer.data)

    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add specialties")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        # ✅ Handle both single and multiple specialties
        data = request.data
        if isinstance(data, dict):
            data = [data]

        serializer = SpecialtySerializer(data=data, many=True)
        if serializer.is_valid():
            for item in serializer.validated_data:
                name = item.get("name")
                if clinic.specialties.filter(name__iexact=name).exists():
                    return custom_404(f"Specialty with name '{name}' already exists for this clinic")

            # Add specialties to clinic
            for specialty_data in serializer.validated_data:
                specialty, created = Specialty.objects.get_or_create(name=specialty_data["name"])
                clinic.specialties.add(specialty)

            clinic.save()
            return custom_201("Specialties added successfully", SpecialtySerializer(clinic.specialties.all(), many=True).data)

>>>>>>> 8c4c14b04225f36ed5634b20fa4755841e0dfe89
        return custom_404(serializer.errors)



<<<<<<< HEAD

 
=======
# edit specialties
    
# delete clinic specialty
class ClinicSpecialtyDeleteAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, specialty_id):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can delete specialties")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        try:
            specialty = Specialty.objects.get(id=specialty_id)
        except Specialty.DoesNotExist:
            return custom_404("Specialty not found")

        clinic.specialties.remove(specialty)
        return custom_201("Specialty removed from clinic successfully", None)    
    

# medical reports upload and list
class MedicalReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id=None):
        """List all reports or fetch a single report by ID"""
        if report_id:
            try:
                report = MedicalReport.objects.get(id=report_id)
            except MedicalReport.DoesNotExist:
                return custom_404("Medical report not found")
            serializer = MedicalReportSerializer(report)
            return custom_200("Medical reports listed",serializer.data)

        reports = MedicalReport.objects.all()
        serializer = MedicalReportSerializer(reports, many=True)
        return custom_200("Medical report listed",serializer.data)

    def post(self, request):
        """Add a new report"""
        serializer = MedicalReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_201("Medical report created successfully",  serializer.data)
        return custom_404(serializer.errors)

    def put(self, request, report_id):
        """Update a report (full update)"""
        try:
            report = MedicalReport.objects.get(id=report_id)
        except MedicalReport.DoesNotExist:
            return Response({"error": "Medical report not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MedicalReportSerializer(report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Medical report updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, report_id):
        """Partial update"""
        try:
            report = MedicalReport.objects.get(id=report_id)
        except MedicalReport.DoesNotExist:
            return custom_404("Medical report not found")

        serializer = MedicalReportSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return custom_200("Medical report updated successfully", serializer.data)
        return custom_404(serializer.errors)

    def delete(self, request, report_id):
        """Delete a report"""
        try:
            report = MedicalReport.objects.get(id=report_id)
        except MedicalReport.DoesNotExist:
            return custom_404("Medical report not found")

        report.delete()
        return custom_200("Medical report deleted successfully") 
    
# list all medical reports of particular patient
class PatientMedicalReportsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return custom_404("Patient not found")

        reports = MedicalReport.objects.filter(patient=patient)
        serializer = MedicalReportSerializer(reports, many=True)
        return custom_200("Medical reports fetched successfully", serializer.data)    
>>>>>>> 8c4c14b04225f36ed5634b20fa4755841e0dfe89
