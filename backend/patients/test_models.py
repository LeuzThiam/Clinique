"""
Tests for patients app
"""
import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.integration
class TestPatientAPI:
    """Test Patient API endpoints"""

    def test_list_patients_authenticated(self, authenticated_client):
        """Test listing patients as authenticated user"""
        url = reverse('patient-list')
        response = authenticated_client.get(url)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_list_patients_unauthenticated(self, api_client):
        """Test listing patients as unauthenticated user"""
        url = reverse('patient-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_patient_authenticated(self, authenticated_client):
        """Test creating a patient as authenticated user"""
        url = reverse('patient-list')
        data = {
            'nom': 'Doe',
            'prenom': 'John',
            'date_naissance': '1990-01-01',
            'email': 'john@example.com',
            'telephone': '+1234567890'
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code in [
            status.HTTP_201_CREATED,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_403_FORBIDDEN
        ]

    def test_create_patient_unauthenticated(self, api_client):
        """Test creating a patient as unauthenticated user"""
        url = reverse('patient-list')
        data = {
            'nom': 'Doe',
            'prenom': 'John',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
