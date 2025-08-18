from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Consultation
from .serializers import ConsultationSerializer

class ConsultationViewSet(viewsets.ModelViewSet):
    """
    CRUD complet sur les consultations :
      • liste / détail (GET)
      • création (POST)
      • modification complète (PUT) / partielle (PATCH)
      • suppression (DELETE)
    """
    queryset = Consultation.objects.select_related("dossier_medical", "rendez_vous")
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]
