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
        ("Cancelled", "Cancelled"),
        ("No-Show", "No-Show")
    ], default="Scheduled")
    reason_for_visit = models.TextField(blank=True, null=True)
    reason_for_cancellation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment: {self.patient.full_name} with Dr. {self.doctor.doctor_name} on {self.appointment_date} at {self.start_time}"