-- backend/prisma/roles.sql
-- ============================================================
-- Séparation des droits PostgreSQL — principe du moindre privilège
-- ------------------------------------------------------------
-- Deux comptes :
--   - sensolidaire_owner : propriétaire du schéma, sert UNIQUEMENT aux
--     migrations Prisma (prisma migrate deploy/dev). Il a tous les droits
--     de structure (CREATE TABLE, ALTER TABLE...).
--   - sensolidaire_app   : compte utilisé par l'API au runtime. Il ne peut
--     que lire/écrire des LIGNES (SELECT/INSERT/UPDATE/DELETE) — aucun
--     droit de structure. Si l'API est compromise (injection, RCE...),
--     l'attaquant ne peut pas modifier le schéma ni le corrompre.
--
-- ⚠️ À exécuter UNE SEULE FOIS, APRÈS avoir appliqué les migrations Prisma
-- (les GRANT sur ALL TABLES ne s'appliquent qu'aux tables déjà existantes
-- au moment de l'exécution — voir les ALTER DEFAULT PRIVILEGES en bas de
-- fichier pour que les tables des migrations FUTURES héritent aussi de ces
-- droits) :
--
--   docker compose exec -T postgres psql -U postgres -d sensolidaire \
--     -v owner_password='MOT_DE_PASSE_OWNER' -v app_password='MOT_DE_PASSE_APP' \
--     < backend/prisma/roles.sql
--
-- Les mots de passe sont injectés à l'exécution via -v, jamais écrits en
-- dur dans ce fichier — aucun secret ne doit être versionné dans Git.
-- ============================================================

-- ── Création des deux rôles ──────────────────────────────────
-- Mots de passe en placeholders : à remplacer avant exécution, cohérents
-- avec ceux déclarés dans docker-compose.yml (DATABASE_URL / MIGRATE_DATABASE_URL).
CREATE ROLE sensolidaire_owner WITH LOGIN PASSWORD :'owner_password';
CREATE ROLE sensolidaire_app   WITH LOGIN PASSWORD :'app_password';

-- ── sensolidaire_owner : propriétaire du schéma ──────────────
-- Jusqu'ici, "postgres" (le superuser) possédait tout : le schéma et
-- toutes les tables déjà créées par les migrations. On transfère cette
-- propriété au compte dédié aux migrations, pour que "postgres" n'ait
-- plus besoin d'être utilisé au quotidien.
ALTER SCHEMA public OWNER TO sensolidaire_owner;

-- REASSIGN OWNED BY postgres échoue ici avec "cannot reassign ownership of
-- objects owned by role postgres because they are required by the database
-- system" : "postgres" est le superuser, et certains objets système lui
-- appartiennent nécessairement. On ne peut donc pas lui retirer TOUTE sa
-- propriété d'un coup — on cible explicitement nos propres tables/séquences
-- dans le schéma public, sans toucher au reste.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I OWNER TO sensolidaire_owner', r.tablename);
  END LOOP;
  FOR r IN SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER SEQUENCE public.%I OWNER TO sensolidaire_owner', r.sequencename);
  END LOOP;
END $$;

GRANT CONNECT ON DATABASE sensolidaire TO sensolidaire_owner;

-- ── sensolidaire_app : compte applicatif (API) ───────────────
GRANT CONNECT ON DATABASE sensolidaire TO sensolidaire_app;
GRANT USAGE ON SCHEMA public TO sensolidaire_app;

-- Droits sur les LIGNES uniquement, sur les tables déjà créées par les
-- migrations Prisma appliquées jusqu'ici.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sensolidaire_app;

-- Indispensable : sans ça, tous les INSERT échouent, car chaque id
-- auto-incrémenté (SERIAL / IDENTITY) consomme une séquence PostgreSQL
-- séparée de la table, avec ses propres droits.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sensolidaire_app;

-- ── Droits par défaut pour les FUTURES migrations ────────────
-- Sans ces deux blocs, une table créée par une migration ultérieure
-- (exécutée par sensolidaire_owner) ne serait accessible à personne
-- d'autre que son propriétaire — l'API perdrait l'accès à chaque nouvelle
-- table tant qu'on ne relance pas ce script à la main.
ALTER DEFAULT PRIVILEGES FOR ROLE sensolidaire_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sensolidaire_app;

ALTER DEFAULT PRIVILEGES FOR ROLE sensolidaire_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO sensolidaire_app;
