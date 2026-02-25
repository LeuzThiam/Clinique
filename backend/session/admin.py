from django.contrib import admin
from .models import Session

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'date_connexion', 'date_deconnexion')
    search_fields = ('utilisateur__username', 'utilisateur__email')
    list_filter = ('date_connexion',)
    ordering = ('-date_connexion',)

