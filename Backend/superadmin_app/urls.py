from django.urls import path 
from . views import *

urlpatterns = [
    path('register-clinic/', ClinicRegisterAPIView.as_view(), name='register-clinic'),
   
    
]
