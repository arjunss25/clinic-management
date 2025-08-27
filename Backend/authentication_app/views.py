
from superadmin_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from . serializers import *
from superadmin_app.utils import send_otp_via_email, generate_otp
# Create your views he



# login  and verify otp
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # generate and send OTP
            otp = generate_otp(user)
            send_otp_via_email(user.email, otp)

            return custom_200("OTP sent to email")
        return custom_404(serializer.errors)


class OTPVerifyAPIView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = serializer.validated_data["otp"]

            user = get_object_or_404(ProfileUser, email=email)

            if not user.otp_secret:
                return custom_404("OTP not generated")

            totp = pyotp.TOTP(user.otp_secret, interval=600)  # 10 min
            if totp.verify(otp):
                user.is_verified = True
                user.save()

                refresh = RefreshToken.for_user(user)
                refresh["user_id"] = user.id
                refresh["role"] = user.role
                return custom_200("OTP verified successfully", {
                   
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "role": user.role,
                    "user_id": user.id,
                    "email": user.email
                })
            else:
                return custom_404("Invalid or expired OTP")

        return custom_404(serializer.errors)
