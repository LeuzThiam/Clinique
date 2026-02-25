from django.db import models
from patients.models import Patient  

class DossierMedical(models.Model):
    """Représente le dossier médical unique d’un patient."""

    traitement_passes = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    date_suivante_visite = models.DateTimeField(blank=True, null=True)
    date_creation = models.DateField(auto_now_add=True)
    antecedents_familiaux = models.TextField(blank=True)

    patient = models.OneToOneField(
        Patient,
        on_delete=models.CASCADE,
        primary_key=True,  
        related_name="dossier_medical"
    )

    class Meta:
        verbose_name = "Dossier médical"
        verbose_name_plural = "Dossiers médicaux"
        ordering = ['-date_creation']

    def __str__(self):
        return f"Dossier médical de {self.patient.prenom} {self.patient.nom}"
