from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(DoctorAvailability)
admin.site.register(DoctorBlockedSlot)
admin.site.register(AppointmentBooking)
admin.site.register(MedicalReport)