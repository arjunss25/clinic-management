from rest_framework import serializers
from django.contrib.auth import authenticate
from  superadmin_app.models import *
from clinical_panel_app.models import *
from datetime import timedelta, datetime


# serializer for doctor profile
class DoctorProfileSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source="clinic.clinic_name", read_only=True)
    class Meta:
        model = Doctor
        fields = [
            "id","user","doctor_name","clinic_name","specialization", "phone", "email",
            "bio", "profile_picture", "experince_years",
            "education", "additional_qualification","appointment_amount","created_at"
        ]
        read_only_fields = ["id", "created_at"]