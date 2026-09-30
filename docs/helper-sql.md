# 🗄️ SQL — Les bases pour m'en sortir (RNCP)

Projet : **Sens Solidaire** — PostgreSQL 16 + Prisma v7 + Docker

> Objectif : savoir **expliquer**, **accéder** et **manipuler** ma base de données devant le jury.

---

## 1. Le vocabulaire de base

| Mot | Définition simple | Exemple dans mon projet |
|---|---|---|
| **Base de données** | Un ensemble organisé de données | `sensolidaire` |
| **SGBD** | Le logiciel qui gère la base | PostgreSQL |
| **Table** | Un tableau qui stocke un type de données | `"Mission"`, `"Testimonial"` |
| **Colonne** | Une information (un champ) | `title`, `slug`, `is_active` |
| **Ligne** (enregistrement) | Un élément concret | la mission Kenya |
| **Clé primaire** (PK) | Identifiant unique d'une ligne | `id` |
| **Clé étrangère** (FK) | Colonne qui pointe vers la PK d'une autre table | `mission_id` dans `"Testimonial"` |
| **SQL** | Le langage pour parler à la base | `SELECT * FROM "Mission";` |
| **ORM** | Outil qui traduit du code en SQL | Prisma |

💡 **Base relationnelle** = les tables sont reliées entre elles par des clés étrangères.

---

## 2. Les relations (à savoir expliquer)

### Les cardinalités

| Notation | Signification |
|---|---|
| `1` | exactement un (obligatoire) |
| `0..1` | zéro ou un (facultatif) |
| `0..*` | zéro, un ou plusieurs |

⚠️ **Piège** : la cardinalité se lit **à l'autre bout** de la ligne.

### Les relations de Mission

| Relation | Lecture | Clé étrangère |
|---|---|---|
| Mission → MissionPricing | 1 mission a 0 à plusieurs tarifs | `mission_id` dans `MissionPricing` (obligatoire) |
| Mission ← MissionReport | 1 mission a 0 à plusieurs rapports | `mission_id` dans `MissionReport` (nullable) |
| Mission ← Testimonial | 1 mission a 0 à plusieurs témoignages | `mission_id` dans `Testimonial` (nullable) |
| Mission ↔ Location | plusieurs à plusieurs | table de liaison |

### 👉 La règle d'or

**La clé étrangère va toujours du côté du « plusieurs » (`*`).**

- `1` côté parent → la FK est **obligatoire** (NOT NULL)
- `0..1` côté parent → la FK est **nullable** (peut être vide)

---

## 3. Accéder à ma base

### Étape 1 — Démarrer les conteneurs

```bash
docker compose up -d
```

### Étape 2 — Se connecter avec psql

```bash
docker compose exec postgres psql -U postgres -d sensolidaire
```

| Morceau | Rôle |
|---|---|
| `docker compose exec` | exécute une commande dans un conteneur |
| `postgres` | le service base de données (conteneur `sensolidaire_db`) |
| `psql` | le client PostgreSQL en ligne de commande |
| `-U postgres` | l'utilisateur |
| `-d sensolidaire` | la base |

### Étape 3 — Quitter

```
\q
```

💡 Pourquoi psql et pas Prisma Studio ? Prisma Studio ne fonctionne pas sous Docker avec Prisma v7.

---

## 4. Commandes psql vs SQL

⚠️ **Ne pas confondre** :

- Commandes **psql** → commencent par `\`, pas de `;`, propres à PostgreSQL
- Requêtes **SQL** → langage standard, finissent par `;`

### Commandes psql utiles

| Commande | Rôle |
|---|---|
| `\l` | liste les bases |
| `\dt` | liste les tables |
| `\d "Mission"` | structure d'une table (colonnes, types, clés) |
| `\du` | liste les rôles (utilisateurs) |
| `\x` | affichage vertical (tables larges) |
| `\q` | quitter |

### ⚠️ Les guillemets doubles

Prisma crée des tables avec une majuscule → il faut écrire `"Mission"`.

- ✅ `SELECT * FROM "Mission";`
- ❌ `SELECT * FROM Mission;` → PostgreSQL cherche `mission` en minuscules et ne trouve rien

---

## 5. Le CRUD en SQL

| Action | Mot-clé SQL | Verbe HTTP équivalent |
|---|---|---|
| **C**reate | `INSERT` | POST |
| **R**ead | `SELECT` | GET |
| **U**pdate | `UPDATE` | PUT / PATCH |
| **D**elete | `DELETE` | DELETE |

### Read — lire

```sql
-- Tout lire
SELECT * FROM "Mission";

-- Certaines colonnes, avec un filtre
SELECT title, slug FROM "Mission" WHERE is_active = true;

-- Trier et limiter
SELECT title FROM "Mission" ORDER BY created_at DESC LIMIT 5;

-- Compter
SELECT COUNT(*) FROM "Testimonial";
```

### Create — ajouter

```sql
INSERT INTO "MissionPricing" (mission_id, duration_label, price, display_order)
VALUES (1, '2 semaines', 950.00, 1);
```

### Update — modifier

```sql
UPDATE "Mission" SET is_active = false WHERE id = 3;
```

### Delete — supprimer

```sql
DELETE FROM "MissionPricing" WHERE id = 7;
```

### ⚠️ Le piège le plus dangereux

Un `UPDATE` ou un `DELETE` **sans `WHERE`** modifie ou supprime **toutes les lignes**.

✅ **Réflexe pro** :
1. Faire un `SELECT` avec le même `WHERE`
2. Vérifier les lignes affichées
3. Seulement ensuite, lancer `UPDATE` ou `DELETE`

---

## 6. Les mots-clés à connaître

| Mot-clé | Rôle |
|---|---|
| `WHERE` | filtrer les lignes |
| `AND` / `OR` | combiner des conditions |
| `ORDER BY ... ASC/DESC` | trier (croissant / décroissant) |
| `LIMIT` | limiter le nombre de résultats |
| `COUNT(*)` | compter |
| `GROUP BY` | regrouper pour compter/calculer par groupe |
| `JOIN ... ON` | relier deux tables |
| `IS NULL` / `IS NOT NULL` | tester une valeur vide |

⚠️ Pour tester le vide : `WHERE mission_id IS NULL` (et **pas** `= NULL`).

---

## 7. La jointure (JOIN)

Elle sert à **combiner deux tables grâce à la clé étrangère**.

```sql
SELECT m.title, COUNT(t.id) AS nb_temoignages
FROM "Mission" m
LEFT JOIN "Testimonial" t ON t.mission_id = m.id
GROUP BY m.title;
```

### Lecture ligne par ligne

- `FROM "Mission" m` → je pars des missions (`m` = alias, un surnom court)
- `LEFT JOIN "Testimonial" t` → j'y associe les témoignages
- `ON t.mission_id = m.id` → la condition de liaison (FK = PK)
- `GROUP BY m.title` → un résultat par mission
- `COUNT(t.id)` → le nombre de témoignages par mission

### INNER JOIN vs LEFT JOIN

| Type | Résultat |
|---|---|
| `INNER JOIN` (ou `JOIN`) | seulement les lignes qui ont une correspondance |
| `LEFT JOIN` | toutes les lignes de la table de gauche, même sans correspondance |

💡 Ici `LEFT JOIN` garde les missions qui n'ont **aucun** témoignage (avec 0).

---

## 8. SQL dans mon projet

### Prisma (ORM)

- J'écris du **JavaScript**, Prisma génère le **SQL**
- Le schéma est défini dans `schema.prisma`
- Avantages : typage, migrations versionnées, protection contre l'injection SQL

### Les migrations

- Chaque modification du schéma crée un fichier `.sql` dans `prisma/migrations`
- Elles sont **versionnées avec Git** → l'historique de la base est traçable
- Commande dans Docker :

```bash
docker exec sensolidaire_backend npx prisma migrate deploy
```

### La sécurité

| Mesure | Explication |
|---|---|
| **Requêtes paramétrées** | Prisma n'insère jamais directement les données utilisateur dans le SQL → protège de l'injection SQL |
| **Deux comptes PostgreSQL** | `sensolidaire_owner` pour les migrations (structure), `sensolidaire_app` pour l'API (données uniquement) |
| **Moindre privilège** | Si l'API est compromise, l'attaquant ne peut pas modifier la structure des tables |
| **Mots de passe** | Dans le `.env`, jamais dans le code ni sur GitHub |

### La sauvegarde

```bash
docker compose exec -T postgres pg_dump -U sensolidaire_owner -d sensolidaire > backups/sauvegarde.sql
```

- `pg_dump` → exporte la base dans un fichier `.sql`
- `-T` → obligatoire quand on redirige vers un fichier (sinon le dump est corrompu)
- La restauration a été **testée** dans une base dédiée, pas sur la base de travail
- Le volume Docker **n'est pas** une sauvegarde (même machine, pas d'historique)

---

## 9. Questions probables du jury

**Comment accédez-vous à votre base ?**
→ Avec `psql`, dans le conteneur Docker PostgreSQL.

**Différence entre `\dt` et `SELECT` ?**
→ `\dt` est une commande psql, `SELECT` est une requête SQL standard.

**Qu'est-ce qu'une clé étrangère ?**
→ Une colonne qui fait référence à la clé primaire d'une autre table, pour créer une relation.

**Où se trouve la clé étrangère entre Mission et Testimonial ?**
→ Dans `Testimonial` (`mission_id`), du côté « plusieurs ».

**Pourquoi Prisma plutôt que du SQL brut ?**
→ Typage, migrations versionnées, requêtes paramétrées contre l'injection SQL.

**Qu'est-ce qu'une injection SQL ?**
→ Une attaque où l'utilisateur glisse du code SQL dans un champ pour manipuler la base. Les requêtes paramétrées l'empêchent.

**Pourquoi deux utilisateurs PostgreSQL ?**
→ Principe du moindre privilège : l'API ne peut que lire/écrire des données, pas modifier la structure.

**Comment sauvegardez-vous la base ?**
→ Avec `pg_dump`, et j'ai testé la restauration dans une base de test.

---

## 10. Mémo express

```bash
# Accès
docker compose up -d
docker compose exec postgres psql -U postgres -d sensolidaire
```

```
\dt              → lister les tables
\d "Mission"     → voir la structure
\x               → affichage vertical
\q               → quitter
```

```sql
SELECT * FROM "Mission" WHERE id = 1;
INSERT INTO "Table" (col1, col2) VALUES (val1, val2);
UPDATE "Table" SET col = valeur WHERE id = 1;
DELETE FROM "Table" WHERE id = 1;
```

### Les 3 pièges à ne jamais oublier

1. **Guillemets doubles** autour des noms de tables Prisma
2. **Toujours un `WHERE`** sur `UPDATE` et `DELETE`
3. **`IS NULL`** et pas `= NULL`