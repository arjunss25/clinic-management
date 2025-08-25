from rest_framework import serializers
from django.contrib.auth import authenticate
from  superadmin_app.models import *



class DoctorRegisterSerializer(serializers.ModelSerializer):
    # include extra ProfileUser fields if needed
    doctor_name = serializers.CharField(required=True)
    specialization = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = Doctor
        fields = [
            "doctor_name", "specialization", "phone", "email",
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