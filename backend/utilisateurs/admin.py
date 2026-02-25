from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Utilisateur, Medecin, Assistant


@admin.register(Utilisateur)
class UtilisateurAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('id',)



@admin.register(Medecin)
class MedecinAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'nom_complet', 'specialite', 'numero_telephone')
    search_fields = ('first_name', 'last_name', 'specialite')

    def nom_complet(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    nom_complet.short_description = "Nom complet"


@admin.register(Assistant)
class AssistantAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'nom_complet', 'numero_telephone')
    search_fields = ('first_name', 'last_name')

    def nom_complet(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    nom_complet.short_description = "Nom complet"
