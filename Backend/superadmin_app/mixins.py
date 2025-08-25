from rest_framework.response import Response
from rest_framework import status


def custom_200(message, data=None):
    return Response({
        "status": True,
        "message": message,
        "data": data
    }, status=status.HTTP_200_OK)

def custom_201(message, data=None):
    return Response({
        "status": True,
        "message": message,
        "data": data
    }, status=status.HTTP_201_CREATED)


def custom_404(message, status_code=status.HTTP_404_NOT_FOUND):
    return Response({
        "status": False,
        "message": message,
        "data": None
    }, status=status_code)
