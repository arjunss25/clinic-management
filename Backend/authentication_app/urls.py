from django.urls import path 
from . views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-otp/', OTPVerifyAPIView.as_view(), name='verify-otp'),
    # path("create-superuser/", SuperUserCreateAPIView.as_view, name="stripe-webhook"), 
    path('create-superuser/', csrf_exempt(SuperUserCreateAPIView.as_view())),

]
