# apps/rendezvous/services.py
from django.utils import timezone
from django.core.exceptions import PermissionDenied, ValidationError
from .models import RendezVous

def confirmer_rdv(rdv: RendezVous, utilisateur):
    if not hasattr(utilisateur, "medecin") or utilisateur.medecin != rdv.medecin:
        raise PermissionDenied("Seul le médecin concerné peut confirmer ce rendez-vous.")
    
    if rdv.statut != RendezVous.Statut.EN_ATTENTE:
        raise ValidationError("Le rendez-vous n'est pas en attente.")

    rdv.statut = RendezVous.Statut.CONFIRME
    rdv.save()

def refuser_rdv(rdv: RendezVous, utilisateur, raison=""):
    if not hasattr(utilisateur, "medecin") or utilisateur.medecin != rdv.medecin:
        raise PermissionDenied("Seul le médecin concerné peut refuser ce rendez-vous.")

    if rdv.statut != RendezVous.Statut.EN_ATTENTE:
        raise ValidationError("Ce rendez-vous ne peut pas être refusé maintenant.")

    rdv.statut = RendezVous.Statut.REFUSE
    rdv.commentaire = raison
    rdv.save()

def annuler_rdv(rdv: RendezVous, utilisateur):
    if not hasattr(utilisateur, "patient") or utilisateur.patient != rdv.patient:
        raise PermissionDenied("Seul le patient peut annuler ce rendez-vous.")

    if rdv.statut != RendezVous.Statut.EN_ATTENTE:
        raise ValidationError("Le rendez-vous ne peut plus être annulé.")

    rdv.statut = RendezVous.Statut.ANNULE
    rdv.save()
