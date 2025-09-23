from rest_framework import serializers
from superadmin_app.models import *
from .models import *
from datetime import timedelta, datetime
from django.contrib.auth import authenticate
from django.utils import timezone
import datetime


class PatientRegisterSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(required=True)

    # Input field (write-only)
    email = serializers.EmailField(write_only=True, required=True)
    # Output field (read-only, mapped from user relation)
    email_display = serializers.EmailField(source="user.email", read_only=True)
 
    phone_number = serializers.CharField(required=True, min_length=10, max_length=15)

    class Meta:
        model = Patient
        fields = [
            "full_name",
            "age",
            "gender",
            "phone_number",
            "email",
            "blood_group",
            "emergency_contact_name",
            "emergency_contact_phone",
            "address",
            "known_allergies",
            "email",          # for POST/PATCH input
            "email_display",  # for GET response
        ]

    # ✅ Field-level validation
    def validate_age(self, value):
        if value <= 0:
            raise serializers.ValidationError("Age must be a positive number.")
        return value

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain digits only.")
        return value
    def validate_email(self, value):
        if ProfileUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    # ✅ Object-level validation (cross-checks + unknown fields)
    def validate(self, data):
        # Reject wrong field names
        for field in self.initial_data.keys():
            if field not in self.fields:
                raise serializers.ValidationError({field: "This field is not allowed."})

        # Gender check
        if data.get("gender") and data["gender"] not in ["Male", "Female", "Other"]:
            raise serializers.ValidationError({"gender": "Invalid gender choice."})
        return data
        

class PatientVitalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientVitals
        fields = [
            "id",
            "patient",
            "blood_pressure",
            "heart_rate",
            "temperature",
            "oxygen_saturation",
            "respiratory_rate",
            "weight",
            "height",
            "bmi",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["bmi", "created_at", "updated_at"]

    def validate(self, data):
        patient = self.context.get("patient")
        today = timezone.localdate()
        
        # Only check for duplicates on create
        if self.instance is None and patient is not None:
            exists = PatientVitals.objects.filter(
                patient=patient,
                created_at__date=today
            ).exists()
            if exists:
                raise serializers.ValidationError("Vitals for this patient have already been entered today.")

        # Existing realism checks
        if data.get("oxygen_saturation") and (data["oxygen_saturation"] < 50 or data["oxygen_saturation"] > 100):
            raise serializers.ValidationError({"oxygen_saturation": "Enter a valid percentage (50–100)."})
        if data.get("temperature") and (data["temperature"] < 90 or data["temperature"] > 110):
            raise serializers.ValidationError({"temperature": "Enter a realistic body temperature in °F."})
        return data



class DoctorRegisterSerializer(serializers.ModelSerializer):
    # include extra ProfileUser fields if needed
    clinic_name = serializers.CharField(source="clinic.clinic_name", read_only=True)
    doctor_name = serializers.CharField(required=True)
    specialization = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = Doctor
        fields = [
            "clinic_name","doctor_name", "specialization", "phone", "email",
            "bio", "profile_picture", "experince_years",
            "education", "additional_qualification"
        ]

    def create(self, validated_data):
        clinic = self.context.get("clinic")
        password = self.context.get("password")

        # ✅ Create ProfileUser first
        user = ProfileUser.objects.create_user(
            email=validated_data["email"],
            password=password,
            role="Doctor",
            username=None
        )

        # ✅ Create Doctor profile
        doctor = Doctor.objects.create(
            user=user,
            clinic=clinic,
            **validated_data
        )
        return doctor
    


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = [
            "id", "doctor", "day_of_week", "start_time", "end_time",
            "start_date", "end_date", "slot_duration", "break_duration",
            "notes", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def validate_day_of_week(self, value):
        allowed_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for day in value:
            if day not in allowed_days:
                raise serializers.ValidationError(f"{day} is not a valid weekday")
        return value

    def validate(self, attrs):
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")
        slot_duration = attrs.get("slot_duration")
        break_duration = attrs.get("break_duration")

        # Convert str → int safely
        if isinstance(slot_duration, str):
            try:
                slot_duration = int(slot_duration)
                attrs["slot_duration"] = slot_duration
            except ValueError:
                raise serializers.ValidationError({"slot_duration": "Must be an integer"})

        if isinstance(break_duration, str):
            try:
                break_duration = int(break_duration)
                attrs["break_duration"] = break_duration
            except ValueError:
                raise serializers.ValidationError({"break_duration": "Must be an integer"})

        # Auto-calculate end_time if not provided
        if start_time and not end_time and slot_duration:
            end_time = (datetime.combine(datetime.today(), start_time) +
                        timedelta(minutes=slot_duration)).time()
            attrs["end_time"] = end_time

        return attrs

# appointment booking serializer

class BaseAppointmentBookingSerializer(serializers.ModelSerializer):
    def validate(self, data):
        doctor = data.get("doctor")
        patient = data.get("patient")
        date = data.get("appointment_date")
        start = data.get("start_time")
        end = data.get("end_time")

        # Combine date + time for full datetime
        start_datetime = datetime.datetime.combine(date, start)
        end_datetime = datetime.datetime.combine(date, end)

        # Make them timezone-aware
        start_datetime = timezone.make_aware(start_datetime, timezone.get_current_timezone())
        end_datetime = timezone.make_aware(end_datetime, timezone.get_current_timezone())

        now = timezone.now()

        # 1️⃣ Prevent booking for past dates/times
        if start_datetime < now:
            raise serializers.ValidationError({
                "appointment_date": "Cannot book appointment in the past."
            })

        if end_datetime <= start_datetime:
            raise serializers.ValidationError({
                "end_time": "End time must be after start time."
            })

        # 2️⃣ Prevent overlapping appointments
        overlapping = AppointmentBooking.objects.filter(
            doctor=doctor,
            appointment_date=date,
            start_time__lt=end,
            end_time__gt=start
        )
        if self.instance:  # exclude self if update
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise serializers.ValidationError({
                "appointment": "This time slot is already booked."
            })

        return data



class PatientAppointmentBookingSerializer(BaseAppointmentBookingSerializer):
    class Meta:
        model = AppointmentBooking
        exclude = ['id', 'created_at']
        read_only_fields = ['patient']

class DoctorAppointmentBookingSerializer(BaseAppointmentBookingSerializer):
    class Meta:
        model = AppointmentBooking
        exclude = ['id', 'created_at']
        extra_kwargs = {
            "patient": {"required": True},
            "appointment_date": {"required": True},
            "start_time": {"required": True},
            "end_time": {"required": True},
            "reason_for_visit": {"required": True},
        }

class ClinicAppointmentBookingSerializer(BaseAppointmentBookingSerializer):
    class Meta:
        model = AppointmentBooking
        exclude = ['id', 'created_at']

class SuperAdminAppointmentBookingSerializer(BaseAppointmentBookingSerializer):
    class Meta:
        model = AppointmentBooking
        exclude = ['id', 'created_at']

