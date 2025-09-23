from django.urls import path 
from . views import *
urlpatterns = [
    path('get-patient-profile/', PatientProfileAPIView.as_view(), name='get-patient-profile'),
    path('edit-patient-profile/', PatientProfileEditAPIView.as_view(), name='edit-patient-profile'),
    path('list-patient-appointments/', PatientAppointmentsListAPIView.as_view(), name='list-patient-appointments'),
    path('patient-appointments-by-date/<str:date>/', PatientAppointmentsByDateAPIView.as_view(), name='patient-appointments-by-date'),
    path('patient-appointment-details/<int:appointment_id>/', PatientAppointmentDetailAPIView.as_view(), name='patient-appointment-details'),
    path("patients-appointments-reports-history/", PatientAppointmentsReportsHistoryAPIView.as_view(), name="patients-appointments-reports-history"),  
    path("patients-reports-history-by-id/<int:patient_id>/", PatientAppointmentsReportsHistoryAPIView.as_view(), name="patients-reports-history-by-id"),

    path("payments/create-intent/", CreatePaymentIntentAPI.as_view(), name="create-payment-intent"),
    path("payments/webhook/", stripe_webhook, name="stripe-webhook"),
]

 