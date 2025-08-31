import pyotp
from django.core.mail import send_mail
from django.conf import settings
import random
import string




# generate otp and send email
def generate_otp(user):
    if not user.otp_secret:
        # assign a secret if not already assigned
        user.otp_secret = pyotp.random_base32()
        user.save()
    totp = pyotp.TOTP(user.otp_secret, interval=600)  # 10 minutes validity
    otp = totp.now()
    return otp

def send_otp_via_email(email, otp):
    subject = "Your Login OTP"
    message = f"Your OTP is {otp}. It will expire in 10 minutes."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)



# generate password and send email for clinic registration

def generate_random_password(length=10):
    """Generate a random password with letters, digits, symbols"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(characters) for _ in range(length))

def send_password_email(email, password):
    subject = "Your Clinic Account Credentials"
    message = f"Your clinic account has been created.\n\nEmail: {email}\nPassword: {password}\n\nPlease login and change your password."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])


# send doctor credentials email
def send_doctor_credentials_email(email, password, clinic_name):
    subject = "Your Doctor Account Credentials"
    message = f"Your doctor account has been created under the clinic '{clinic_name}'.\n\nEmail: {email}\nPassword: {password}\n\nPlease login and change your password."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])



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



# import stripe
# from django.conf import settings

# def create_stripe_payment_intent(amount, currency, metadata=None):
#     stripe.api_key = settings.STRIPE_SECRET_KEY
#     intent = stripe.PaymentIntent.create(
#         amount=int(amount * 100),  # Stripe uses cents/paise
#         currency=currency,
#         metadata=metadata or {}
#     )
#     return intent.client_secret
