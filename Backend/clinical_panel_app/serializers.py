from rest_framework import serializers
from django.contrib.auth import authenticate
from  superadmin_app.models import *
from .models import *
from datetime import timedelta, datetime


class DoctorRegisterSerializer(serializers.ModelSerializer):
    # include extra ProfileUser fields if needed
    doctor_name = serializers.CharField(required=True)
    specialization = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = Doctor
        fields = [
            "id","doctor_name", "specialization", "phone", "email",
            "bio", "profile_picture", "experince_years",
            "education", "additional_qualification","created_at"
        ]
        read_only_fields = ["id", "created_at"]

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
class AppointmentBookingSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.doctor_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    class Meta:
        model = AppointmentBooking
        fields = '__all__'
        read_only_fields = ['id','created_at','doctor_name','patient_name']    



# clinic profile serlaizers
class ClinicProfileEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = [
            "clinic_name", "license_number", "location",
            "address", "phone", "specialties","about_clinic","website",
        ]


# accreditation serializer
class ClinicAccreditationSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.clinic_name', read_only=True)
    class Meta:
        model = ClinicAccreditation
        fields = ["id","clinic_name","name", "issued_by", "issue_date", "expiry_date", "document"]
        read_only_fields = ["id"]
        extra_kwargs = {'document': {'required': False},'issued_by' :{'required':False} , 'issue_date' : {'required':False} , 'expiry_date':{'required':False}}  # Make document optional        


# medical facility serializer
class ClinicMedicalFacilitySerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.clinic_name', read_only=True)
    class Meta:
        model = ClinicMedicalFacility
        fields = ["id","clinic_name","name","description"]
        read_only_fields = ["id"]        


# clinic patients amenties 
class ClinicPatientsAmenitySerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.clinic_name', read_only=True)
    class Meta:
        model = ClinicPatientAmenity
        fields = ["id","clinic_name","patient_amenities","description"]
        read_only_fields = ["id"]  
