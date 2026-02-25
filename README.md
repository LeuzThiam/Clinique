# Clinique

Medical clinic management system with Django REST API and React frontend.

## 📊 Stack

- **Backend**: Django 5.2, Django REST Framework, PostgreSQL
- **Frontend**: React 19, Vite 6, Tailwind CSS
- **Auth**: JWT (djangorestframework-simplejwt)
- **DevOps**: Docker, Docker Compose

## 🏗️ Architecture

```
Backend API (Django) ────────► PostgreSQL
        ↑
        └─ JWT Auth
        
Frontend (React/Vite) ────────► Backend API
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker & Docker Compose
- Git

### Run Everything
```bash
docker-compose up
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/

### Setup Admin User (first time)
```bash
docker-compose exec backend python manage.py createsuperuser
```

## 🛠️ Local Development (without Docker)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt

cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ✅ Testing

### Backend Tests
```bash
cd backend
pytest                                # Run all tests
pytest --cov=.                        # With coverage
pytest -v tests_api.py                # Specific file
```

### Frontend Tests (if available)
```bash
cd frontend
npm run test
```

## 🔑 Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_ENGINE=django.db.backends.sqlite3  # or postgresql
DB_NAME=clinique
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

See `backend/.env.example` for all options.

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

See `frontend/.env.example` for all options.

## 📚 API Endpoints

### Base URL: `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/token/` | Get JWT token |
| GET | `/patients/` | List patients |
| POST | `/patients/` | Create patient |
| GET | `/consultations/` | List consultations |
| POST | `/consultations/` | Create consultation |

**Auth**: All endpoints require JWT token in header:
```
Authorization: Bearer <your-token>
```

## 📖 Documentation

- API Docs: http://localhost:8000/api/docs/ (Swagger)
- ReDoc: http://localhost:8000/api/redoc/

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change port in docker-compose.yml or:
docker-compose down
```

**Database issues:**
```bash
cd backend
python manage.py migrate --run-syncdb
```

**Frontend won't connect to API:**
Check `VITE_API_URL` in `frontend/.env`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/name`
5. Open PR

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT - See [LICENSE](./LICENSE)

## 👤 Author

Modou
