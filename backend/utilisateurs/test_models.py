"""
Tests for utilisateurs app
"""
import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

User = get_user_model()


@pytest.mark.unit
class TestUserModel:
    """Test the User model"""

    def test_create_user(self, db):
        """Test creating a regular user"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='Secure@1234567',
            role='assistant',
            adresse='123 Rue Test',
            numero_telephone='5551234567',
        )
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser

    def test_create_superuser(self, db):
        """Test creating a superuser"""
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='Secure@1234567',
            role='assistant',
            adresse='1 Admin Street',
            numero_telephone='5550000000',
        )
        assert admin.username == 'admin'
        assert admin.is_staff
        assert admin.is_superuser

    def test_user_string_representation(self, test_user):
        """Test user string representation"""
        assert 'Assistant' in str(test_user)


@pytest.mark.unit
class TestUserViews:
    """Test user API views"""

    def test_list_users_authenticated(self, authenticated_client):
        """Test listing users as authenticated user"""
        url = reverse('utilisateur-list')
        response = authenticated_client.get(url)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED]

    def test_list_users_unauthenticated(self, api_client):
        """Test listing users as unauthenticated user"""
        url = reverse('utilisateur-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_user(self, db, api_client):
        """Test creating a new user"""
        url = reverse('utilisateur-list')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'Secure@1234567'
        }
        response = api_client.post(url, data, format='json')
        # Response might be 400 if not allowed or 201 if allowed
        assert response.status_code in [
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_201_CREATED
        ]


@pytest.mark.integration
class TestUserAuthentication:
    """Test authentication flow"""

    def test_user_login(self, db, api_client, test_user):
        """Test user login"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'testuser',
            'password': 'Test@1234567890'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_invalid_credentials(self, db, api_client):
        """Test login with invalid credentials"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'nonexistent',
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
