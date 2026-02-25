from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import DossierMedical
from .serializers import DossierMedicalSerializer

class DossierMedicalViewSet(viewsets.ModelViewSet):
    """
    CRUD complet sur les dossiers médicaux.
    Seuls les utilisateurs authentifiés sont autorisés par défaut ;
    
    """
    queryset = DossierMedical.objects.select_related("patient")
    serializer_class = DossierMedicalSerializer
    permission_classes = [IsAuthenticated]
