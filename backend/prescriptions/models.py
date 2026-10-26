from django.db import models
from consultations.models import Consultation

class Prescription(models.Model):
    """
    Représente une ordonnance délivrée lors d'une consultation.
    """
    date_prescription = models.DateTimeField(auto_now_add=True)
    etat = models.CharField(max_length=100, blank=True)

    # 1 consultation → * prescriptions
    consultation = models.ForeignKey(
        Consultation,
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    class Meta:
        verbose_name = "Prescription"
        verbose_name_plural = "Prescriptions"
        ordering = ["-date_prescription"]

    def __str__(self):
        return f"{self.id} – {self.date_prescription:%Y-%m-%d}"
