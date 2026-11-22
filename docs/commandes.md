# Routine quotidienne — Sens Solidaire

## 🌅 Matin — Démarrage

1. **Ouvrir le terminal WSL** — Docker est installé directement dans WSL et démarre tout seul avec lui (Docker Desktop n'est plus utilisé depuis le 8 novembre 2026). Vérifier avec `docker ps` (pas d'erreur = Docker est prêt)

2. **Récupérer les dernières modifications de l'équipe** :
```bash
cd ~/sens-solidaire
git checkout dev
git pull origin dev
git checkout dev-front
git merge dev
```

3. **Démarrer les conteneurs** :
```bash
cd ~/sens-solidaire
docker compose up -d
```

✅ Le site est accessible sur http://localhost:5173
✅ L'API est accessible sur http://localhost:3001
✅ PostgreSQL tourne dans Docker — pas besoin de le démarrer séparément
⚠️ Ne jamais lancer npm run dev manuellement quand Docker est en route
⚠️ Erreur « ports are not available … 5432 » : le PostgreSQL de WSL (projets Holberton) tourne → `sudo systemctl stop postgresql`

---

4. **Lancer le tunnel ngrok** (dans un terminal séparé) :
```bash
ngrok http 5173
```

⚠️ L'URL ngrok change à chaque relance de ngrok (pas à chaque redémarrage Docker).
✅ URL actuelle : `https://couch-stray-twistable.ngrok-free.dev`
✅ Partager cette URL à Alison et à la cliente pour accès externe
⚠️ Si l'URL change, mettre à jour `allowedHosts` dans `vite.config.js` :
```javascript
allowedHosts: ['nouvelle-url.ngrok-free.dev']
```
Puis redémarrer Docker : `docker compose down && docker compose up`

**Second tunnel backend** (second compte ngrok, si besoin) :
```bash
ngrok http 3000 --config ~/.config/ngrok/ngrok2.yml
```

---

## 🌙 Soir — Fermeture

1. **Arrêter les conteneurs** (libère la mémoire ; les données restent dans le volume) :
```bash
cd ~/sens-solidaire
docker compose stop
```
⚠️ Jamais `docker compose down -v` : le `-v` supprime la base de données.

---

## 📝 Fin de session — Git

1. **Commits thématiques sur dev-front** (un commit par changement logique) :
```bash
git add <fichiers concernés>
git commit -m "feat(portée): ..."
git push origin dev-front
```
La CI GitHub Actions se lance à chaque push (onglet **Actions** du dépôt) : attendre la coche verte.

2. **`npm audit` puis merge dans dev** :
```bash
docker exec sensolidaire_backend npm audit
docker exec sensolidaire_frontend npm audit
```
```bash
git checkout dev
git merge dev-front
git push origin dev
git checkout dev-front
```

3. **Vers `main` (occasionnel)** : `main` est protégée, pas de push direct. Sur GitHub : **Pull requests → New pull request**, base `main` ← compare `dev`, attendre la CI verte, **Merge pull request**. Puis en local : `git checkout main && git pull`.

---

## 🗄️ Base de données — commandes utiles

> Prisma Studio ne fonctionne pas sous Docker (bug connu v7) → tout passe par `psql` directement.

### Se connecter à la BDD
```bash
docker compose exec postgres psql -U postgres -d sensolidaire
```

### Explorer (une fois connecté dans psql)
```sql
\dt                          -- liste toutes les tables
\d "NomTable"                -- structure d'une table (colonnes, types, clés)
SELECT * FROM "Mission";     -- lire les données d'une table
```
⚠️ Les noms de tables Prisma sont sensibles à la casse → toujours entre guillemets doubles `" "`

### Modifier des données
```sql
UPDATE "TeamMember" SET role = 'Nouveau rôle' WHERE id = 1;
```

### Supprimer des données
```sql
DELETE FROM "TeamMember" WHERE id = 1;   -- une ligne précise
```
⚠️ Sans `WHERE`, `DELETE FROM "TeamMember";` supprime **toutes** les lignes de la table — à utiliser avec prudence.

### Quitter psql
```sql
\q
```

### Repartir de zéro (reset complet de la BDD)

⚠️ **Efface toutes les données de la cliente.** Faire d'abord une sauvegarde, et suivre plutôt `docs/sauvegarde-restauration.md` (les 2 comptes PostgreSQL de `roles.sql` doivent être recréés, ce que les étapes ci-dessous ne font pas).
```bash
# 1. Supprime le conteneur ET le volume (= toutes les données)
docker compose down -v

# 2. Reconstruit et redémarre
docker compose up -d --build

# 3. Réapplique les migrations
docker exec sensolidaire_backend npx prisma migrate deploy

# 4. Régénère le client Prisma (réflexe obligatoire en v7)
docker exec sensolidaire_backend npx prisma generate

# 5. Réinjecte les données de base (seed)
docker exec sensolidaire_backend npx prisma db seed
```

### Relancer juste le seed (sans tout reset)
```bash
docker exec sensolidaire_backend npx prisma db seed
```
⚠️ Le seed fait un `deleteMany` avant de recréer → toutes les données actuelles des tables seedées sont remplacées, pas seulement ajoutées.