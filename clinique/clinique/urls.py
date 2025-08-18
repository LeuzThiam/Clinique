from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),


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
