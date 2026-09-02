# Dockerfile — frontend
# Image de base Node.js version LTS légère
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier
# (optimisation cache Docker)
COPY package*.json ./

# npm ci installe EXACTEMENT les versions du package-lock.json.
# npm install, lui, réinstalle les dernières versions compatibles avec les "^",
# ce qui rend les builds non reproductibles : deux personnes qui construisent
# la même image à une semaine d'écart n'obtiennent pas les mêmes dépendances.
RUN npm ci

# Copie du reste du code source
COPY . .

# Port exposé par Vite
EXPOSE 5173

# Commande de démarrage en mode développement
# --host expose Vite à l'extérieur du conteneur (obligatoire avec Docker)
CMD ["npm", "run", "dev", "--", "--host"]
