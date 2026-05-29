# Dockerfile — backend
# Image de base Node.js version LTS légère
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier
# (optimisation cache Docker — si package.json ne change pas, npm install est mis en cache)
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Port exposé par Express
EXPOSE 3000

# Commande de démarrage en mode développement
CMD ["npm", "run", "dev"]