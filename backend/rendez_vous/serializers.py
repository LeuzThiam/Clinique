from rest_framework import serializers
from .models import RendezVous

class RendezVousSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle RendezVous.
    """
    class Meta:
        model = RendezVous
        fields = '__all__'