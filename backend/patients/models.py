from django.db import models

class Patient(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    adresse = models.TextField()
    numero_telephone = models.CharField(max_length=15)
    adresse_email = models.EmailField()
    groupe_sanguin = models.CharField(max_length=3, blank=True, null=True)

    # relation avec medecin
    medecin = models.ForeignKey('utilisateurs.Medecin', on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')

    def __str__(self):
        return f"{self.nom} {self.prenom}"
    
