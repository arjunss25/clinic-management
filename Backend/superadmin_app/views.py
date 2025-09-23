from django.shortcuts import render
from . models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from . mixins import *
from .utils import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
# Create your views here.


#clinical registration by superadmin
class ClinicRegisterAPIView(APIView):
    permission_classes = [IsAuthenticated]  
    def post(self, request):

        if request.user.role != "SuperAdmin":
            return custom_404( "Only SuperAdmin can register clinics" )

        password = generate_random_password()
        serializer = ClinicRegisterSerializer(data=request.data, context={"password": password})

        if serializer.is_valid():
            try:
             clinic = serializer.save()
            except IntegrityError:
                return custom_404("A user with this email already exists.") 

            send_password_email(clinic.email, password)

            return custom_201( "Clinic registered successfully. Credentials sent to email.",{
                "clinic_id": clinic.id,
                "clinic_name": clinic.clinic_name,
                "user_id": clinic.user.id,
                "email": clinic.email,
                "role": clinic.user.role
            })

        return custom_404(serializer.errors)