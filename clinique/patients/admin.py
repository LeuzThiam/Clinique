from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom', 'prenom', 'date_naissance')
    search_fields = ('nom', 'prenom')
    list_filter = ('medecin',)
    ordering = ('-date_naissance',)