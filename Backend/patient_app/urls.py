from django.urls import path 
from .views import *

urlpatterns = [
    path("payments/create-intent/", CreatePaymentIntentAPI.as_view(), name="create-payment-intent"),
    path("payments/webhook/", stripe_webhook, name="stripe-webhook"),
]

 