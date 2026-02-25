# Guide de Contribution - Clinique

Merci de votre intérêt pour contribuer à **Clinique**! Ce document explique comment bien contribuer au projet.

## 📋 Table des matières

- [Code de Conduite](#Code-de-Conduite)
- [Processus de Contribution](#Processus-de-Contribution)
- [Git Flow](#Git-Flow)
- [Standards de Code](#Standards-de-Code)
- [Commit Messages](#Commit-Messages)
- [Pull Requests](#Pull-Requests)
- [Reporting des Bugs](#Reporting-des-Bugs)
- [Suggestions de Features](#Suggestions-de-Features)

## 📜 Code de Conduite

- Soyez respectueux et inclusif
- Maintenez un environnement professionnel
- Acceptez les critiques constructives
- Focalisez-vous sur le projet, pas sur la personne

## 🚀 Processus de Contribution

### 1. Fork et Clone

```bash
# Fork le repo sur GitHub
git clone https://github.com/votre-username/Clinique.git
cd Clinique
git remote add upstream https://github.com/LeuzThiam/Clinique.git
```

### 2. Créer une Branche

**Utilisez un nommage clair et descriptif:**

```bash
# Feature
git checkout -b feature/add-patient-search

# Bug fix
git checkout -b fix/login-error-handling

# Refactoring
git checkout -b refactor/optimize-api-endpoints

# Documentation
git checkout -b docs/improve-api-readme
```

### 3. Développer et Tester

```bash
# Assurez-vous que tout fonctionne
python manage.py runserver  # Backend
npm run dev                 # Frontend

# Lancer les tests
python manage.py test       # Backend
npm run test               # Frontend
```

### 4. Commit et Push

```bash
git add .
git commit -m "feat: add patient search by name"
git push origin feature/add-patient-search
```

### 5. Créer une Pull Request

- Décrivez clairement vos changements
- Référencez les issues connexes
- Assurez-vous que tous les tests passent

## 🔄 Git Flow

### Branch Strategy

```
main (production)
│
├── develop (intégration)
│   ├── feature/xyz
│   ├── fix/bug-name
│   └── refactor/optimization
```

### Workflow

1. **Créer une branche** depuis `develop`
2. **Développer** votre feature
3. **Merger** dans `develop` via Pull Request
4. **Tester** en staging
5. **Merger** dans `main` pour production

## 💻 Standards de Code

### Backend (Python)

**Conventions:**
- Suivre [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Nommer les variables en `snake_case`
- Nommer les classes en `PascalCase`
- Utiliser des docstrings pour toutes les fonctions/classes

**Exemple:**
```python
def get_patient_by_id(patient_id):
    """
    Récupérer un patient par son ID.
    
    Args:
        patient_id: L'ID du patient
        
    Returns:
        Patient object ou None
    """
    return Patient.objects.get(id=patient_id)
```

**Formate le code:**
```bash
# Formater avec Black
black .

# Vérifier avec Flake8
flake8 .

# Organiser les imports
isort .
```

### Frontend (React/JavaScript)

**Conventions:**
- Suivre [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Nommer les composants en `PascalCase`
- Nommer les fonctions/variables en `camelCase`
- Utiliser des JSDoc pour les composants

**Exemple:**
```javascript
/**
 * Affiche les détails d'un patient
 * @param {Object} patient - Les données du patient
 * @returns {JSX.Element}
 */
function PatientDetails({ patient }) {
  return (
    <div className="patient-details">
      <h1>{patient.name}</h1>
    </div>
  );
}
```

**Linter:**
```bash
npm run lint
```

## 📝 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Une nouvelle fonctionnalité
- **fix**: Une correction de bug
- **docs**: Changements de documentation
- **style**: Formatage de code (pas de changement logique)
- **refactor**: Refactorisation de code
- **perf**: Amélioration de performance
- **test**: Ajout ou modification de tests
- **chore**: Changements de configuration/dépendances
- **ci**: Changements CI/CD

### Exemples

```bash
# Bons exemples
git commit -m "feat(auth): add JWT token refresh endpoint"
git commit -m "fix(patients): resolve duplicate patient creation bug"
git commit -m "docs: add API authentication guide"
git commit -m "refactor(consultations): simplify date handling"

# Mauvais exemples
git commit -m "fix stuff"
git commit -m "updated code"
git commit -m "WIP"
```

## 🔀 Pull Requests

### Before Submitting

1. **Mettez à jour depuis `develop`:**
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

2. **Lancer les tests:**
   ```bash
   # Backend
   python manage.py test
   
   # Frontend
   npm run test
   ```

3. **Vérifier le linting:**
   ```bash
   # Backend
   black . && flake8 .
   
   # Frontend
   npm run lint
   ```

### PR Description Template

```markdown
## Description
[Décrivez brièvement vos changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Issues connexes
Fixes #[numéro du ticket]

## Changements
- [Changement 1]
- [Changement 2]

## Testing
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Testé manuellement

## Screenshots (si applicable)
[Ajouter des screenshots]

## Checklist
- [ ] Le code suit les standards du projet
- [ ] J'ai fait des self-review
- [ ] Les commentaires sont clairs
- [ ] La documentation est à jour
- [ ] Pas de breaking changes
```

## 🐛 Reporting des Bugs

### Avant de signaler

1. Vérifiez que le bug n'existe pas déjà
2. Vérifiez que votre environnement est à jour
3. Testez avec les dernières versions des dépendances

### Issue Template

```markdown
## Description du bug
[Décrivez le bug]

## Étapes de reproduction
1. ...
2. ...
3. ...

## Comportement attendu
[Décrivez le comportement attendu]

## Comportement actuel
[Décrivez ce qui se passe actuellement]

## Screenshots
[Si applicable]

## Environnement
- OS: [Windows/macOS/Linux]
- Python: [version]
- Node: [version]
- Django: [version]
```

## 💡 Suggestions de Features

### Bonnes suggestions

- Soyez spécifique
- Expliquez l'use case
- Fournissez des exemples
- Référencez les discussions existantes

### Feature Request Template

```markdown
## Description du feature
[Décrivez la fonctionnalité]

## Use case
[Pourquoi avez-vous besoin de cette feature?]

## Solution proposée
[Comment devrait-elle fonctionner?]

## Alternatives
[Alternatives envisagées]

## Ressources additionnelles
[Liens, références, etc.]
```

## ⚡ Conseils Rapides

✅ **À FAIRE:**
- Faire de petits commits
- Écrire des messages clairs
- Tester vos changements
- Maintenir la cohérence du code
- Documenter les changements importants

❌ **À ÉVITER:**
- Commits volumineux
- Merges forcées
- Code non commenté
- Ignorer les tests
- Pusher directement sur main

## 🆘 Besoin d'aide?

- Consultez le [README.md](./README.md)
- Ouvrez une [Discussion](https://github.com/LeuzThiam/Clinique/discussions)
- Demandez dans les commentaires du PR

---

**Merci de contribuer à Clinique! 🎉**
