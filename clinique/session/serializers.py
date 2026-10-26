from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Session.
    """
    class Meta:
        model = Session
        fields = '__all__'
        read_only_fields = ['utilisateur']



