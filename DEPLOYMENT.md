# 🚀 Guide de Déploiement - Clinique

Ce guide couvre le déploiement de l'application **Clinique** en production.

## 📋 Table des matières

- [Prérequis](#Prérequis)
- [Déploiement Local](#Déploiement-Local)
- [Déploiement en Production](#Déploiement-en-Production)
- [Hébergements Recommandés](#Hébergements-Recommandés)
- [Configuration SSL/TLS](#ConfigurationSSLTLS)
- [Sauvegarde et Recovery](#Sauvegarde-et-Recovery)
- [Monitoring](#Monitoring)
- [Troubleshooting](#Troubleshooting)

## ✅ Prérequis

- Docker et Docker Compose installés
- Domaine personnalisé
- Certificat SSL
- Base de données PostgreSQL (optionnel, SQLite pour petit déploiement)
- Serveur avec au moins 2GB RAM

## 🏠 Déploiement Local

### Avec Docker Compose

```bash
# Clone du repository
git clone https://github.com/LeuzThiam/Clinique.git
cd Clinique

# Démarrer les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

Le projet sera accessible à `http://localhost`

## 🌐 Déploiement en Production

### 1. Préparation du Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone et Configuration

```bash
# Clone du repository
git clone https://github.com/LeuzThiam/Clinique.git
cd Clinique

# Créer le fichier .env pour la production
cp clinique/.env.example clinique/.env

# Éditer le fichier .env
nano clinique/.env
```

**Configuration .env pour production:**

```bash
DEBUG=False
SECRET_KEY=your-super-secret-key-min-50-chars
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
ENVIRONMENT=production
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Base de données PostgreSQL (recommandé)
DATABASE_URL=postgresql://user:password@db:5432/clinique

# Email (pour notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 3. Générer une bonne SECRET_KEY

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Configuration Nginx

Créer `/etc/nginx/sites-available/clinique`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 10M;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 10M;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # API Backend
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Admin Panel
    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer le site:

```bash
sudo ln -s /etc/nginx/sites-available/clinique /etc/nginx/sites-enabled/clinique
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Certificat SSL

```bash
# Obtenir un certificat Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Test du renouvellement automatique
sudo certbot renew --dry-run
```

### 6. Démarrer l'Application

```bash
# Mettre à jour le docker-compose pour la production
# Modifier les variables d'environnement si nécessaire

# Démarrer les services
docker-compose up -d

# Appliquer les migrations
docker-compose exec backend python manage.py migrate

# Créer un superutilisateur
docker-compose exec backend python manage.py createsuperuser

# Collecter les fichiers statiques
docker-compose exec backend python manage.py collectstatic --noinput

# Vérifier les services
docker-compose ps
```

## 🏢 Hébergements Recommandés

### Option 1: Heroku
```bash
# Installer Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Créer l'app
heroku create clinique-app

# Configurer les variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key

# Déployer
git push heroku main
```

### Option 2: DigitalOcean/Linode
```bash
# Plus de contrôle, coûts plus bas
# Utiliser les droplets et Docker Compose
```

### Option 3: AWS/Google Cloud
```bash
# Solutions enterprise
# Utiliser ECS/GKE pour orchestration
```

## 🔒 Configuration SSL/TLS

```bash
# Vérifier le certificat
openssl s_client -connect yourdomain.com:443

# Renouveller le certificat
sudo certbot renew -v

# Automatiser le renouvellement
sudo systemctl enable certbot.timer
```

## 💾 Sauvegarde et Recovery

### Sauvegarde de la base de données

```bash
# Sauvegarde PostgreSQL
docker-compose exec db pg_dump -U clinique_user clinique > backup.sql

# Restauration
docker-compose exec -T db psql -U clinique_user clinique < backup.sql
```

### Sauvegarde automatique

Créer un cron job:

```bash
0 2 * * * /home/clinique/backup.sh
```

Script `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/clinique/backups"
DATE=$(date +\%Y\%m\%d_\%H\%M\%S)

docker-compose exec -T db pg_dump -U clinique_user clinique > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Garder les 10 dernières sauvegardes
find $BACKUP_DIR -type f -mtime +10 -delete
```

## 📊 Monitoring

### Logs

```bash
# Voir tous les logs
docker-compose logs -f

# Logs du backend
docker-compose logs -f backend

# Logs du frontend
docker-compose logs -f frontend
```

### Health Check

```bash
# Vérifier la santé du backend
curl https://yourdomain.com/api/

# Vérifier la santé du frontend
curl https://yourdomain.com/
```

### Sentry pour Error Tracking

```bash
# Installer sentry-sdk
pip install sentry-sdk

# Ajouter à settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/project-id",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
)
```

## 🔧 Troubleshooting

### Application ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier la connexion BD
docker-compose exec backend python manage.py dbshell

# Relancer les migrations
docker-compose exec backend python manage.py migrate
```

### Problèmes de performance

```bash
# Vérifier l'utilisation des ressources
docker stats

# Augmenter les limites
docker-compose up -d --scale backend=2
```

### Certificat SSL expiré

```bash
# Renouveller rapidement
sudo certbot renew --force-renewal

# Vérifier la date d'expiration
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

**Pour plus d'aide:**
- [Django Deployment Guide](https://docs.djangoproject.com/en/5.2/howto/deployment/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
