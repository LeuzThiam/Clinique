from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrescriptionDetailViewSet

router = DefaultRouter()
router.register(r"", PrescriptionDetailViewSet, basename="prescriptiondetail")

urlpatterns = [
    path("", include(router.urls)),
]
