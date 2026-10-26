# Backend Django
FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements
COPY clinique/requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY clinique/ .

# Créer le répertoire pour les fichiers statiques
RUN mkdir -p /app/staticfiles

# Variables d'environnement par défaut
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=clinique.settings

# Port
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["gunicorn", "clinique.wsgi:application", "--bind", "0.0.0.0:8000"]
