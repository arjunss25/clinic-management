from rest_framework import serializers
from superadmin_app.models import Patient, ProfileUser

# class PatientRegisterSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(write_only=True)   # will be used for ProfileUser
#     class Meta:
#         model = Patient
#         fields = [
#             "email", "full_name", "age", "gender", "phone_number",
#             "blood_group", "emergency_contact_name", "emergency_contact_phone",
#             "address", "known_allergies"
#         ]

class PatientRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
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
        