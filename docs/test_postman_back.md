# Runbook — Tester l'API Missions Admin (Postman)

> Document de référence **complet** : de l'environnement éteint jusqu'aux tests verts.
> À suivre dans l'ordre. Chaque partie a un objectif et une vérification claire.
>
> Conteneur backend : `sensolidaire_backend` · URL API : `http://localhost:3000`
> Rappel : sur ce poste, Docker Compose s'utilise **avec un tiret** → `docker-compose`

---

## Vue d'ensemble — l'ordre des opérations

```
1. Démarrer Docker      →  les 3 conteneurs tournent
2. Préparer la base     →  migrations + client Prisma + seed
3. Vérifier l'API       →  /api/health + GET /api/missions répondent
4. Tester dans Postman  →  login (token) puis les 6 cas
5. (si ça casse)        →  dépannage ciblé
6. (dernier recours)    →  reset complet
```

---

## PARTIE 1 — Démarrer l'environnement

### 1.1 Lancer les conteneurs

```bash
# Démarrage normal (en arrière-plan)
docker-compose up -d

# Premier lancement OU après modif d'un Dockerfile / package.json
docker-compose up -d --build
```

### 1.2 Vérifier que tout est "Up"

```bash
docker-compose ps
```

✅ Attendu : `sensolidaire_db`, `sensolidaire_backend`, `sensolidaire_frontend` tous en **Up**.

❌ Si un conteneur est en `Restarting` ou `Exited` → regarde ses logs :

```bash
docker-compose logs backend      # logs du backend
docker-compose logs db           # logs de la base
docker-compose logs -f backend   # en direct (Ctrl+C pour quitter)
```

---

## PARTIE 2 — Préparer la base de données

> ⚠️ Avec **Prisma v7**, après CHAQUE migration il faut **régénérer le client**
> à l'intérieur du conteneur, sinon le code tourne avec un client périmé.

### 2.1 Appliquer les migrations

```bash
docker exec sensolidaire_backend npx prisma migrate deploy
```

> `migrate deploy` applique les migrations existantes (idéal au démarrage).
> Pour CRÉER une nouvelle migration pendant le dev : `npx prisma migrate dev --name <nom>`.

### 2.2 Régénérer le client Prisma (réflexe Prisma v7)

```bash
docker exec sensolidaire_backend npx prisma generate
```

### 2.3 Remplir la base (seed)

```bash
docker exec sensolidaire_backend npx prisma db seed
```

✅ Attendu : 1 admin, 5 missions, 7 témoignages créés.

### 2.4 (Optionnel) Inspecter la base visuellement

```bash
docker exec -it sensolidaire_backend npx prisma studio
```

> Ouvre une interface web sur la base. Pratique pour voir/supprimer
> la mission de test créée au CAS 1.

---

## PARTIE 3 — Vérifier que l'API répond (AVANT Postman)

Avant de tester la route protégée, on confirme que le serveur vit.

### 3.1 Health check

Dans le navigateur ou Postman : `GET http://localhost:3000/api/health`

✅ Attendu : `200` + `{ "status": "ok", "timestamp": "..." }`

### 3.2 Lecture publique des missions

`GET http://localhost:3000/api/missions`

✅ Attendu : `200` + la liste des 5 missions du seed.

> 👉 **Note les `slug` exacts ici** : tu en auras besoin pour le CAS 6 (slug déjà pris).

---

## PARTIE 4 — Tests Postman

### 4.0 Récupérer un token admin (login)

La route de création est protégée → il faut un token.

- `POST http://localhost:3000/api/auth/login`
- Body → raw → JSON :

```json
{
  "email": "<EMAIL_ADMIN_DU_SEED>",
  "password": "<MOT_DE_PASSE_ADMIN_DU_SEED>"
}
```

> Identifiants à récupérer dans `prisma/seed.js`.

✅ Attendu : `200` + un access token dans le body (champ souvent nommé `accessToken` ou `token`).
**Copie ce token.**

**Automatisation (recommandé)** — onglet **Scripts → Post-response** de la requête login :

```javascript
const data = pm.response.json();
pm.collectionVariables.set("token", data.accessToken); // adapte le nom du champ
```

→ le token est stocké dans `{{token}}` et réutilisé partout.

### 4.0bis Présenter le token

Sur chaque requête admin : onglet **Authorization** → Type **Bearer Token** → coller le token (ou `{{token}}`).

---

### Les 6 cas

Tous sur `POST http://localhost:3000/api/admin/missions` (sauf indication).

| Cas | Token | Body (résumé)                          | Attendu             |
|-----|-------|----------------------------------------|---------------------|
| 1   | ✅    | complet et valide                      | **201** + mission   |
| 2   | ❌    | valide                                 | **401** Token manquant |
| 3   | ✅    | sans `title`                           | **400** + champ listé |
| 4   | ✅    | `slug: "Kenya<script>"`                | **400** slug invalide |
| 5   | ✅    | `type: "licorne"`                      | **400** type invalide |
| 6   | ✅    | `slug` d'une mission existante         | **409** + `SLUG_TAKEN` |

**CAS 1 — valide (201)**
```json
{
  "title": "Test mission Postman",
  "country": "Kenya",
  "slug": "test-mission-postman",
  "short_description": "Mission de test creee depuis Postman",
  "type": "faune_sauvage"
}
```

**CAS 2 — sans token (401)** → même body, mais Authorization = **No Auth**.
C'est LE test sécu : il prouve que la route est verrouillée.

**CAS 3 — champ manquant (400)**
```json
{ "country": "Kenya", "slug": "test-sans-titre", "short_description": "Sans titre" }
```
→ message : `Champ(s) obligatoire(s) manquant(s) : title`

**CAS 4 — slug mal formé (400)**
```json
{ "title": "X", "country": "Kenya", "slug": "Kenya<script>", "short_description": "Slug interdit" }
```

**CAS 5 — type hors liste (400)**
```json
{ "title": "X", "country": "Kenya", "slug": "test-type", "short_description": "Type faux", "type": "licorne" }
```

**CAS 6 — slug déjà pris (409)**
```json
{ "title": "Doublon", "country": "Kenya", "slug": "<SLUG_EXISTANT_DU_SEED>", "short_description": "Doublon" }
```
→ vérifie la présence de `"code": "SLUG_TAKEN"` dans la réponse.

### 4.1 Nettoyage après tests

La mission du CAS 1 a été créée pour de vrai → supprime-la (Prisma Studio ou future route DELETE) pour garder la base propre.

---

## PARTIE 5 — Dépannage : « ça passait, ça passe plus »

> Ta crainte légitime. Voici les causes les plus fréquentes, par symptôme.

### 🔴 Symptôme : le CAS 1 renvoie 409 alors qu'il marchait
**Cause** : tu l'as déjà lancé une fois → le slug `test-mission-postman` existe maintenant en base.
**Fix** : change le slug (`test-mission-postman-2`) OU supprime la mission créée. Ce n'est PAS un bug, c'est la contrainte d'unicité qui fait son travail.

### 🔴 Symptôme : toutes les requêtes admin renvoient 401 d'un coup
**Cause probable n°1** : ton token a **expiré** (l'access token dure 15 min).
**Fix** : refais le login (Partie 4.0) pour obtenir un token frais.
**Cause probable n°2** : tu as oublié l'onglet Authorization / mal collé le token.

### 🔴 Symptôme : le backend crash au démarrage / module introuvable
**Cause** : `node_modules` du conteneur incomplet (volume anonyme périmé).
**Fix** : voir Partie 6 (reset complet avec `-v`).

### 🔴 Symptôme : erreur Prisma "client out of date" / champ inconnu
**Cause** : client Prisma non régénéré après une migration (piège Prisma v7).
**Fix** :
```bash
docker exec sensolidaire_backend npx prisma generate
docker-compose restart backend
```

### 🔴 Symptôme : erreurs CORS dans le navigateur
**Cause** : deux instances frontend tournent en même temps (un conteneur Docker
+ un `npm run dev` manuel) → conflit de port / origine.
**Fix** : n'en garder qu'UNE seule active.

### 🟡 Warning Node "≥22 required" (cosmétique)
Le conteneur tourne en Node 18/20, un package demande ≥22. **N'empêche pas
de fonctionner** → à traiter post-deadline, ignorer pour l'instant.

### Vérifier ce qui occupe un port
```bash
ss -tlnp | grep <port>     # ex : 3000, 5173, 5432
lsof -i :<port>
```

---

## PARTIE 6 — Reset complet (dernier recours)

> Quand l'environnement est dans un état incohérent et que rien ne s'explique.
> ⚠️ `-v` SUPPRIME les volumes → la base est remise à zéro (seed à refaire).

```bash
# 1. Tout arrêter ET supprimer les volumes (reset base + node_modules)
docker-compose down -v

# 2. Reconstruire les images proprement
docker-compose up -d --build

# 3. Réappliquer les migrations
docker exec sensolidaire_backend npx prisma migrate deploy

# 4. Régénérer le client Prisma
docker exec sensolidaire_backend npx prisma generate

# 5. Re-seed la base
docker exec sensolidaire_backend npx prisma db seed

# 6. Vérifier
docker-compose ps
curl http://localhost:3000/api/health
```

Après ces 6 étapes, tu repars d'un état **garanti propre**.

---

## ANNEXE — Mémo commandes

```bash
# Docker
docker-compose up -d                 # démarrer
docker-compose up -d --build         # démarrer + reconstruire
docker-compose ps                    # état des conteneurs
docker-compose logs -f backend       # logs backend en direct
docker-compose down                  # arrêter
docker-compose down -v               # arrêter + reset volumes (BDD)

# Prisma (dans le conteneur)
docker exec sensolidaire_backend npx prisma migrate deploy
docker exec sensolidaire_backend npx prisma generate
docker exec sensolidaire_backend npx prisma db seed
docker exec -it sensolidaire_backend npx prisma studio

# Terminal dans le conteneur
docker exec -it sensolidaire_backend bash

# Diagnostic ports
ss -tlnp | grep 3000
lsof -i :3000
```