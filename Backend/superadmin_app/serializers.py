from rest_framework import serializers
from django.contrib.auth import authenticate
from  .models import *

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ["id", "name"]


class ClinicRegisterSerializer(serializers.ModelSerializer):
    specialties = SpecialtySerializer(many=True)  # nested serializer
    doctors_count = serializers.SerializerMethodField()
    patients_count = serializers.SerializerMethodField()

    class Meta:
        model = Clinic
        fields = ["id","clinic_name", "license_number", "location", "address",
                  "phone", "email", "specialties", "documents","doctors_count","patients_count"]
        
        read_only_fields = ['id', 'doctors_count','patients_count']
    def get_doctors_count(self, obj):
        return obj.doctors.count()  # assumes Clinic has related_name="doctors"

    def get_patients_count(self, obj):
        return Patient.objects.count()      

    def validate_specialties(self, value):
        """Prevent duplicate specialties in input payload"""
        names = [spec["name"].strip().lower() for spec in value]
        if len(names) != len(set(names)):
            raise serializers.ValidationError("Duplicate specialties are not allowed.")
        return value

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

        # ✅ Create or get specialties (deduplicate again at DB level just in case)
        specialty_instances = []
        for spec in specialties_data:
            name = spec["name"].strip()
            specialty_obj, _ = Specialty.objects.get_or_create(name__iexact=name, defaults={"name": name})
            specialty_instances.append(specialty_obj)

        clinic.specialties.set(specialty_instances)
        return clinic
        # specialty_instances = []
        # seen = set()
        # for spec in specialties_data:
        #     name = spec["name"].strip()
        #     if name.lower() in seen:
        #         continue
        #     seen.add(name.lower())

        #     specialty_obj, _ = Specialty.objects.get_or_create(name=name)
        #     specialty_instances.append(specialty_obj)

        # clinic.specialties.set(specialty_instances)
        # return clinic
    