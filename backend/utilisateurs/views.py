from django.db import transaction
from django.contrib.auth import get_user_model

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action

from session.models import Session
from .models import Medecin, Assistant
from .serializers import (
    UtilisateurSerializer,
    MedecinSerializer,
    AssistantSerializer,
    InscriptionAvecRoleSerializer,
    CustomTokenObtainPairSerializer,
)

Utilisateur = get_user_model()

# === Inscription ===
class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = InscriptionAvecRoleSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    utilisateur = serializer.save()
                    return Response({"message": "Inscription réussie"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# === Connexion JWT ===
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get("username")
            try:
                user = Utilisateur.objects.get(username=username)
                Session.objects.create(utilisateur=user)
            except Utilisateur.DoesNotExist:
                pass
        return response

# === Profil de l'utilisateur connecté ===
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, 'medecin'):
            serializer = MedecinSerializer(user.medecin)
        elif hasattr(user, 'assistant'):
            serializer = AssistantSerializer(user.assistant)
        else:
            serializer = UtilisateurSerializer(user)
        return Response(serializer.data)

# === ViewSets sécurisés ===
class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]

class MedecinViewSet(viewsets.ModelViewSet):
    queryset = Medecin.objects.all()
    serializer_class = MedecinSerializer
    permission_classes = [IsAuthenticated]

class AssistantViewSet(viewsets.ModelViewSet):
    queryset = Assistant.objects.all()
    serializer_class = AssistantSerializer
    permission_classes = [IsAuthenticated]
