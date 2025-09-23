from rest_framework import serializers
from django.contrib.auth import authenticate
from  superadmin_app.models import *
from clinical_panel_app.models import *
from datetime import timedelta, datetime
from . models import ConsultationModel, Prescription, PrescriptionMedication

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





# consulation and prescription serializers
class PrescriptionMedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedication
        fields = ["id", "medication_name", "dosage", "frequency", "duration", "instructions"]
        read_only_fields = ["id"]


class PrescriptionSerializer(serializers.ModelSerializer):
    medications = PrescriptionMedicationSerializer(many=True)

    class Meta:
        model = Prescription
        fields = ["id", "additional_notes", "special_instructions", "created_at", "medications"]

        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        medications_data = validated_data.pop("medications", [])
        prescription = Prescription.objects.create(**validated_data)

        for med_data in medications_data:
            PrescriptionMedication.objects.create(prescription=prescription, **med_data)

        return prescription


class ConsultationSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True)

    class Meta:
        model = ConsultationModel
        fields = [
            "id", "appointment", "symptoms", "diagnosis",
            "physical_examination", "patient_instructions",
            "treatment_plan", "created_at", "prescriptions"
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        prescriptions_data = validated_data.pop("prescriptions", [])
        consultation = ConsultationModel.objects.create(**validated_data)

        for presc_data in prescriptions_data:
            meds_data = presc_data.pop("medications", [])
            prescription = Prescription.objects.create(consultation=consultation, **presc_data)

            for med_data in meds_data:
                PrescriptionMedication.objects.create(prescription=prescription, **med_data)

        return consultation

# follow-up appointment serializer
class FollowUpAppointmentSerializer(serializers.ModelSerializer):
    original_appointment_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = AppointmentBooking
        fields = [
            "id", "original_appointment_id", "appointment_date",
            "start_time", "end_time", "follow_up_notes",
            "follow_up_priority", "status", "created_at"
        ]
        read_only_fields = ["id", "status", "created_at"]

    def create(self, validated_data):
        original_appointment_id = validated_data.pop("original_appointment_id")
        try:
            original_appointment = AppointmentBooking.objects.get(id=original_appointment_id)
        except AppointmentBooking.DoesNotExist:
            raise serializers.ValidationError(
                {"original_appointment_id": "Appointment not found."}
            )

        follow_up = AppointmentBooking.objects.create(
            patient=original_appointment.patient,
            doctor=original_appointment.doctor,
            status="Follow-up",
            parent_appointment=original_appointment,   # 👈 link to parent
            **validated_data
        )
        return follow_up
