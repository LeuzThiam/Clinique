from django.contrib import admin
from .models import PrescriptionDetail

@admin.register(PrescriptionDetail)
class PrescriptionDetailAdmin(admin.ModelAdmin):
    list_display  = ("prescription", "medicament", "dosage", "duree")
    search_fields = ("medicament", "instructions")
    list_filter   = ("duree",)
