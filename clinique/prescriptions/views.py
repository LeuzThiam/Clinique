from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Prescription
from .serializers import PrescriptionSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    CRUD complet sur les prescriptions :
      • liste / détail (GET)
      • création (POST)
      • modification (PUT / PATCH)
      • suppression (DELETE)
    """
    queryset = Prescription.objects.select_related("consultation")
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated] 
