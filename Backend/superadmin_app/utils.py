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



import re

def extract_minutes(value):
    """
    Extract integer minutes from strings like '30 minutes' or '5 mins'
    """
    if not value:
        return None
    match = re.search(r'\d+', str(value))
    return int(match.group()) if match else None
