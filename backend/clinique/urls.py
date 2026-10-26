from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('api/utilisateurs/', include('utilisateurs.urls')),
    path('api/session/', include('session.urls')),

    # Patients et dossiers médicaux
    path('api/patients/', include('patients.urls')),
    path('api/dossiers-medicaux/', include('dossiers_medical.urls')),

    path('api/rendezvous/', include('rendez_vous.urls')),

    # Consultations
    path('api/consultations/', include('consultations.urls')),

    # Prescriptions et détails de prescription
    path('api/prescriptions/', include('prescriptions.urls')),
    path('api/prescription-details/', include('prescription_details.urls')),
]
