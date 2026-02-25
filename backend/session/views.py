from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone  
from .models import Session
from .serializers import SessionSerializer


class SessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour le modèle Session.
    """
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]  


class LoggedInSessionView(APIView):
    """
    Vue pour enregistrer la date de déconnexion de la dernière session active.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = Session.objects.filter(
            utilisateur=request.user,
            date_deconnexion__isnull=True
        ).last()

        if session:
            session.date_deconnexion = timezone.now()
            session.save()
            return Response({"message": "Déconnexion enregistrée avec succès."})

        return Response({"message": "Aucune session active trouvée."}, status=404)

