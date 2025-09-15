from rest_framework import serializers
from django.contrib.auth import authenticate
from  superadmin_app.models import *
from clinical_panel_app.models import *


# patient profile serializer
class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            "id", "user", "full_name", "age","phone_number","blood_group","emergency_contact_name","emergency_contact_phone","address","known_allergies"]
        


# list appointments and medical history serializer
class ListMedicalReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalReport
        fields = ["id", "report_title", "priority", "report_type", "description", "document", "created_at"]

class ListAppointmentBookingSerializer(serializers.ModelSerializer):
    medical_reports = ListMedicalReportSerializer(many=True, read_only=True)

    class Meta:
        model = AppointmentBooking
        fields = [
            "id", "appointment_date", "start_time", "end_time", "status",
            "reason_for_visit", "reason_for_cancellation", "follow_up_notes",
            "follow_up_priority", "created_at", "medical_reports"
        ]        