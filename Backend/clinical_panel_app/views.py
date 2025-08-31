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
from datetime import datetime, timedelta
import calendar
from authentication_app.authentication import CookieJWTAuthentication
# Create your views here.



# get login clinic profile
class ClinicProfileAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
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
    authentication_classes = [CookieJWTAuthentication]
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

        # ✅ validate date
        if not date:
            return custom_404("date is required (format: YYYY-MM-DD)")

        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return custom_404("Invalid date format, expected YYYY-MM-DD")

        # ✅ Case 1: Logged-in Doctor (no doctor_id required)
        if user.role == "Doctor" and doctor_id is None:
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return custom_404("Doctor profile not found")

        # ✅ Case 2: Clinic or Patient providing doctor_id
        else:
            if not doctor_id:
                return custom_404("doctor_id is required for this request")
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return custom_404("Doctor not found")

        # ✅ Get weekday name (e.g., "Monday")
        day_of_week = calendar.day_name[selected_date.weekday()]

        # ✅ Query doctor availability
        availabilities_qs = DoctorAvailability.objects.filter(
            doctor=doctor,
            start_date__lte=selected_date
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=selected_date)
        )

        # ✅ Filter by weekday in Python
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

            # ✅ Parse slot_duration like "30 minutes" → 30
            try:
                slot_minutes = int("".join([c for c in availability.slot_duration if c.isdigit()]))
                duration = timedelta(minutes=slot_minutes)
            except (ValueError, TypeError):
                return custom_404("Invalid slot_duration format, must contain integer minutes")

            # ✅ Handle breaks
            break_periods = []
            if availability.break_duration:
                # If multiple breaks are stored, assume list, else single string
                breaks = availability.break_duration if isinstance(availability.break_duration, list) else [availability.break_duration]

                for b in breaks:
                    try:
                        break_minutes = int("".join([c for c in str(b) if c.isdigit()]))
                        # Example: take mid-shift break at the middle of availability window
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

        # Case 1: If Doctor is logged in → get their profile
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



#booking appointment by clinic or patient

class AppointmentBookingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data.copy()

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
        total_patients = Patient.objects.filter(appointments__doctor__in=doctors).distinct().count()

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
    authentication_classes = [CookieJWTAuthentication]
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
    authentication_classes = [CookieJWTAuthentication]
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

    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add accreditations")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")
        name = request.data.get("name")
        if ClinicAccreditation.objects.filter(clinic=clinic, name__iexact=name).exists():
         return custom_404(f"Accreditation with name '{name}' already exists for this clinic")
        serializer = ClinicAccreditationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(clinic=clinic)
            return custom_201("Accreditation added successfully", serializer.data)
        return custom_404(serializer.errors)


# delete clinic accreditations
class ClinicAccreditationDeleteAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
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
    authentication_classes = [CookieJWTAuthentication]
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

    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add medical patient facilities")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        name = request.data.get("name")
        if ClinicMedicalFacility.objects.filter(clinic=clinic, name__iexact=name).exists():
            return custom_404(f"Facility with name '{name}' already exists for this clinic")

        serializer = ClinicMedicalFacilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(clinic=clinic)
            return custom_201("Medical  facility added successfully", serializer.data)
        return custom_404(serializer.errors)
    



# delete clinic accreditations
class ClinicMedicalFacilitiesDeleteAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
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
    authentication_classes = [CookieJWTAuthentication]
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

    def post(self, request):
        if request.user.role != "Clinic":
            return custom_404("Only Clinic users can add medical patient facilities")

        try:
            clinic = Clinic.objects.get(user=request.user)
        except Clinic.DoesNotExist:
            return custom_404("Clinic profile not found")

        patient_amenities = request.data.get("patient_amenities")
        if ClinicPatientAmenity.objects.filter(clinic=clinic, patient_amenities__iexact=patient_amenities).exists():
            return custom_404(f"Amenity with name '{patient_amenities}' already exists for this clinic")

        serializer = ClinicPatientsAmenitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(clinic=clinic)
            return custom_201("Patient Amenity added successfully", serializer.data)
        return custom_404(serializer.errors)
    
# delete clinic patient amenity
class ClinicPatientAmenityDeleteAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
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
