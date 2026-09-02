# Sauvegarde et restauration de la base de données

Ce document répond au critère 5.7 du référentiel : il ne suffit pas qu'un dump
existe quelque part, il faut prouver que la base **peut être restaurée**. La
procédure ci-dessous a été exécutée au moins une fois de bout en bout (voir
le tableau de résultats en fin de document).

## Contexte technique

- SGBD : PostgreSQL 16 (image `postgres:16-alpine`)
- Service Docker : `postgres` (conteneur `sensolidaire_db`)
- Base : `sensolidaire`
- Compte utilisé pour dump/restore : `sensolidaire_owner` — c'est le
  propriétaire du schéma (voir [`prisma/roles.sql`](../backend/prisma/roles.sql)),
  le seul compte qui a le droit de recréer des tables. Le compte applicatif
  `sensolidaire_app` n'a que des droits sur les lignes et ne peut pas servir
  à une restauration.

### Pourquoi le volume Docker `postgres_data` n'est PAS une sauvegarde

`docker-compose.yml` déclare un volume nommé `postgres_data` monté sur
`/var/lib/postgresql/data`, qui permet aux données de survivre à un
`docker compose down` / redémarrage du conteneur. Ce n'est pas une
sauvegarde pour trois raisons :

1. **Un seul point de défaillance.** Le volume vit sur la même machine que le
   conteneur. Un disque qui lâche, un `docker volume rm` accidentel, ou une
   corruption du fichier de données emportent le volume ET ce qu'on croyait
   être sa "sauvegarde" en même temps.
2. **Aucun historique.** Le volume reflète l'état *actuel* de la base. Il n'y
   a pas de point de restauration antérieur à une erreur (`DELETE` sans
   `WHERE`, migration qui tourne mal) — le volume contient déjà les dégâts.
3. **Pas portable.** Un volume Docker ne se copie pas facilement vers un
   autre environnement (poste d'un autre développeur, nouvelle machine de
   déploiement) contrairement à un fichier `.sql` autonome.

Un vrai backup est un fichier séparé, horodaté, stocké ailleurs que sur la
machine qui héberge la base.

## Sauvegarde — `pg_dump`

```bash
docker compose exec -T postgres pg_dump -U sensolidaire_owner -d sensolidaire \
  > backups/sensolidaire_$(date +%Y%m%d_%H%M%S).sql
```

⚠️ Le `-T` est obligatoire — voir la section "Pièges rencontrés" plus bas.

### Fréquences prévues

| Environnement | Fréquence | Rétention |
|---|---|---|
| Développement (local) | Avant toute migration risquée (colonne `NOT NULL` sans défaut, suppression de colonne) | Dernier dump uniquement, supprimé une fois la migration validée |
| Production (à la mise en ligne) | Quotidienne, automatisée (cron) | 7 jours glissants + 1 dump mensuel conservé 6 mois |

## Restauration — dans une base de test dédiée

La restauration ne se fait **jamais** directement sur `sensolidaire` : on
restaure d'abord dans une base jetable, on vérifie que les données sont
cohérentes, et c'est seulement après validation qu'on migrerait vers la base
de travail (hors procédure de test — pas fait dans ce document).

```bash
# 1. Créer une base de test dédiée, distincte de la base de travail
docker compose exec -T postgres psql -U sensolidaire_owner -d postgres \
  -c "CREATE DATABASE sensolidaire_restore_test;"

# 2. Restaurer le dump dans cette base de test
docker compose exec -T postgres psql -U sensolidaire_owner -d sensolidaire_restore_test \
  < backups/sensolidaire_20260826_143000.sql

# 3. Comparer les COUNT(*) avec la base d'origine, table par table
docker compose exec -T postgres psql -U sensolidaire_owner -d sensolidaire \
  -c "SELECT 'Mission' AS table, COUNT(*) FROM \"Mission\"
      UNION ALL SELECT 'Testimonial', COUNT(*) FROM \"Testimonial\"
      UNION ALL SELECT 'Admin', COUNT(*) FROM \"Admin\";"

docker compose exec -T postgres psql -U sensolidaire_owner -d sensolidaire_restore_test \
  -c "SELECT 'Mission' AS table, COUNT(*) FROM \"Mission\"
      UNION ALL SELECT 'Testimonial', COUNT(*) FROM \"Testimonial\"
      UNION ALL SELECT 'Admin', COUNT(*) FROM \"Admin\";"

# 4. Une fois la comparaison validée, supprimer la base de test
docker compose exec -T postgres psql -U sensolidaire_owner -d postgres \
  -c "DROP DATABASE sensolidaire_restore_test;"
```

### Tableau de résultats (à remplir à chaque exercice de restauration)

| | Base d'origine | Base restaurée |
|---|---|---|
| `Mission` | 15 | 15 |
| `Testimonial` | 12 | 12 |
| `Admin` | 1 | 1 |

- **Date du test :** 26 août 2026
- **Sauvegarde utilisée :** `backups/sensolidaire_2026-08-26-1244.sql` (111 Ko)
- **Base de restauration :** `sensolidaire_restore_test`, créée vide puis supprimée après vérification
- **Conclusion :** restauration vérifiée, aucune perte de données. Les trois tables
  présentent des effectifs identiques avant et après restauration.

> Capture d'écran : `annexes/annexe-05-sauvegarde-restauration.png`

**Note :** les sauvegardes ne sont pas versionnées (`backups/` est dans le `.gitignore`) :
un dump contient les données personnelles des témoignages et n'a pas sa place sur un
dépôt public.

## Pièges rencontrés

- **Le `-T` de `docker compose exec` est obligatoire dès qu'on redirige un
  flux** (`> fichier.sql` ou `< fichier.sql`). Sans `-T`, Docker alloue un
  pseudo-TTY par défaut, qui insère des caractères de contrôle dans le flux
  — le dump produit est corrompu et `psql` refuse de le relire ensuite.
- **La restauration exige le compte propriétaire (`sensolidaire_owner`), pas
  le compte applicatif (`sensolidaire_app`).** Une tentative avec
  `sensolidaire_app` échoue avec `permission denied for schema public`, car
  ce compte n'a aucun droit de structure (`CREATE TABLE`...). C'est
  attendu : ça confirme que la séparation des droits mise en place à la
  phase 6 (voir [`prisma/roles.sql`](../backend/prisma/roles.sql)) fonctionne
  réellement, et pas seulement sur le papier.
