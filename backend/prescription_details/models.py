from django.db import models
from prescriptions.models import Prescription   

class PrescriptionDetail(models.Model):
    """
    Un détail (medicament + dosage + instructions + duree) 
    qui appartient à une Prescription.
    """
    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name="details"
    )
    medicament   = models.CharField(max_length=255)
    dosage       = models.CharField(max_length=255)
    instructions = models.TextField(blank=True)
    duree        = models.IntegerField(help_text="Durée en jours ou en unité choisie")

    class Meta:
        verbose_name = "Détail de prescription"
        verbose_name_plural = "Détails de prescription"

    def __str__(self):
        return f"{self.medicament} ({self.duree})"
