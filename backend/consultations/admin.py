from django.contrib import admin
from .models import Consultation

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ( "date", "dossier_medical", "rendez_vous")
    search_fields = ("id_consultation", "motif", "diagnostic")
    list_filter = ("date", "dossier_medical")
