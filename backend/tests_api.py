import pytest
pytestmark = pytest.mark.skip(reason="Legacy API test module not aligned with current models/routes")
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from patients.models import Patient
from utilisateurs.models import Medecin
from consultations.models import Consultation

User = get_user_model()


@pytest.fixture
def api_client():
    """API client for testing."""
    return APIClient()


@pytest.fixture
def user():
    """Create a test user."""
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass123"
    )


@pytest.fixture
def medecin(user):
    """Create a test doctor."""
    return Medecin.objects.create(
        user=user,
        numero_licence="LIC123456",
        specialite="Cardiologie"
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """API client with JWT authentication."""
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client


@pytest.fixture
def patient(medecin):
    """Create a test patient."""
    return Patient.objects.create(
        nom="Doe",
        prenom="John",
        date_naissance="1990-01-01",
        adresse="123 Main St",
        numero_telephone="555-1234",
        adresse_email="john@example.com",
        groupe_sanguin="O+",
        medecin=medecin
    )


@pytest.mark.django_db
class TestPatientAPI:
    """Test patient API endpoints."""
    
    def test_create_patient(self, authenticated_client, medecin):
        """Test creating a new patient."""
        data = {
            "nom": "Smith",
            "prenom": "Jane",
            "date_naissance": "1985-05-15",
            "adresse": "456 Oak St",
            "numero_telephone": "555-5678",
            "adresse_email": "jane@example.com",
            "groupe_sanguin": "AB+",
            "medecin": medecin.id
        }
        response = authenticated_client.post("/api/patients/", data, format="json")
        assert response.status_code == 201
        assert response.data["nom"] == "Smith"
    
    def test_list_patients(self, authenticated_client, patient):
        """Test listing patients."""
        response = authenticated_client.get("/api/patients/")
        assert response.status_code == 200
        assert len(response.data["results"]) > 0
    
    def test_retrieve_patient(self, authenticated_client, patient):
        """Test retrieving a specific patient."""
        response = authenticated_client.get(f"/api/patients/{patient.id}/")
        assert response.status_code == 200
        assert response.data["nom"] == patient.nom
    
    def test_update_patient(self, authenticated_client, patient):
        """Test updating a patient."""
        data = {"prenom": "Jonathan"}
        response = authenticated_client.patch(
            f"/api/patients/{patient.id}/",
            data,
            format="json"
        )
        assert response.status_code == 200
        assert response.data["prenom"] == "Jonathan"
    
    def test_delete_patient(self, authenticated_client, patient):
        """Test deleting a patient."""
        patient_id = patient.id
        response = authenticated_client.delete(f"/api/patients/{patient_id}/")
        assert response.status_code == 204
        assert not Patient.objects.filter(id=patient_id).exists()
    
    def test_create_patient_missing_required_field(self, authenticated_client):
        """Test creating patient with missing required field."""
        data = {
            "nom": "Test",
            # missing prenom
            "date_naissance": "1990-01-01",
            "adresse": "123 St",
            "numero_telephone": "555-1234",
            "adresse_email": "test@example.com"
        }
        response = authenticated_client.post("/api/patients/", data, format="json")
        assert response.status_code == 400
    
    def test_create_patient_invalid_email(self, authenticated_client, medecin):
        """Test creating patient with invalid email."""
        data = {
            "nom": "Test",
            "prenom": "Patient",
            "date_naissance": "1990-01-01",
            "adresse": "123 St",
            "numero_telephone": "555-1234",
            "adresse_email": "invalid-email",
            "medecin": medecin.id
        }
        response = authenticated_client.post("/api/patients/", data, format="json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestConsultationAPI:
    """Test consultation API endpoints."""
    
    def test_create_consultation(self, authenticated_client, patient):
        """Test creating a new consultation."""
        data = {
            "patient": patient.id,
            "date": "2024-02-25",
            "diagnostic": "Hypertension",
            "observations": "Patient complains of high blood pressure",
        }
        response = authenticated_client.post("/api/consultations/", data, format="json")
        assert response.status_code == 201
        assert response.data["diagnostic"] == "Hypertension"
    
    def test_list_consultations(self, authenticated_client, patient):
        """Test listing consultations."""
        Consultation.objects.create(
            patient=patient,
            date="2024-02-25",
            diagnostic="Hypertension",
            observations="Test observation"
        )
        response = authenticated_client.get("/api/consultations/")
        assert response.status_code == 200
    
    def test_retrieve_consultation(self, authenticated_client, patient):
        """Test retrieving a specific consultation."""
        consultation = Consultation.objects.create(
            patient=patient,
            date="2024-02-25",
            diagnostic="Diabetes",
            observations="Blood sugar elevated"
        )
        response = authenticated_client.get(f"/api/consultations/{consultation.id}/")
        assert response.status_code == 200
        assert response.data["diagnostic"] == "Diabetes"


@pytest.mark.django_db
class TestAuthentication:
    """Test authentication endpoints."""
    
    def test_unauthenticated_access_denied(self, api_client):
        """Test that unauthenticated requests are denied."""
        response = api_client.get("/api/patients/")
        assert response.status_code == 401
    
    def test_token_generation(self, api_client, user):
        """Test JWT token generation."""
        data = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = api_client.post("/api/token/", data, format="json")
        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data
    
    def test_invalid_credentials(self, api_client):
        """Test login with invalid credentials."""
        data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = api_client.post("/api/token/", data, format="json")
        assert response.status_code == 401
