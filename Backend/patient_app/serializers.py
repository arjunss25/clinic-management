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