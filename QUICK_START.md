# 🚀 Quick Start Guide - Clinique

Guide de démarrage rapide pour mettre en place le projet Clinique en local.

## 5 minutes pour démarrer

### 1️⃣ Cloner et naviguer

```bash
git clone https://github.com/LeuzThiam/Clinique.git
cd Clinique
```

### 2️⃣ Backend Django

```bash
cd clinique

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier .env
cp .env.example .env

# Migrations
python manage.py migrate

# Créer un superutilisateur (admin)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

✅ Backend sur `http://localhost:8000`

### 3️⃣ Frontend React

Dans un autre terminal:

```bash
cd CliniqueFront

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

✅ Frontend sur `http://localhost:5173`

### 4️⃣ Premier login

1. Aller sur `http://localhost:5173`
2. Login avec vos identifiants (créé avec `createsuperuser`)
3. Profit! 🎉

## 🛠️ Commandes utiles

```bash
# Depuis la racine
make help              # Voir toutes les commandes

# Backend
make dev-backend       # Démarrer Django
make test-backend      # Tests
make format-backend    # Formater le code
make lint-backend      # Vérifier la qualité

# Frontend
make dev-frontend      # Démarrer React
make lint-frontend     # ESLint
make format-frontend   # Prettier

# Les deux ensemble
make dev               # Démarrer front + back
make test              # Tous les tests
make lint              # Tous les linters
```

## 📚 Ressources utiles

| Ressource | URL |
|-----------|-----|
| Documentation API (Swagger) | `http://localhost:8000/api/docs/` |
| Documentation API (ReDoc) | `http://localhost:8000/api/redoc/` |
| Admin Django | `http://localhost:8000/admin/` |
| Frontend | `http://localhost:5173` |

## 🐛 Problèmes courants

### Port déjà utilisé

```bash
# Changer le port React
npm run dev -- --port 3000

# Changer le port Django
python manage.py runserver 8001
```

### ModuleNotFoundError

```bash
# Réinstaller les dépendances
pip install --force-reinstall -r requirements.txt
```

### Node modules corrompus

```bash
rm -rf node_modules package-lock.json
npm install
```

### Migrations fail

```bash
cd clinique
python manage.py migrate --run-syncdb
```

### Permission denied .venv/Scripts/activate

```bash
# macOS/Linux
source venv/bin/activate

# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1
```

## 📝 Prochaines étapes

1. ✅ Lire [README.md](./README.md) pour une vue d'ensemble
2. ✅ Consulter [CONTRIBUTING.md](./CONTRIBUTING.md) pour contribuer
3. ✅ Regarder [API_REFERENCE.md](./API_REFERENCE.md) pour les endpoints
4. ✅ Lire [DEPLOYMENT.md](./DEPLOYMENT.md) pour la production

## 🤝 Besoin d'aide?

- 📖 Vérifier la [documentation](https://docs.djangoproject.com/)
- 🔍 Chercher dans les [Issues GitHub](https://github.com/LeuzThiam/Clinique/issues)
- 💬 Ouvrir une nouvelle issue

---

**Bienvenue sur Clinique! Commencez à dévéloper maintenant** 🏥
