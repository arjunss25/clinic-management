from django.contrib import admin
from . models import *
# Regi ster your models here.

admin.site.register(ProfileUser)
admin.site.register(Clinic)
admin.site.register(ClinicAccreditation)
admin.site.register(ClinicMedicalFacility)
admin.site.register(ClinicPatientAmenity)
admin.site.register(ClinicWorkingHours)
admin.site.register(Specialty)
admin.site.register(Doctor)
admin.site.register(Patient)