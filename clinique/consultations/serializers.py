from rest_framework import serializers
from .models import Consultation
from dossiers_medical.models import DossierMedical
from rendez_vous.models import RendezVous
from utilisateurs.models import Utilisateur
from patients.models import Patient

class ConsultationSerializer(serializers.ModelSerializer):
    # Pour creer ou modifier : on donne juste l'id du dossier medical
    dossier_medical_id = serializers.PrimaryKeyRelatedField(
        source="dossier_medical",
        queryset=DossierMedical.objects.all(),
        write_only=True
    )
    # Idem pour le rendez-vous (facultatif)
    rendez_vous_id = serializers.PrimaryKeyRelatedField(
        source="rendez_vous",
        queryset=RendezVous.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )
    # Idem pour le medecin (on filtre juste ceux qui ont le role "medecin")
    medecin_id = serializers.PrimaryKeyRelatedField(
        source="medecin",
        queryset=Utilisateur.objects.filter(role="medecin"),
        write_only=True
    )

    # Pour lire : retourne un objet detaille (pas juste l'id)
    dossier_medical = serializers.SerializerMethodField(read_only=True)
    rendez_vous = serializers.SerializerMethodField(read_only=True)
    medecin = serializers.SerializerMethodField(read_only=True)
    patient = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Consultation
        fields = [
            "id",
            "date",
            "motif",
            "observations",
            "diagnostic",
            "dossier_medical_id",  
            "rendez_vous_id",
            "medecin_id",
            "dossier_medical",     
            "rendez_vous",
            "medecin",
            "patient",
        ]

    # Retourne les infos du dossier medical sous forme detaillee
    def get_dossier_medical(self, obj):
        from dossiers_medical.serializers import DossierMedicalSerializer
        return DossierMedicalSerializer(obj.dossier_medical).data if obj.dossier_medical else None

    # Retourne les infos du rendez-vous si present
    def get_rendez_vous(self, obj):
        from rendez_vous.serializers import RendezVousSerializer
        return RendezVousSerializer(obj.rendez_vous).data if obj.rendez_vous else None

    # Retourne les infos du medecin, selon s'il a une specialite ou non
    def get_medecin(self, obj):
        from utilisateurs.serializers import MedecinSerializer, UtilisateurSerializer
        medecin = obj.medecin
        if medecin is not None:
            if hasattr(medecin, "specialite"):
                return MedecinSerializer(medecin).data
            else:
                return UtilisateurSerializer(medecin).data
        return None

    # Retourne les infos du patient associe au dossier medical
    def get_patient(self, obj):
        from patients.serializers import PatientSerializer
        if obj.dossier_medical and obj.dossier_medical.patient:
            return PatientSerializer(obj.dossier_medical.patient).data
        return None
