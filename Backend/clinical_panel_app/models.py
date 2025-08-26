from django.db import models
from superadmin_app.models import *
# Create your models here.


class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.CharField(max_length=10)  # e.g., 'Monday', 'Tuesday'
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    slot_duration = models.CharField(max_length=100,help_text="Duration of each slot in minutes")
    break_duration = models.JSONField(blank=True, null=True, help_text="List of break slots in HH:MM format")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doctor.doctor_name} - {self.day_of_week} ({self.start_time} to {self.end_time})"