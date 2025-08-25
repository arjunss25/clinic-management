from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from . manager import CustomUserManager


class ProfileUser(AbstractUser):
    ROLE_CHOICES = [
        ('SuperAdmin', 'SuperAdmin'),
        ('Doctor', 'Doctor'),
        ('Patient', 'Patient'),
        ('Clinic', 'Clinic'),
    ]
    username = None 
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    otp_secret = models.CharField(max_length=32, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'  # Important
    REQUIRED_FIELDS = []  # Since email is the only required field

    objects = CustomUserManager()


    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()

    def __str__(self):
        return self.email

# clinic model
class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Clinic(models.Model):
    user = models.OneToOneField(ProfileUser, on_delete=models.CASCADE, related_name='clinic_profile',limit_choices_to={'role': 'Clinic'})
    clinic_name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100, unique=True)
    location = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    specialties = models.ManyToManyField(Specialty, related_name="clinics_specialties")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.clinic_name