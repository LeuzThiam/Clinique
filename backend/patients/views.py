from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour le modèle Patient.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]  