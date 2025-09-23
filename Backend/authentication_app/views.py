
from superadmin_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from . serializers import *
from superadmin_app.utils import send_otp_via_email, generate_otp
from rest_framework import status
from  superadmin_app.models import ProfileUser
from .serializers import SuperUserCreateSerializer  # Create a serializer for validation

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Create your views he


@method_decorator(csrf_exempt, name='dispatch')
class SuperUserCreateAPIView(APIView):
    authentication_classes = [] 
    def post(self, request):
        serializer = SuperUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Create the superuser using your custom user manager
            user = ProfileUser.objects.create_superuser(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                first_name=serializer.validated_data.get('first_name', ''),
                last_name=serializer.validated_data.get('last_name', ''),
                phone=serializer.validated_data.get('phone', ''),
            )
            user.role = 'SuperAdmin'
            user.save()
            return Response({"message": "Superuser created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
