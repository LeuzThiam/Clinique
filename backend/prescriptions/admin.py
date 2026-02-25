from django.contrib import admin
from .models import Prescription

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = (
        "date_prescription",
        "consultation",
    )
    search_fields = (
        "id_prescription",
        "medicaments",
        "posologie",
    )
    list_filter = ("date_prescription",)
