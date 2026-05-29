# Dockerfile — frontend
# Image de base Node.js version LTS légère
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier
# (optimisation cache Docker)
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Port exposé par Vite
EXPOSE 5173

# Commande de démarrage en mode développement
# --host expose Vite à l'extérieur du conteneur (obligatoire avec Docker)
CMD ["npm", "run", "dev", "--", "--host"]