# Frontend React avec Vite
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json /app/

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . /app/

# Exposer le port de dev Vite
EXPOSE 5173

# Commande par défaut pour développement
CMD ["npm", "run", "dev"]
