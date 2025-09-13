from django.urls import path 
from . views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-otp/', OTPVerifyAPIView.as_view(), name='verify-otp'),
    path('refresh-token/', RefreshAccessTokenAPIView.as_view(), name='refresh-token'),
    path('resend-otp/', ResendOTPAPIView.as_view(), name='resend-otp'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change-password'),
    
]
