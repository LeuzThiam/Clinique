from rest_framework import serializers
from .models import Prescription

class PrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Prescription.
    """
    class Meta:
        model = Prescription
        fields = '__all__'  
        read_only_fields = ['id', 'created_at', 'updated_at']  