"""
Pytest configuration and fixtures for Clinique project.
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def api_client():
    """Fixture providing an API client for tests."""
    return APIClient()


@pytest.fixture
def authenticated_client(db):
    """Fixture providing an authenticated API client."""
    client = APIClient()
    user = User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='Test@1234567890'
    )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
    
    return client


@pytest.fixture
def test_user(db):
    """Fixture creating a test user."""
    return User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='Test@1234567890'
    )


@pytest.fixture
def admin_user(db):
    """Fixture creating a test admin user."""
    return User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='Admin@1234567890'
    )


@pytest.fixture
def admin_client(db):
    """Fixture providing an authenticated admin client."""
    client = APIClient()
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='Admin@1234567890'
    )
    
    refresh = RefreshToken.for_user(admin)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
    
    return client
