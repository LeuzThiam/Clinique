# 🏥 Clinique - Platform MEDSOFTWARE

> Système de gestion de clinique médicale avec API REST et interface web responsive

[![Django](https://img.shields.io/badge/Django-5.2.1-green?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

## 📋 Table des matières

- [À propos](#À-propos)
- [Fonctionnalités](#Fonctionnalités)
- [Architecture](#Architecture)
- [Prérequis](#Prérequis)
- [Installation](#Installation)
- [Configuration](#Configuration)
- [Utilisation](#Utilisation)
- [Développement](#Développement)
- [Tests](#Tests)
- [Déploiement](#Déploiement)
- [Structure du projet](#Structure-du-projet)
- [API Documentation](#API-Documentation)
- [Contribution](#Contribution)

## 🎯 À propos

**Clinique** est une plateforme de gestion médicale complète permettant de :
- Gérer les patients et leurs dossiers médicaux
- Organiser les rendez-vous et les consultations
- Gérer les prescriptions et les détails des médicaments
- Maintenir l'historique des sessions médicales

## ✨ Fonctionnalités

- ✅ **Authentification JWT** sécurisée
- ✅ **API REST** complète avec DRF
- ✅ **Gestion des patients** et dossiers médicaux
- ✅ **Système de rendez-vous** optimisé
- ✅ **Prescriptions** et suivi des médicaments
- ✅ **Interface réactive** avec React & Tailwind CSS
- ✅ **CORS** configuré pour développement et production
- ✅ **Variables d'environnement** sécurisées

## 🏗️ Architecture

```
Clinique/
├── Backend (Django REST Framework)
│   ├── clinique/              # Configuration principale
│   ├── utilisateurs/          # Gestion des utilisateurs
│   ├── patients/              # Gestion des patients
│   ├── consultations/         # Consultations médicales
│   ├── rendez_vous/           # Rendez-vous
│   ├── prescriptions/         # Prescriptions
│   ├── dossiers_medical/      # Dossiers médicaux
│   └── session/               # Sessions
│
└── Frontend (React + Vite)
    ├── src/
    │   ├── components/        # Composants réutilisables
    │   ├── pages/             # Pages principales
    │   ├── context/           # React Context
    │   ├── Services/          # Appels API
    │   └── styles/            # Styles globaux
```

## 📋 Prérequis

### Backend
- Python 3.10+
- pip et virtualenv
- Git

### Frontend
- Node.js 18+
- npm ou yarn

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/LeuzThiam/Clinique.git
cd Clinique
```

### 2. Configuration du Backend

```bash
# Se placer dans le dossier clinique
cd clinique

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier .env.example en .env
cp .env.example .env

# Effectuer les migrations
python manage.py migrate

# Créer un superutilisateur (admin)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

Le serveur backend sera disponible sur `http://localhost:8000`

### 3. Configuration du Frontend

```bash
# Se placer dans le dossier CliniqueFront
cd CliniqueFront

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` dans le dossier `clinique/` :

```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# JWT Settings
ACCESS_TOKEN_LIFETIME=21600  # 6 hours
REFRESH_TOKEN_LIFETIME=1209600  # 14 days

# Environment
ENVIRONMENT=development
```

Voir [.env.example](.env.example) pour plus de détails.

## 💻 Utilisation

### Endpoints API Principaux

#### Utilisateurs & Authentification
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/token/refresh/` - Rafraîchir le token
- `GET /api/utilisateurs/` - Liste des utilisateurs

#### Patients
- `GET /api/patients/` - Lister les patients
- `POST /api/patients/` - Créer un patient
- `GET /api/patients/{id}/` - Détails d'un patient
- `PUT /api/patients/{id}/` - Mettre à jour un patient
- `DELETE /api/patients/{id}/` - Supprimer un patient

#### Rendez-vous
- `GET /api/rendez-vous/` - Lister les rendez-vous
- `POST /api/rendez-vous/` - Créer un rendez-vous
- `PUT /api/rendez-vous/{id}/` - Modifier un rendez-vous

#### Consultations
- `GET /api/consultations/` - Lister les consultations
- `POST /api/consultations/` - Créer une consultation

#### Prescriptions
- `GET /api/prescriptions/` - Lister les prescriptions
- `POST /api/prescriptions/` - Créer une prescription

## 🔧 Développement

### Créer une branche de développement

```bash
# Créer une nouvelle branche
git checkout -b feature/nom-de-la-feature

# Faire vos modifications...

# Commiter vos changements
git add .
git commit -m "Description claire du changement"

# Pousser la branche
git push origin feature/nom-de-la-feature

# Créer une Pull Request sur GitHub
```

### Standards de code

#### Backend (Python)
```bash
# Formatter le code avec Black
black .

# Vérifier les erreurs avec Flake8
flake8 .

# Vérifier les imports avec isort
isort .
```

#### Frontend (JavaScript/React)
```bash
# Linter le code
npm run lint

# Vue d'aperçu du build
npm run preview
```

## 🧪 Tests

### Backend

```bash
# Lancer tous les tests
python manage.py test

# Tests avec couverture
coverage run --source='.' manage.py test
coverage report
```

### Frontend

```bash
# Tests avec Vitest (configuration recommandée)
npm run test

# Couverture des tests
npm run test:coverage
```

## 🌐 Déploiement

### Production avec Gunicorn

```bash
# Installer Gunicorn (déjà dans requirements.txt)
pip install gunicorn

# Démarrer l'application
gunicorn clinique.wsgi:application --bind 0.0.0.0:8000
```

### Avec Docker

```bash
# Construire l'image
docker build -t clinique:latest .

# Lancer le conteneur
docker run -p 8000:8000 clinique:latest
```

### Variables d'environnement en production

```bash
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
ENVIRONMENT=production
```

## 📁 Structure du projet

```
Clinique/
├── .env.example              # Template pour les variables d'environnement
├── .gitignore                # Fichiers à ignorer dans Git
├── README.md                 # Cette documentation
├── clinique/                 # Backend Django
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── clinique/
│   │   ├── settings.py       # Configuration Django
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── [applications Django]
└── CliniqueFront/            # Frontend React
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
```

## 📚 API Documentation

### Authentification

**Login**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}'
```

**Réponse**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Headers requis

```bash
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 🤝 Contribution

Les contributions sont bienvenues! Pour contribuer :

1. **Fork** le projet
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Guidelines

- Respecter les conventions de nommage existantes
- Écrire des messages de commit clairs et descriptifs
- Tester vos changements avant de soumettre une PR
- Ajouter une documentation si nécessaire

## 📝 License

Ce projet est sous la licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [Issue](https://github.com/LeuzThiam/Clinique/issues)
- Vérifier la [Documentation Django](https://docs.djangoproject.com/)
- Vérifier la [Documentation React](https://react.dev/)

---

**Fait avec ❤️ par [LeuzThiam](https://github.com/LeuzThiam)**
