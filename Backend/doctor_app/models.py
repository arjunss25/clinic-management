from django.db import models
from superadmin_app.models import *
from clinical_panel_app.models import *
# Create your models here.


# consultation section models
class ConsultationModel(models.Model):
    appointment = models.OneToOneField(AppointmentBooking, on_delete=models.CASCADE, related_name="consultation")
    symptoms = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    physical_examination = models.TextField(blank=True, null=True)
    patient_instructions = models.TextField(blank=True, null=True)
    treatment_plan =  models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consultation for {self.appointment.patient.full_name} on {self.appointment.appointment_date}"
    

class Prescription(models.Model):
    consultation = models.ForeignKey(
        ConsultationModel, 
        on_delete=models.CASCADE, 
        related_name="prescriptions"
    )
    additional_notes = models.TextField(blank=True, null=True)
    special_instructions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.consultation.appointment.patient.full_name}"


class PrescriptionMedication(models.Model):
    prescription = models.ForeignKey(
        Prescription, 
        on_delete=models.CASCADE, 
        related_name="medications"
    )
    medication_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.medication_name} ({self.prescription.consultation.appointment.patient.full_name})"
 