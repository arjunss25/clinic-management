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