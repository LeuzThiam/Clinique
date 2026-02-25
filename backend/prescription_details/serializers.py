from rest_framework import serializers
from .models import PrescriptionDetail

class PrescriptionDetailSerializer(serializers.ModelSerializer):
    # pour créer/lister, on fournit l’ID de la Prescription par prescription_id
    prescription_id = serializers.PrimaryKeyRelatedField(
        source="prescription",
        queryset=PrescriptionDetail._meta
                                  .get_field("prescription")
                                  .remote_field
                                  .model
                                  .objects.all()
    )

    class Meta:
        model = PrescriptionDetail
        fields = [
            "id",
            "prescription_id",
            "medicament",
            "dosage",
            "instructions",
            "duree",
        ]
