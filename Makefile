.PHONY: help install setup dev test lint format clean docker-build docker-up docker-down

help:
	@echo "=========================================="
	@echo "Clinique Management Commands"
	@echo "=========================================="
	@echo ""
	@echo "Setup Commands:"
	@echo "  make install           Install all dependencies"
	@echo "  make setup             Setup project (install + migrate)"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev               Start development servers"
	@echo "  make dev-backend       Start Django server"
	@echo "  make dev-frontend      Start React server"
	@echo ""
	@echo "Quality Commands:"
	@echo "  make lint              Run all linters"
	@echo "  make lint-backend      Lint Python code"
	@echo "  make lint-frontend     Lint JavaScript code"
	@echo "  make format            Format all code"
	@echo "  make format-backend    Format Python code"
	@echo "  make format-frontend   Format JavaScript code"
	@echo ""
	@echo "Testing Commands:"
	@echo "  make test              Run all tests"
	@echo "  make test-backend      Run Django tests"
	@echo "  make test-frontend     Run React tests"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build      Build Docker images"
	@echo "  make docker-up         Start containers"
	@echo "  make docker-down       Stop containers"
	@echo ""
	@echo "Cleanup Commands:"
	@echo "  make clean             Clean up cache and build files"
	@echo "  make clean-all         Full cleanup including venv"
	@echo ""

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd clinique && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd CliniqueFront && npm install
	@echo "✅ All dependencies installed"

# Setup project
setup: install
	@echo "Running migrations..."
	cd clinique && python manage.py migrate
	@echo "Creating superuser..."
	cd clinique && python manage.py createsuperuser
	@echo "✅ Project setup complete"

# Development
dev:
	@echo "Starting development servers..."
	@echo "Backend on http://localhost:8000"
	@echo "Frontend on http://localhost:5173"
	@bash -c 'cd clinique && python manage.py runserver' & \
	@bash -c 'cd CliniqueFront && npm run dev' & \
	wait

dev-backend:
	cd clinique && python manage.py runserver

dev-frontend:
	cd CliniqueFront && npm run dev

# Linting
lint: lint-backend lint-frontend
	@echo "✅ All linting checks passed"

lint-backend:
	@echo "Linting Python code..."
	cd clinique && black --check . && flake8 . && isort --check-only .

lint-frontend:
	@echo "Linting JavaScript code..."
	cd CliniqueFront && npm run lint

# Format code
format: format-backend format-frontend
	@echo "✅ All code formatted"

format-backend:
	@echo "Formatting Python code..."
	cd clinique && black . && isort .

format-frontend:
	@echo "Formatting JavaScript code..."
	cd CliniqueFront && npm run format

# Testing
test: test-backend test-frontend

test-backend:
	@echo "Running Django tests..."
	cd clinique && pytest --cov=. --cov-report=html

test-frontend:
	@echo "Running React tests..."
	cd CliniqueFront && npm run test

test-watch:
	@echo "Running Django tests in watch mode..."
	cd clinique && pytest-watch

# Pre-commit
pre-commit-install:
	pre-commit install

pre-commit-run:
	pre-commit run --all-files

pre-commit-uninstall:
	pre-commit uninstall

# Docker
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Migrations
migrate:
	cd clinique && python manage.py migrate

makemigrations:
	cd clinique && python manage.py makemigrations

# Database
reset-db:
	cd clinique && rm db.sqlite3 && python manage.py migrate

superuser:
	cd clinique && python manage.py createsuperuser

# Cleanup
clean:
	@echo "Cleaning up cache and build files..."
	find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name '.pytest_cache' -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name '.coverage' -exec rm -f {} + 2>/dev/null || true
	cd CliniqueFront && rm -rf dist node_modules/.cache
	@echo "✅ Cleanup complete"

clean-all: clean
	@echo "Removing virtual environments..."
	rm -rf clinique/venv clinique/env
	rm -rf CliniqueFront/node_modules
	@echo "✅ Full cleanup complete"

# Git helpers
branch-dev:
	git checkout -b feature/$(NAME)

push-dev:
	git add . && git commit -m "$(MSG)" && git push origin feature/$(NAME)

# Misc
requirements:
	cd clinique && pip freeze > requirements.txt

shell:
	cd clinique && python manage.py shell

admin:
	@echo "Admin panel available at: http://localhost:8000/admin/"
