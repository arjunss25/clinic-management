<<<<<<< HEAD
from django.shortcuts import render
# Create your views here.
import stripe
from django.shortcuts import render, redirect
from django.conf import settings
from decimal import Decimal 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import PaymentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from decouple import config



stripe.api_key = settings.STRIPE_SECRET_KEY
# print( '---------', settings.STRIPE_SECRET_KEY)

# class CreatePaymentIntentAPI(APIView):
#     def post(self, request, *args, **kwargs):
#         patient_id = request.data.get("patient_id")
#         amount = request.data.get("amount")  # in rupees

#         try:
#             intent = stripe.PaymentIntent.create(
#                 amount=int(float(amount) * 100),  # Stripe works in paise/cents
#                 currency="inr",
#                 payment_method_types=["card"]
#             )

#             payment = Payment.objects.create(
#                 patient_id=patient_id,
#                 amount=amount,
#                 currency="inr",
#                 stripe_payment_intent=intent["id"],
#                 status="pending",
#             )

#             return Response({
#                 "client_secret": intent["client_secret"],
#                 "payment_id": payment.id
#             }, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class CreatePaymentIntentAPI(APIView):
#     def post(self, request, *args, **kwargs):
#         patient_id = request.data.get("patient_id")
#         appointment_id = request.data.get("appointment_id")
#         amount = request.data.get("amount")

#         # Required validations
#         if not patient_id:
#             return Response({"error": "patient_id is required"}, status=status.HTTP_400_BAD_REQUEST)
#         if not appointment_id:
#             return Response({"error": "appointment_id is required"}, status=status.HTTP_400_BAD_REQUEST)
#         if not amount:
#             return Response({"error": "amount is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             amount = float(amount)
#             if amount <= 0:
#                 return Response({"error": "Amount must be greater than zero"}, status=status.HTTP_400_BAD_REQUEST)
#         except ValueError:
#             return Response({"error": "Invalid amount format"}, status=status.HTTP_400_BAD_REQUEST)

#         # Prevent duplicate payment for same appointment
#         existing_payment = Payment.objects.filter(
#             patient_id=patient_id,
#             appointment_id=appointment_id,
#             status="succeeded"
#         ).first()
#         if existing_payment:
#             return Response(
#                 {"error": "Payment already completed for this appointment."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
#         try:
#             # Stripe PaymentIntent
#             intent = stripe.PaymentIntent.create(
#                 amount=int(amount * 100),
#                 currency="inr",
#                 payment_method_types=["card"]
#             )

#             # Save payment record
#             payment = Payment.objects.create(
#                 patient_id=patient_id,
#                 appointment_id=appointment_id,
#                 amount=amount,
#                 currency="inr",
#                 stripe_payment_intent=intent["id"],
#                 status="pending",
#             )

#             return Response({
#                 "client_secret": intent["client_secret"],
#                 "payment_id": payment.id
#             }, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CreatePaymentIntentAPI(APIView):
    def post(self, request, *args, **kwargs):
        patient_id = request.data.get("patient_id")
        appointment_id = request.data.get("appointment_id")
        amount = request.data.get("amount")

        # Required validations
        if not patient_id:
            return Response({"error": "patient_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not appointment_id:
            return Response({"error": "appointment_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not amount:
            return Response({"error": "amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
            if amount <= 0:
                return Response({"error": "Amount must be greater than zero"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid amount format"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check appointment exists
        try:
            appointment = AppointmentBooking.objects.get(id=appointment_id)
        except AppointmentBooking.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Ensure appointment belongs to this patient
        if appointment.patient.user != request.user:
            return Response(
                {"error": "You are not authorized to pay for this appointment."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔹 Prevent duplicate: if appointment already has payment
        existing_payment = Payment.objects.filter(
            patient_id=patient_id,
            appointment_id=appointment_id
        ).exclude(status="failed").first()

        if existing_payment:
            return Response(
                {"error": f"A payment with status '{existing_payment.status}' already exists for this appointment."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Stripe PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # amount in paise
                currency="inr",
                payment_method_types=["card"]
            )

            # Save payment record
            payment = Payment.objects.create(
                patient_id=patient_id,
                appointment_id=appointment_id,
                amount=amount,
                currency="inr",
                stripe_payment_intent=intent["id"],
                status="pending",
            )

            return Response({
                "client_secret": intent["client_secret"],
                "payment_id": payment.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = config("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return JsonResponse({"error": "Invalid payload"}, status=400)

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        payment = Payment.objects.filter(stripe_payment_intent=intent["id"]).first()
        if payment:
            payment.status = "succeeded"
            payment.save()

    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]
        payment = Payment.objects.filter(stripe_payment_intent=intent["id"]).first()
        if payment:
            payment.status = "failed"
            payment.save()

    return JsonResponse({"status": "success"}, status=200)
=======

from superadmin_app.models import *
from clinical_panel_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from superadmin_app.serializers import *
from . serializers import *
from clinical_panel_app.serializers import *
from superadmin_app.utils import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime, timedelta
import calendar
from authentication_app.authentication import CookieJWTAuthentication
from django.utils import timezone

# Create your views here.
# get login patient profile
class PatientProfileAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientProfileSerializer(patient)
            return custom_200("Patient profile fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")
        

# edit login patient profile patch
class PatientProfileEditAPIView(APIView):  
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientProfileSerializer(patient, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return custom_200("Patient profile updated successfully", serializer.data)
            return custom_404(serializer.errors)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")      
        
# list all appointments of a patient
class PatientAppointmentsListAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            appointments = AppointmentBooking.objects.filter(patient=patient).order_by('-appointment_date', '-start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200("Patient appointments fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")


# list appointments by date
class PatientAppointmentsByDateAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, date):
        try:

            patient = Patient.objects.get(user=request.user)
            appointments = AppointmentBooking.objects.filter(patient=patient, appointment_date=date).order_by('start_time')
            serializer = AppointmentBookingSerializer(appointments, many=True)
            return custom_200(f"Patient appointments for {date} fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")
        

# list patients appointments by appointment id 
class PatientAppointmentDetailAPIView(APIView):
    # authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):
        try:
            patient = Patient.objects.get(user=request.user)
            appointment = get_object_or_404(AppointmentBooking, id=appointment_id, patient=patient)
            serializer = AppointmentBookingSerializer(appointment)
            return custom_200("Patient appointment details fetched successfully", serializer.data)
        except Patient.DoesNotExist:
            return custom_404("Patient profile not found")        
        

  # list appointments and medical history 
class PatientAppointmentsReportsHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id=None):
        try:
            # Case 1: Logged-in patient
            if request.user.role == "Patient" and not patient_id:
                patient = Patient.objects.get(user=request.user)

            # Case 2: Pass patient_id (for clinic/admin usage)
            elif patient_id:
                patient = Patient.objects.get(id=patient_id)

            else:
                return custom_404("Patient ID required or login as patient.")

            # Fetch appointments with related reports
            appointments = AppointmentBooking.objects.filter(patient=patient).prefetch_related("medical_reports")

            serializer = ListAppointmentBookingSerializer(appointments, many=True)
            return custom_200("History listed successfully",serializer.data)

        except Patient.DoesNotExist:
            return custom_404("Patient not found.")      
>>>>>>> 8c4c14b04225f36ed5634b20fa4755841e0dfe89
