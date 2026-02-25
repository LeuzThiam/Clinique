from django.db import models
from utilisateurs.models import Utilisateur

class Session(models.Model):
    """
    Historique de connexion/déconnexion.
    """
    utilisateur     = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='sessions')
    date_connexion  = models.DateTimeField(auto_now_add=True)
    date_deconnexion = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Session de {self.utilisateur.username} le {self.date_connexion.strftime('%Y-%m-%d %H:%M:%S')}"