from rest_framework import serializers
from superadmin_app.models import Patient, ProfileUser

class PatientRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)   # will be used for ProfileUser
    class Meta:
        model = Patient
        fields = [
            "email", "full_name", "age", "gender", "phone_number",
            "blood_group", "emergency_contact_name", "emergency_contact_phone",
            "address", "known_allergies"
        ]
