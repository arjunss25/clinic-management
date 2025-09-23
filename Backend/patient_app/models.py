from django.db import models
from superadmin_app.models import *
from clinical_panel_app.models import *
# Create your models here.

# class Payment(models.Model):
#     patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="payments")
#     amount = models.DecimalField(max_digits=10, decimal_places=2)  # in INR/USD
#     currency = models.CharField(max_length=10, default="inr")
#     stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)
#     status = models.CharField(max_length=50, default="pending")  # pending, succeeded, failed
#     created_at = models.DateTimeField(auto_now_add=True)



# class Payment(models.Model):
#     patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
#     consultation = models.ForeignKey("Consultation", on_delete=models.CASCADE, null=True, blank=True)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     currency = models.CharField(max_length=10, default="inr")
#     stripe_payment_intent = models.CharField(max_length=255)
#     status = models.CharField(max_length=20, choices=[
#         ("pending", "Pending"),
#         ("succeeded", "Succeeded"),
#         ("failed", "Failed"),
#     ], default="pending")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Payment {self.id} - {self.patient}"

# A patient is making payment for booking an appointment,
# If payment is already done for that appointment, we should not allow another one,
# Prevents duplicate charges for the same appointment_id.

class Payment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment = models.ForeignKey(AppointmentBooking, on_delete=models.CASCADE, related_name="payments",default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="inr")
    stripe_payment_intent = models.CharField(max_length=255,default='demo content')
    status = models.CharField(max_length=20, choices=[
        ("pending", "Pending"),
        ("succeeded", "Succeeded"),
        ("failed", "Failed"),
    ], default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} - {self.patient.full_name} - {self.appointment.id}"
