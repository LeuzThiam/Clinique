# apps/rendezvous/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import RendezVous
from .serializers import RendezVousSerializer
from .services import confirmer_rdv, refuser_rdv, annuler_rdv  
class RendezVousViewSet(viewsets.ModelViewSet):
    queryset           = RendezVous.objects.select_related("patient", "medecin")
    serializer_class   = RendezVousSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "medecin"):
            return self.queryset.filter(medecin=user.medecin)
        if hasattr(user, "patient"):
            return self.queryset.filter(patient=user.patient)
        return self.queryset.none()

    # ----- actions custom -----
    @action(detail=True, methods=["post"])
    def confirmer(self, request, pk=None):
        rdv = self.get_object()
        confirmer_rdv(rdv, request.user)   # check autorisations à l’intérieur
        return Response({"detail": "Rendez-vous confirmé"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def refuser(self, request, pk=None):
        rdv = self.get_object()
        refuser_rdv(rdv, request.user, request.data.get("raison", ""))
        return Response({"detail": "Rendez-vous refusé"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def annuler(self, request, pk=None):
        rdv = self.get_object()
        annuler_rdv(rdv, request.user)
        return Response({"detail": "Rendez-vous annulé"}, status=status.HTTP_200_OK)
