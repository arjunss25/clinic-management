from django.urls import path 
from . views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-otp/', OTPVerifyAPIView.as_view(), name='verify-otp'),
    
]
