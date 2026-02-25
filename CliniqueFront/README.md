# 🏥 Clinique Frontend

Interface web React moderne et réactive pour le système de gestion de clinique médicale.

## 🚀 Technos utilisées

- **React 19.1.0** - UI Framework
- **Vite 6.3.5** - Build tool
- **React Router 7.6.0** - Navigation
- **Axios 1.9.0** - HTTP client
- **Tailwind CSS 3.4.3** - Styling
- **Bootstrap 5.3.6** - Components
- **React Bootstrap 2.10.10** - Bootstrap + React

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Dashboard.jsx    # Tableau de bord principal
│   ├── NavBar.jsx       # Barre de navigation
│   ├── Footer.jsx       # Pied de page
│   └── ...
├── pages/              # Pages principales
│   ├── Home.jsx        # Accueil
│   ├── Patients.jsx    # Gestion patients
│   ├── Consultations.jsx
│   ├── RendezVous.jsx
│   └── ...
├── context/            # Context API
│   ├── AuthContext.jsx  # Authentification
│   └── AppContext.jsx
├── Services/           # Services API
│   ├── api.js          # Configuration HTTP
│   ├── patientService.js
│   ├── consultationService.js
│   └── ...
├── styles/             # Styles globaux
│   └── index.css
├── App.jsx             # Composant racine
└── main.jsx            # Point d'entrée
```

## 🛠️ Installation et Setup

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Lancer les linters
npm run lint

# Formater le code
npm run format

# Construire pour production
npm run build

# Vérifier la build
npm run preview
```

## 🔧 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre Vite en mode développement |
| `npm run build` | Construit l'application pour production |
| `npm run lint` | Lance ESLint |
| `npm run lint:fix` | Corrige les erreurs d'ESLint |
| `npm run format` | Formate le code avec Prettier |
| `npm run format:check` | Vérifie la formatting |
| `npm run preview` | Vérifier la build en local |
| `npm run type-check` | Vérification stricte des types |

## 🎨 Styling

### Tailwind CSS

Utilities pour le styling rapide:

```jsx
<div className="flex justify-between items-center p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">Title</h1>
</div>
```

### Bootstrap Components

Via `react-bootstrap`:

```jsx
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

<Button variant="primary">Click me</Button>
<Table striped bordered hover>
  ...
</Table>
```

## 🔐 Authentification

### Context API

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  return (
    <>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(username, password)}>Login</button>
      )}
    </>
  );
}
```

### Interceptors Axios

Gestion automatique des tokens JWT:

```jsx
// Services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📡 Service API

### Exemple d'utilisation

```jsx
import patientService from '../Services/patientService';

const [patients, setPatients] = useState([]);

useEffect(() => {
  patientService.getAll()
    .then(data => setPatients(data))
    .catch(error => console.error(error));
}, []);
```

### Créer un nouveau service

```jsx
// Services/consultationService.js
import api from './api';

const getAll = () => api.get('/consultations/');
const getById = (id) => api.get(`/consultations/${id}/`);
const create = (data) => api.post('/consultations/', data);
const update = (id, data) => api.put(`/consultations/${id}/`, data);
const delete = (id) => api.delete(`/consultations/${id}/`);

export default { getAll, getById, create, update, delete };
```

## 🧪 Tests

Pour ajouter des tests React:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Exemple de test:

```jsx
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

test('renders dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});
```

## 🔍 Qualité du code

### Linting

Le projet utilise **ESLint** pour vérifier la qualité du code:

```bash
npm run lint       # Voir les erreurs
npm run lint:fix   # Corriger automatiquement
```

### Formatting

**Prettier** formate automatiquement le code:

```bash
npm run format     # Formater tous les fichiers
```

### Pre-commit

Les hooks pre-commit s'exécutent sur:
- Linting ESLint
- Formatting Prettier
- Trailing whitespace

## 📦 Dépendances principales

### Production
- `react` - UI Framework
- `react-dom` - React DOM
- `react-router-dom` - Routing
- `axios` - HTTP client
- `bootstrap` - CSS framework
- `tailwindcss` - Utility CSS

### Développement
- `vite` - Build tool
- `eslint` - Linting
- `prettier` - Code formatting
- `autoprefixer` - CSS vendor prefixes

## 🚀 Build et Deployment

### Développement
```bash
npm run dev
```

### Production
```bash
# Build
npm run build

# Vérifier la build
npm run preview

# Déployer sur Vercel/Netlify
npm run build  # Les fichiers sont dans dist/
```

### Avec Docker

```bash
docker build -t clinique-frontend .
docker run -p 5173:5173 clinique-frontend
```

## 📝 Conventions

### Structure des fichiers

- **PascalCase** pour les composants: `Dashboard.jsx`, `PatientList.jsx`
- **camelCase** pour les fonctions: `fetchPatients()`, `handleSubmit()`
- **UPPERCASE_SNAKE_CASE** pour les constantes: `API_BASE_URL`, `MAX_RETRIES`

### Nommage des fichiers

- Composants: `ComponentName.jsx`
- Hooks: `useComponentName.js`
- Services: `serviceName.js`
- Utils: `utilName.js`

### Imports/Exports

```jsx
// ✅ Bons
import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';

// ❌ Mauvais
import * as React from 'react';
import Dashboard from '../components/index.js';
```

## 🐛 Troubleshooting

### Port 5173 déjà utilisé

```bash
npm run dev -- --port 3000
```

### Node modules corrompus

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Ressources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

**Frontend pour Clinique - Gestion Médicale Simplifiée** 🏥
