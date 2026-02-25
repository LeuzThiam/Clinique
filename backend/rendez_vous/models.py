from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

class RendezVous(models.Model):
    class Status(models.TextChoices):
        EN_ATTENTE = 'EN_ATTENTE', 'En attente'
        CONFIRME = 'CONFIRME', 'Confirmé'
        REFUSE = 'REFUSE', 'Refusé'
        ANNULE = 'ANNULE', 'Annulé'
        TERMINE = 'TERMINE', 'Terminé'

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='rendez_vous')
    medecin = models.ForeignKey('utilisateurs.Medecin', on_delete=models.CASCADE, related_name='rendez_vous')
    assistant = models.ForeignKey('utilisateurs.Assistant', on_delete=models.CASCADE, related_name='rendez_vous', null=True, blank=True)

    date_heure = models.DateTimeField()
    motif = models.CharField(max_length=255)
    statut = models.CharField(max_length=20, choices=Status.choices, default=Status.EN_ATTENTE)
    commentaires = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = [('patient', 'date_heure'), ('medecin', 'date_heure')]
        ordering = ['date_heure']

    def clean(self):
        if self.date_heure < timezone.now():
            raise ValidationError("La date et l'heure du rendez-vous doivent être dans le futur.")

    def __str__(self):
        return f"RDV {self.patient} avec {self.medecin} le {self.date_heure:%Y-%m-%d %H:%M}"
