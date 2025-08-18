from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import PrescriptionDetail
from .serializers import PrescriptionDetailSerializer

class PrescriptionDetailViewSet(viewsets.ModelViewSet):
    """
    CRUD complet pour PrescriptionDetail :
    - GET list/detail
    - POST create
    - PUT/PATCH update
    - DELETE destroy
    """
    queryset = PrescriptionDetail.objects.select_related("prescription")
    serializer_class = PrescriptionDetailSerializer
    permission_classes = [IsAuthenticated]
