# ⚙️ Guide de Configuration Pre-commit

Ce guide explique comment configurer et utiliser **pre-commit hooks** pour automatiser les vérifications de qualité du code avant chaque commit.

## Qu'est-ce que pre-commit?

Pre-commit est un framework qui gère les hooks Git. Les hooks personnalisés s'exécutent automatiquement avant de créer un commit, permettant de:
- Formater le code (Black, Prettier)
- Vérifier la syntaxe (ESLint, Flake8)
- Organiser les imports (isort)
- Détecter les fichiers volumineux et les erreurs courantes

## 🚀 Installation

### 1. Installer pre-commit

```bash
# Avec pip
pip install pre-commit

# Vérifier l'installation
pre-commit --version
```

### 2. Initialiser les hooks

```bash
# À la racine du projet
cd Clinique
pre-commit install
```

Cela crée un fichier `.git/hooks/pre-commit` qui s'exécutera avant chaque commit.

### 3. Vérifier l'installation

```bash
# Voir les hooks installés
pre-commit run --all-files

# Voir les hooks dans le répertoire .git
ls -la .git/hooks/
```

## 📋 Fichiers de configuration

Le fichier `.pre-commit-config.yaml` contient:
- **Black**: Formate le code Python
- **isort**: Organise les imports Python
- **Flake8**: Vérifie la qualité du code Python
- **ESLint**: Vérifie le code JavaScript
- **Prettier**: Formate le code JavaScript/JSON/YAML
- **autres**: Vérifications de base (trailing whitespace, fichiers corrigés, etc.)

## 🎯 Utilisation

### Workflow normal

```bash
# Faire des changements
git add .

# Lors du commit, pre-commit s'exécutera
git commit -m "mon changement"

# Si des vérifications échouent:
# 1. Les fichiers sont automatiquement formatés
# 2. Vous devez les revoir et re-commiter
# 3. Si les problèmes persisten, corrigez-les manuellement
```

### Exécuter les hooks manuellement

```bash
# Vérifier tous les fichiers
pre-commit run --all-files

# Vérifier uniquement les fichiers stagés
pre-commit run

# Vérifier un hook spécifique
pre-commit run black --all-files
pre-commit run isort --all-files
```

### Contourner les hooks (si nécessaire)

```bash
# Forcer le commit sans passer les hooks
# ⚠️ À utiliser avec prudence!
git commit --no-verify -m "commit sans pre-commit"
```

## 📊 Hooks disponibles

| Hook | Langage | Fonction |
|------|---------|----------|
| black | Python | Formatage de code |
| isort | Python | Organisation des imports |
| flake8 | Python | Lint/vérification qualité |
| eslint | JavaScript | Lint |
| prettier | JavaScript/JSON | Formatage |
| trailing-whitespace | - | Supprime les espaces inutiles |
| end-of-file-fixer | - | Corrige la fin des fichiers |
| check-yaml | YAML | Valide la syntaxe YAML |
| check-json | JSON | Valide la syntaxe JSON |

## 🔧 Configuration personnalisée

Pour modifier les hooks, éditez `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.1.1
    hooks:
      - id: black
        args: [--line-length=100]  # personnaliser ici
```

Puis réinstallez:
```bash
pre-commit install
```

## ❌ Dépannage

### Les hooks ne s'exécutent pas

```bash
# Réinstaller
pre-commit uninstall
pre-commit install

# Vérifier les permissions
ls -la .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Hook échoue mais je dois continuer

```bash
# Option 1: Corriger les fichiers
# Les hooks formatent automatiquement, révisez et re-commitez

# Option 2: Sauter les hooks (temporaire)
git commit --no-verify -m "commit rapide"

# Option 3: Désactiver temporairement
pre-commit uninstall
git commit -m "mon commit"
pre-commit install
```

### Hook modifie des fichiers

```bash
# C'est normal! Voici le workflow:
# 1. Vous faites un commit
# 2. Pre-commit formate automatiquement les fichiers
# 3. L'index Git est modifié
# 4. Le commit échoue
# 5. Vous reviewez les changements
git diff           # Voir les modifications
git add .          # Re-ajouter les fichiers formatés
git commit -m "mon commit"  # Re-essayer
```

## 📚 Ressources

- [Documentation pre-commit](https://pre-commit.com/)
- [Documentation Black](https://black.readthedocs.io/)
- [Documentation isort](https://pycqa.github.io/isort/)
- [Documentation Flake8](https://flake8.pycqa.org/)
- [Documentation ESLint](https://eslint.org/)
- [Documentation Prettier](https://prettier.io/)

## 💡 Bonnes pratiques

✅ **À FAIRE:**
- Laisser les hooks s'exécuter et corriger les problèmes
- Commiter les changements formatés
- Maintenir la cohérence du code

❌ **À ÉVITER:**
- `--no-verify` en permanence
- Ignorez les avertissements de hooks
- Commiter du code mal formaté

---

**Pre-commit = Code Quality + Consistency + Time Saved** ⏱️
