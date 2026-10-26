from rest_framework import serializers
from .models import DossierMedical
from patients.serializers import PatientSerializer

class DossierMedicalSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=DossierMedical._meta.get_field('patient').remote_field.model.objects.all(),
        write_only=True,
        source='patient'
    )

    class Meta:
        model = DossierMedical
        fields = [
            'traitement_passes',
            'allergies',
            'notes',
            'date_suivante_visite',
            'date_creation',
            'antecedents_familiaux',
            'patient',         
            'patient_id',      
        ]
