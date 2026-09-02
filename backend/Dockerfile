# Dockerfile — backend
# Image de base Node.js version LTS légère
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier
# (optimisation cache Docker — si package.json ne change pas, npm install est mis en cache)
COPY package*.json ./

# npm ci installe EXACTEMENT les versions du package-lock.json.
# npm install, lui, réinstalle les dernières versions compatibles avec les "^",
# ce qui rend les builds non reproductibles : deux personnes qui construisent
# la même image à une semaine d'écart n'obtiennent pas les mêmes dépendances.
RUN npm ci

# Copie du reste du code source (inclut prisma/schema.prisma)
COPY . .

# Génère le client Prisma à partir du schema.prisma
# Doit être APRÈS le COPY pour avoir accès au schema
RUN npx prisma generate

# Port exposé par Express
EXPOSE 3000

# Commande de démarrage en mode développement
CMD ["npm", "run", "dev"]
