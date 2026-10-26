from django.contrib import admin
from .models import RendezVous

@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ('patient', 'date_heure', 'statut')
    search_fields = ('patient__nom', 'patient__prenom')
    list_filter = ('statut',)
    ordering = ('-date_heure',)

