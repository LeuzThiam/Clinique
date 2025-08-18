from django.db import models
from dossiers_medical.models import DossierMedical
from rendez_vous.models import RendezVous
from utilisateurs.models import Utilisateur  # reference au medecin
from patients.models import Patient

class Consultation(models.Model):
    date = models.DateTimeField()
    motif = models.CharField(max_length=255)
    observations = models.TextField(blank=True)
    diagnostic = models.TextField(blank=True)

    # Lien avec le dossier medical du patient (obligatoire)
    dossier_medical = models.ForeignKey(
        DossierMedical,
        on_delete=models.CASCADE,
        related_name="consultations"
    )

    # Lien avec le rendez-vous (facultatif, une seule consultation par rendez-vous)
    rendez_vous = models.OneToOneField(
        RendezVous,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="consultation"
    )

    # Medecin qui a fait la consultation 
    medecin = models.ForeignKey(
        Utilisateur,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="consultations_realisees"
    )

    # Patient concerne par la consultation
    patient = models.ForeignKey(
        Patient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="consultations"
    )

    class Meta:
        # Par defaut, les consultations seront triees de la plus recente a la plus ancienne
        ordering = ["-date"]

    def __str__(self):
        # Affichage lisible de la consultation
        return f"Consultation du {self.date.date()} ({self.motif})"
