from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView  
from .views import (
    UtilisateurViewSet,
    MedecinViewSet,
    AssistantViewSet,
    RegisterView,
    LoginView,  
    CurrentUserView,   # <= pour /me
)

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateur')
router.register(r'medecins', MedecinViewSet, basename='medecin')
router.register(r'assistants', AssistantViewSet, basename='assistant')

urlpatterns = [
    # Route explicite pour le profil connecté (peu importe la position)
    path('me/', CurrentUserView.as_view(), name='utilisateur-me'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),  
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
