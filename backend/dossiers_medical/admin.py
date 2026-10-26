from django.contrib import admin
from .models import DossierMedical

@admin.register(DossierMedical)
class DossierMedicalAdmin(admin.ModelAdmin):
    list_display = ( "patient", "date_creation", "date_suivante_visite")
    search_fields = ("id_dossier_medical", "patient__nom", "patient__prenom")
    list_filter = ("date_creation",)
