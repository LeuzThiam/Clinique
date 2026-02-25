# 📚 API Reference - Clinique

Documentation complète des endpoints API de l'application Clinique.

## 🔐 Authentification

### Obtenir les tokens

**POST** `/api/token/`

Génère un token d'accès (JWT) et un token de rafraîchissement.

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Rafraîchir le token

**POST** `/api/token/refresh/`

Génère un nouveau token d'accès à partir du token de rafraîchissement.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 👥 Utilisateurs

### Endpoints

- **GET** `/api/utilisateurs/` - Lister tous les utilisateurs
- **POST** `/api/utilisateurs/` - Créer un nouvel utilisateur
- **GET** `/api/utilisateurs/{id}/` - Récupérer un utilisateur
- **PUT** `/api/utilisateurs/{id}/` - Mettre à jour un utilisateur
- **DELETE** `/api/utilisateurs/{id}/` - Supprimer un utilisateur
- **GET** `/api/utilisateurs/me/` - Récupérer le profil de l'utilisateur courant

### Exemple de réponse

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 🏥 Patients

### Endpoints

- **GET** `/api/patients/` - Lister tous les patients
- **POST** `/api/patients/` - Créer un nouveau patient
- **GET** `/api/patients/{id}/` - Récupérer un patient
- **PUT** `/api/patients/{id}/` - Mettre à jour un patient
- **DELETE** `/api/patients/{id}/` - Supprimer un patient
- **GET** `/api/patients/{id}/dossiers/` - Récupérer les dossiers d'un patient

### Paramètres de requête

```
?search=nom       - Rechercher par nom ou prénom
?age__gte=18      - Filtrer par âge minimum
?age__lte=65      - Filtrer par âge maximum
?ordering=nom     - Trier par champ
```

### Exemple de requête

```json
{
  "nom": "Diallo",
  "prenom": "Moussa",
  "date_naissance": "1990-05-15",
  "email": "moussa@example.com",
  "telephone": "+221771234567",
  "adresse": "Dakar, Senegal",
  "numero_id": "ID1234567"
}
```

## 📋 Rendez-vous

### Endpoints

- **GET** `/api/rendezvous/` - Lister tous les rendez-vous
- **POST** `/api/rendezvous/` - Créer un nouveau rendez-vous
- **GET** `/api/rendezvous/{id}/` - Récupérer un rendez-vous
- **PUT** `/api/rendezvous/{id}/` - Mettre à jour un rendez-vous
- **DELETE** `/api/rendezvous/{id}/` - Supprimer un rendez-vous
- **PATCH** `/api/rendezvous/{id}/confirm/` - Confirmer un rendez-vous

### Exemple

```json
{
  "patient": 1,
  "medecin": 2,
  "date": "2024-02-25",
  "time": "10:30:00",
  "statut": "confirmé",
  "raison": "Consultation générale"
}
```

### Statuts disponibles

- `en_attente` - En attente de confirmation
- `confirmé` - Confirmé
- `terminé` - Terminé
- `annulé` - Annulé

## 🩺 Consultations

### Endpoints

- **GET** `/api/consultations/` - Lister toutes les consultations
- **POST** `/api/consultations/` - Créer une nouvelle consultation
- **GET** `/api/consultations/{id}/` - Récupérer une consultation
- **PUT** `/api/consultations/{id}/` - Mettre à jour une consultation
- **DELETE** `/api/consultations/{id}/` - Supprimer une consultation

### Exemple

```json
{
  "patient": 1,
  "medecin": 2,
  "date": "2024-02-25T10:30:00Z",
  "diagnostic": "Grippe saisonnière",
  "traitement": "Repos et hydratation",
  "notes": "Patient à revoir dans 5 jours"
}
```

## 💊 Prescriptions

### Endpoints

- **GET** `/api/prescriptions/` - Lister toutes les prescriptions
- **POST** `/api/prescriptions/` - Créer une nouvelle prescription
- **GET** `/api/prescriptions/{id}/` - Récupérer une prescription
- **PUT** `/api/prescriptions/{id}/` - Mettre à jour une prescription
- **DELETE** `/api/prescriptions/{id}/` - Supprimer une prescription

### Exemple

```json
{
  "consultation": 1,
  "date": "2024-02-25",
  "date_expiration": "2024-03-25",
  "notes": "Prescrire avant les repas"
}
```

## 💊 Détails de Prescription

### Endpoints

- **GET** `/api/prescription-details/` - Lister les détails
- **POST** `/api/prescription-details/` - Ajouter un médicament
- **GET** `/api/prescription-details/{id}/` - Récupérer un détail
- **PUT** `/api/prescription-details/{id}/` - Mettre à jour
- **DELETE** `/api/prescription-details/{id}/` - Supprimer

### Exemple

```json
{
  "prescription": 1,
  "medicament": "Paracétamol",
  "dosage": "500mg",
  "frequence": "Toutes les 6 heures",
  "duree": "7 jours",
  "quantite": 20
}
```

## 📋 Dossiers Médicaux

### Endpoints

- **GET** `/api/dossiers-medicaux/` - Lister tous les dossiers
- **POST** `/api/dossiers-medicaux/` - Créer un nouveau dossier
- **GET** `/api/dossiers-medicaux/{id}/` - Récupérer un dossier
- **PUT** `/api/dossiers-medicaux/{id}/` - Mettre à jour
- **DELETE** `/api/dossiers-medicaux/{id}/` - Supprimer

### Exemple

```json
{
  "patient": 1,
  "medecin": 2,
  "historique_medical": "Pas de maladies chroniques",
  "allergies": "Pénicilline",
  "vaccinations": "À jour",
  "poids": 75.5,
  "taille": 180,
  "tension": "120/80"
}
```

## 📅 Sessions

### Endpoints

- **GET** `/api/session/` - Lister toutes les sessions
- **POST** `/api/session/` - Créer une session
- **GET** `/api/session/{id}/` - Récupérer une session
- **PUT** `/api/session/{id}/` - Mettre à jour une session

## 📖 Documentation Interactive

Accédez à la documentation interactive:

- **Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **ReDoc**: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- **Schema JSON**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

## 🔑 Headers requis

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## ❌ Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 204 | No Content - Succès sans contenu |
| 400 | Bad Request - Requête invalide |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Pas d'autorisation |
| 404 | Not Found - Ressource introuvable |
| 500 | Server Error - Erreur serveur |

## 🔄 Pagination

Les listes utilisent la pagination:

```
GET /api/patients/?page=1&page_size=20
```

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/patients/?page=2",
  "previous": null,
  "results": [...]
}
```

## 🔍 Filtrage et Recherche

```
GET /api/patients/?search=john&ordering=-date_ajout
```

## 📝 Filtres disponibles

- `search` - Recherche textuelle
- `ordering` - Tri (appréhender `-` pour ascendant)
- `date__gte` - Date supérieure ou égale
- `date__lte` - Date inférieure ou égale

---

**Pour plus de détails:** Consultez les endpoints directement via Swagger UI
