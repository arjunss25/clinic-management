import string, random
from django.core.mail import send_mail
from django.conf import settings
import random
import string


def generate_random_password(length=10):
    """Generate a secure random password with letters, digits, and symbols."""
    characters = string.ascii_letters + string.digits + "!@#$%^&*()"
    password=''.join(random.choice(characters) for _ in range(length))
    print('---------', password)
    return password
 
 # appointment send email to patient and doctor
def send_appointment_email(appointment):
    subject = f"Appointment Confirmation - {appointment.appointment_date} {appointment.start_time}"
    
    patient_message = f"""
    Dear {appointment.patient.full_name},

    Your appointment with Dr. {appointment.doctor.doctor_name} has been scheduled.
    
    📅 Date: {appointment.appointment_date}
    ⏰ Time: {appointment.start_time} - {appointment.end_time}
    🏥 Doctor: {appointment.doctor.doctor_name}

    Please arrive 10 minutes early.

    Regards,
    Clinic Team
    """

    doctor_message = f"""
    Dear Dr. {appointment.doctor.doctor_name},

    You have a new appointment scheduled.

    🧑 Patient: {appointment.patient.full_name}
    📅 Date: {appointment.appointment_date}
    ⏰ Time: {appointment.start_time} - {appointment.end_time}
    Reason: {appointment.reason_for_visit or "Not specified"}

    Regards,
    Clinic Team
    """

    # Send email to patient
    send_mail(
        subject,
        patient_message,
        settings.DEFAULT_FROM_EMAIL,
        [appointment.patient.user.email],
        fail_silently=False,
    )

    # Send email to doctor
    send_mail(
        subject,
        doctor_message,
        settings.DEFAULT_FROM_EMAIL,
        [appointment.doctor.user.email],
        fail_silently=False,
    )