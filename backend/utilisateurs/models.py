from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
    """
    Modèle de base pour tous les utilisateurs de la clinique.
    Contient tous les champs partagés : login, prénom/nom, contact et rôle.
    """
    ROLE_MEDECIN   = 'medecin'
    ROLE_ASSISTANT = 'assistant'
    ROLE_CHOICES = [
        (ROLE_MEDECIN,   'Médecin'),
        (ROLE_ASSISTANT, 'Assistant'),
    ]

    role             = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        editable=False,
        db_index=True,
    )
    adresse          = models.TextField()
    numero_telephone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.get_full_name()} — {self.get_role_display()}"

    def save(self, *args, **kwargs):
        # On autorise la création de superusers même sans rôle explicite
        if not self.role and not self.is_superuser:
            raise ValueError("Un utilisateur doit toujours avoir un rôle défini.")
        super().save(*args, **kwargs)


class Medecin(Utilisateur):
    """
    Multi‑table inheritance : ajoute la spécialité.
    """
    specialite = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Médecin"

    def save(self, *args, **kwargs):
        self.role = Utilisateur.ROLE_MEDECIN
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Dr. {self.get_full_name()} — {self.specialite}"


class Assistant(Utilisateur):
    """
    Proxy model : pas de table supplémentaire, juste une classe métier.
    """
    class Meta:
        verbose_name = "Assistant"

    def save(self, *args, **kwargs):
        self.role = Utilisateur.ROLE_ASSISTANT
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_full_name()}"



