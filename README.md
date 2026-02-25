# 🏥 Clinique

Medical clinic management system. Django backend + React frontend.

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Backend Tests](https://github.com/modou/clinique/actions/workflows/backend_tests.yml/badge.svg)](https://github.com/modou/clinique/actions/workflows/backend_tests.yml)
[![Frontend Tests](https://github.com/modou/clinique/actions/workflows/frontend_tests.yml/badge.svg)](https://github.com/modou/clinique/actions/workflows/frontend_tests.yml)
[![Security Scanning](https://github.com/modou/clinique/actions/workflows/security-scanning.yml/badge.svg)](https://github.com/modou/clinique/actions/workflows/security-scanning.yml)
[![Python 3.13+](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://www.python.org/)
[![Node 20+](https://img.shields.io/badge/Node-20+-green.svg)](https://nodejs.org/)
[![Code style: black](https://img.shields.io/badge/Code%20style-black-000000.svg)](https://github.com/psf/black)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org/)

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Tech Stack](#stack)
- [Project Structure](#project-structure)
- [Setup](#setup-environment-variables)
- [Development](#available-commands)
- [Testing](#testing)
- [Contributing](./CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)
- [Changelog](./CHANGELOG.md)
- [License](#license)

## Quick Start

### Backend
```bash
cd clinique
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
→ http://localhost:8000 | API Docs: http://localhost:8000/api/docs/

### Frontend
```bash
cd CliniqueFront
npm install
npm run dev
```
→ http://localhost:5173

## Available Commands

```bash
make dev           # Start backend + frontend
make test          # Run tests
make lint          # Check code quality
make format        # Format code
make docker-up     # Docker compose up
```

Go to the admin panel at http://localhost:8000/admin/

## Useful Links

| Link | URL |
|------|-----|
| API Swagger | http://localhost:8000/api/docs/ |
| API ReDoc | http://localhost:8000/api/redoc/ |
| Admin | http://localhost:8000/admin/ |
| Frontend | http://localhost:5173 |

## Stack

- **Backend**: Django 5.2, DRF, JWT
- **Frontend**: React 19, Vite, Tailwind
- **Database**: SQLite (dev), PostgreSQL (prod)
- **DevOps**: Docker, GitHub Actions, Pre-commit hooks

## Project Structure

```
clinique/              # Backend
├── utilisateurs/      # Users
├── patients/         # Patients
├── consultations/    # Consultations
├── prescriptions/    # Prescriptions
└── rendez_vous/      # Appointments

CliniqueFront/        # Frontend
├── src/components/
├── src/pages/
├── src/Services/
└── src/context/
```

## Features

- ✅ Patient management
- ✅ Appointment scheduling
- ✅ Consultations & diagnoses
- ✅ Prescriptions
- ✅ JWT auth
- ✅ Admin panel
- ✅ API documentation
- ✅ Docker ready

## Setup Environment Variables

### Backend (.env)
```bash
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

## Common Issues

**Port in use:**
```bash
python manage.py runserver 8001
npm run dev -- --port 3000
```

**Django migrations fail:**
```bash
python manage.py migrate --run-syncdb
```

**Node modules issue:**
```bash
rm -rf node_modules package-lock.json && npm install
```

## Testing

```bash
# Backend
cd clinique
pytest --cov=.

# Frontend
cd CliniqueFront
npm run test
```

## Code Quality

Pre-commit hooks run on every commit:
```bash
pre-commit install  # First time
```

Hooks check: formatting, imports, linting

## Contributing

1. Create branch: `git checkout -b feature/name`
2. Make changes
3. Test + lint: `make test && make lint`
4. Commit: `git commit -m "type: description"`
5. Push and PR

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker, Nginx, SSL setup.

## License

MIT
