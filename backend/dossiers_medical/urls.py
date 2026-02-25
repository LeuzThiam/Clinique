from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DossierMedicalViewSet

router = DefaultRouter()
router.register(r"", DossierMedicalViewSet, basename="dossiermedical")

urlpatterns = [
    path("", include(router.urls)),
]
