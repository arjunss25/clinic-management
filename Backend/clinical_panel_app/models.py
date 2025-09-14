from django.db import models
from superadmin_app.models import *
# Create your models here.


class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.JSONField(default=list,null=True, blank=True)  # e.g., ["Monday", "Wednesday", "Friday"]
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    slot_duration = models.CharField(max_length=100,help_text="Duration of each slot in minutes")
    break_duration = models.CharField(max_length=100,help_text="Break duration between slots in minutes",null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doctor.doctor_name} - {self.day_of_week} ({self.start_time} to {self.end_time})"



# Blocked slots for doctors
class DoctorBlockedSlot(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="blocked_slots")
    date = models.DateField()
    slot_start = models.TimeField()
    slot_end = models.TimeField()
    is_blocked = models.BooleanField(default=True)  # True = blocked, False = unblocked
    created_at = models.DateTimeField(auto_now_add=True)

   
    def __str__(self):
        return f"{self.doctor.doctor_name} - {self.date} {self.slot_start}-{self.slot_end} ({'Blocked' if self.is_blocked else 'Unblocked'})"

#appointment booking model
class AppointmentBooking(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=50, choices=[
        ("Scheduled", "Scheduled"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Upcoming", "Upcoming"),
        ("Waiting List", "Waiting List"),
        ("Follow-up", "Follow-up"),
        ("Cancelled", "Cancelled"),
        ("No-Show", "No-Show")
    ], default="Scheduled")
    reason_for_visit = models.TextField(blank=True, null=True)
    reason_for_cancellation = models.TextField(blank=True, null=True)
    follow_up_notes = models.TextField(blank=True, null=True)
    follow_up_priority = models.CharField(max_length=50, choices=[("Routine", "Routine"), ("Urgent", "Urgent"), ("ASAP", "ASAP")], blank=True, null=True)
    parent_appointment = models.ForeignKey(
        "self", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="follow_ups"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment: {self.patient.full_name} with Dr. {self.doctor.doctor_name} on {self.appointment_date} at {self.start_time}"
    

# Payment model
class Payment(models.Model):
    appointment = models.OneToOneField(AppointmentBooking, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_time = models.TimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, choices=[
        ("Credit Card", "Credit Card"),
        ("Debit Card", "Debit Card"),
        ("Net Banking", "Net Banking"),
        ("UPI", "UPI"),
        ("Cash", "Cash"),
        ("Wallet", "Wallet"),
    ])
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50, choices=[
        ("Pending", "Pending"),
        ("Completed", "Completed"),
        ("Failed", "Failed"),
        ("Refunded", "Refunded"),
    ], default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment: {self.amount} for Appointment ID {self.appointment.id} - {self.status}"


class MedicalReport(models.Model):
    appointment = models.ForeignKey(
        AppointmentBooking,
        on_delete=models.CASCADE,
        related_name="medical_reports",
        null=True, blank=True  # allow standalone reports if needed
    )
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="medical_reports"
    )
    report_title = models.CharField(max_length=255)
    priority = models.CharField(max_length=50, choices=[
        ("Normal", "Normal"),
        ("Urgent", "Urgent"),
        ("High", "High")
    ], default="Normal")
    report_type = models.CharField(max_length=100)  # e.g. Lab, Radiology, Discharge
    description = models.TextField()
    document = models.FileField(upload_to="medical-reports/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # auto-fill patient from appointment if not provided
        if self.appointment and not self.patient:
            self.patient = self.appointment.patient
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Report: {self.report_type} for {self.patient.full_name} - {self.created_at.date()}"