from rest_framework import serializers
from django.contrib.auth import authenticate
from  .models import *
class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ["id", "name"]


class ClinicRegisterSerializer(serializers.ModelSerializer):
    specialties = SpecialtySerializer(many=True)  # nested serializer

    class Meta:
        model = Clinic
        fields = ["clinic_name", "license_number", "location", "address",
                  "phone", "email", "specialties", "documents"]

    def create(self, validated_data):
        specialties_data = validated_data.pop("specialties")
        email = validated_data["email"]

        # ✅ Create user with role Clinic
        password = self.context.get("password")
        user = ProfileUser.objects.create_user(
            email=email,
            password=password,
            role="Clinic",
            username=None
        )

        clinic = Clinic.objects.create(user=user, **validated_data)

        # ✅ Create or get specialties
        specialty_instances = []
        for spec in specialties_data:
            specialty_obj, _ = Specialty.objects.get_or_create(name=spec["name"])
            specialty_instances.append(specialty_obj)

        clinic.specialties.set(specialty_instances)
        return clinic