from django.contrib import admin
from . models import *
# Regi ster your models here.

admin.site.register(ProfileUser)
admin.site.register(Clinic)
admin.site.register(Specialty)
admin.site.register(Doctor)
admin.site.register(Patient)