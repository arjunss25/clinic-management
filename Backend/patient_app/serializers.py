from rest_framework import serializers
from superadmin_app.models import *
from .models import *
from datetime import timedelta, datetime
from django.contrib.auth import authenticate
from django.utils import timezone


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "patient", "amount", "currency", "status", "stripe_payment_intent", "created_at"]
