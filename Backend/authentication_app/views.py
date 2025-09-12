
from superadmin_app.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from superadmin_app. mixins import *
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from . serializers import *
from superadmin_app.utils import send_otp_via_email, generate_otp
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
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
                user.is_active = True
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


# class OTPVerifyAPIView(APIView):
#     def post(self, request):
#         serializer = OTPVerifySerializer(data=request.data)
#         if serializer.is_valid():
#             email = serializer.validated_data["email"]
#             otp = serializer.validated_data["otp"]

#             user = get_object_or_404(ProfileUser, email=email)

#             if not user.otp_secret:
#                 return custom_404("OTP not generated")

#             totp = pyotp.TOTP(user.otp_secret, interval=600)  # 10 min
#             if totp.verify(otp):
#                 user.is_verified = True
#                 user.save()

#                 # ✅ Generate tokens with extra claims
#                 refresh = RefreshToken.for_user(user)
#                 refresh["user_id"] = user.id
#                 refresh["role"] = user.role
#                 refresh["email"] = user.email

#                 access_token = str(refresh.access_token)
#                 refresh_token = str(refresh)

#                 response = custom_200("OTP verified successfully", {
#                     "role": user.role,
#                     "user_id": user.id,
#                     "email": user.email
#                 })

#                 # ✅ Store tokens in HttpOnly cookies
#                 response.set_cookie(
#                     key="access_token",
#                     value=access_token,
#                     httponly=True,   # JS cannot read
#                     secure=False,     # only over HTTPS
#                     samesite="Lax",
#                     max_age=60 * 5   # 5 min (match access expiry)
#                 )
#                 response.set_cookie(
#                     key="refresh_token",
#                     value=refresh_token,
#                     httponly=True,
#                     secure=False,
#                     samesite="Lax",
#                     max_age=60 * 60 * 24 * 7   # 7 days
#                 )

#                 return response

#             else:
#                 return custom_404("Invalid or expired OTP")

#         return custom_404(serializer.errors)
    


# refresh token view
class RefreshAccessTokenAPIView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)

            # ✅ Generate new access token
            new_access = str(refresh.access_token)

            # ✅ Extract user details from token
            user_id = refresh.get("user_id")
            role = refresh.get("role")

            # (Optional) double-check that user still exists
            user = get_object_or_404(ProfileUser, id=user_id)

            return custom_200( "Access token refreshed successfully",{
                    "access_token": new_access,
                    "refresh_token": str(refresh),
                    "user_id": user.id,
                    "role": user.role,
                    "email": user.email,
                } )

        except TokenError:
            return custom_404("Invalid or expired refresh token")
# class RefreshAccessTokenAPIView(APIView):
#     def post(self, request):
#         refresh_token = request.COOKIES.get("refresh_token")

#         if not refresh_token:
#             return custom_404("Refresh token missing")

#         try:
#             refresh = RefreshToken(refresh_token)

#             # ✅ Generate new access token
#             new_access = str(refresh.access_token)

#             response = custom_200("Access token refreshed")
#             response.set_cookie(
#                 key="access_token",
#                 value=new_access,
#                 httponly=True,
#                 secure=False,
#                 samesite="Lax",
#                 max_age=60 * 5  # 5 min expiry
#             )
#             return response

#         except TokenError:
#             return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
    
