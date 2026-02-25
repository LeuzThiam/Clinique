# 🔧 Troubleshooting Guide - Clinique

Guide pour résoudre les problèmes courants dans Clinique.

## 🚀 Installation et Setup

### ImportError: No module named 'django'

**Cause**: Django n'est pas installé

**Solution:**
```bash
pip install django
# ou
pip install -r requirements.txt
```

### ModuleNotFoundError: No module named 'rest_framework'

**Cause**: DRF n'est pas installé

**Solution:**
```bash
pip install djangorestframework djangorestframework_simplejwt
# ou
pip install -r requirements.txt
```

### FileNotFoundError: .env file

**Cause**: Le fichier .env n'existe pas

**Solution:**
```bash
cp clinique/.env.example clinique/.env
```

### DATABASES CONNECTION ERROR

**Cause**: La base de données n'existe pas

**Solution:**
```bash
cd clinique
python manage.py migrate
```

---

## 💻 Serveur Django

### RuntimeError: "Could not find ASGI application object"

**Cause**: Erreur de configuration ASGI

**Solution:**
```bash
# Utilisez runserver pour développement
python manage.py runserver
```

### Address already in use

**Cause**: Le port 8000 est utilisé

**Solutions:**
```bash
# Utiliser un autre port
python manage.py runserver 8001

# Trouver et tuer le processus
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID>

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### ModuleNotFoundError in settings.py

**Cause**: Les apps ne sont pas importées correctement

**Solution:**
Vérifier `INSTALLED_APPS` dans `settings.py`:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    # ...
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    
    'utilisateurs',
    'patients',
    # ... toutes les apps
]
```

### Migrate fails with "no such table"

**Cause**: Base de données corrompue

**Solutions:**
```bash
# Option 1: Réappliquer les migrations
python manage.py migrate --run-syncdb

# Option 2: Supprimer et recréer la BD
rm db.sqlite3
python manage.py migrate

# Option 3: Purger les migrations
python manage.py migrate <app> zero
python manage.py migrate
```

---

## 🔐 Authentification

### 401 Unauthorized on API requests

**Cause**: Token JWT manquant ou expiré

**Solutions:**
```bash
# 1. Rafraîchir le token
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "your-refresh-token"}'

# 2. Se reconnecter
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Credentials don't work

**Cause**: Username/password incorrects

**Solutions:**
```bash
# Créer un nouvel utilisateur
python manage.py createsuperuser

# Vérifier les utilisateurs
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.all()
>>> User.objects.create_user('newuser', 'email@example.com', 'password')
```

### CORS error in frontend

**Cause**: Configuration CORS

**Solutions:**
Vérifier `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

ou définir dans `.env`:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 💾 Base de données

### Cannot open database file

**Cause**: db.sqlite3 verrouillé ou permissions insuffisantes

**Solutions:**
```bash
# Vérifier les permissions
chmod 666 db.sqlite3
chmod 755 clinique/

# Supprimer et recréer
rm db.sqlite3
python manage.py migrate
```

### IntegrityError: UNIQUE constraint failed

**Cause**: Doublon dans la base de données

**Solutions:**
```bash
# Vérifier les données
python manage.py shell
>>> from patients.models import Patient
>>> Patient.objects.all()

# Supprimer les doublons
>>> Patient.objects.filter(email='duplicate@example.com').delete()
```

### No suitable adapter found

**Cause**: Driver PostgreSQL non installé (si vous utilisez PostgreSQL)

**Solutions:**
```bash
# Installer psycopg2
pip install psycopg2-binary

# ou
pip install psycopg2
```

---

## ⚡ Frontend React

### npm ERR! 404 Not Found

**Cause**: Package introuvable

**Solutions:**
```bash
# Nettoyer les caches
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Unexpected token u in JSON at position 0

**Cause**: package.json corrompu

**Solutions:**
```bash
# Recréer package-lock.json
rm package-lock.json
npm install
```

### Port 5173 already in use

**Cause**: Un autre processus utilise le port

**Solutions:**
```bash
# Utiliser un autre port
npm run dev -- --port 3000

# Tuer le processus
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID>

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Module not found '@/...'

**Cause**: Alias d'import non configuré

**Solutions:**
Vérifier `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Blank page in browser

**Cause**: Erreur de compilation

**Solutions:**
```bash
# Voir les erreurs du serveur
npm run dev  # Regarder la console

# Vérifier les logs du navigateur (F12 > Console)

# Vérifier la structure
ls -la src/  # Les fichiers existent?

# Vider le cache
rm -rf .vite dist node_modules
npm install
npm run dev
```

---

## 🔄 Git et Version Control

### fatal: not a git repository

**Cause**: Vous n'êtes pas dans le répertoire Git

**Solutions:**
```bash
cd /chemin/vers/Clinique
git status
```

### Your branch is ahead of 'origin/main' by X commits

**Cause**: Commits locaux non poussés

**Solutions:**
```bash
git push origin feature/nom-branche
```

### merge conflict

**Cause**: Conflits lors du merge

**Solutions:**
```bash
# 1. Voir les conflits
git status

# 2. Éditer les fichiers en conflit
vim fichier_en_conflit.py  # Résoudre manuellement

# 3. Marquer comme résolu
git add fichier_en_conflit.py
git commit -m "Merge resolved"
```

---

## 🧪 Tests

### pytest: command not found

**Cause**: pytest n'est pas installé

**Solutions:**
```bash
pip install pytest pytest-django pytest-cov
```

### FAILED tests/[test_name] - can't find fixture

**Cause**: conftest.py manquant ou malconfigurée

**Solutions:**
Vérifier que `conftest.py` existe à la racine de `clinique/`:
```bash
ls -la clinique/conftest.py
```

### Test database creation failed

**Cause**: Permissions insuffisantes

**Solutions:**
```bash
# Utiliser :memory: pour les tests
# Dans settings.py pour les tests:
if 'test' in os.sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
```

---

## 🐳 Docker

### docker: command not found

**Cause**: Docker n'est pas installé

**Solutions:**
```bash
# Installer Docker
# https://docs.docker.com/get-docker/
```

### Cannot connect to Docker daemon

**Cause**: Docker daemon n'est pas en cours d'exécution

**Solutions:**
```bash
# Démarrer Docker
# Windows/macOS: Docker Desktop
# Linux
sudo systemctl start docker
```

### Port 8000 already allocated

**Cause**: Le port est utilisé par un autre conteneur

**Solutions:**
```bash
docker-compose down  # Arrêter tous les conteneurs

docker ps  # Voir les conteneurs actifs
docker stop <CONTAINER_ID>
```

---

## 📊 Logging et Debug

### Voir les logs détaillés

```bash
# Backend
DJANGO_LOG_LEVEL=DEBUG python manage.py runserver

# Frontend
npm run dev  # Les logs sont dans la console

# Docker
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Ajouter des print statements

```python
# settings.py
DEBUG = True

# models.py
print(f"DEBUG: Patient created - {patient.id}")
```

```javascript
// React
console.log('DEBUG: User logged in', user);
console.error('ERROR:', error);
```

---

## 📞 Besoin d'aide supplémentaire?

1. ✅ Chercher dans [Stack Overflow](https://stackoverflow.com/)
2. ✅ Vérifier la [documentation Django](https://docs.djangoproject.com/)
3. ✅ Consulter les [Issues GitHub](https://github.com/LeuzThiam/Clinique/issues)
4. ✅ Ouvrir une nouvelle issue avec détails

**Format pour les issues:**
- Titre clair
- Reproduction steps
- Erreur exacte
- Environnement (OS, Python version, Node version)
- Comportement attendu vs actuel

---

**Problem-solving power! 💪**
