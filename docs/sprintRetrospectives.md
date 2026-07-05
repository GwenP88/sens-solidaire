# Sprint Retrospectives — Sens Solidaires

Rétrospective de chaque sprint : ce qui a bien fonctionné, les difficultés rencontrées, les améliorations retenues pour la suite. Basé sur `docs/JDB.md`.

---

## Sprint 1 — Initialisation

**Ce qui a bien fonctionné**
- Structure monorepo posée dès le départ (frontend/backend/docs) — jamais eu besoin de la retoucher
- Docker Compose fonctionnel rapidement, avec healthcheck PostgreSQL

**Difficultés rencontrées**
- Prisma v7 récemment sorti — syntaxe différente des tutoriels en ligne trouvés (attention aux ressources datées)
- Authentification PostgreSQL à corriger manuellement (mot de passe)

**Améliorations retenues**
- Toujours vérifier la version exacte d'un outil avant de suivre un tutoriel externe
- Documenter les credentials de dev dès leur création (évite de les re-chercher)

---

## Sprint 2 — Fondations frontend + Auth backend

**Ce qui a bien fonctionné**
- Authentification JWT complète et sécurisée dès ce sprint (deux secrets séparés, cookie HTTP-only, refresh token hashé)
- Nommer les calques Figma selon les balises HTML a grandement facilité le passage au code

**Difficultés rencontrées**
- `RUN npx prisma generate` oublié dans le Dockerfile au départ → crash au démarrage

**Améliorations retenues**
- Toujours inclure la génération du client Prisma dans le Dockerfile dès la création du service
- Séparer clairement JWT_SECRET et JWT_REFRESH_SECRET — bonne pratique à garder pour tout futur projet

---

## Sprint 3 — Missions

**Ce qui a bien fonctionné**
- Première connexion front ↔ back réussie avec un flux clair (fetch → API → BDD)

**Difficultés rencontrées**
- Plusieurs bugs de configuration en cascade : `dotenv/config` manquant, erreur CORS (`127.0.0.1` vs `localhost`), route `/missions` oubliée dans `App.jsx`
- Un bug "page blanche" causé par un commentaire JS non fermé — long à diagnostiquer

**Améliorations retenues**
- Réflexe consolidé : devant une erreur obscure, lire les logs Docker en premier plutôt que deviner
- Toujours vérifier localhost vs 127.0.0.1 en cas de CORS bloqué

---

## Sprint 4 — Témoignages + Contact + Pages secondaires

**Ce qui a bien fonctionné**
- CRUD admin missions solide dès la conception : whitelist anti mass-assignment, codes d'erreur métier (`SLUG_TAKEN`, `MISSION_NOT_FOUND`)
- Décision claire et documentée : soft delete pour les missions, hard delete pour les témoignages (RGPD)

**Difficultés rencontrées**
- Migration bloquée (`P3018`) sur un champ passé en NOT NULL sans backfill des données existantes
- Plusieurs erreurs d'import/typo (fonctions non déclarées, exports mal orthographiés)

**Améliorations retenues**
- Toujours prévoir un backfill avant de rendre un champ obligatoire sur une table déjà peuplée
- Vérifier l'orthographe exacte des noms de fonctions entre déclaration et import (piège récurrent)

---

## Sprint 5 — Dashboard + Responsive

**Ce qui a bien fonctionné**
- Harmonisation CSS via des utilities Tailwind personnalisées (gap scale, section-padding) — gain de cohérence visible sur tout le site
- Responsive mobile-first appliqué systématiquement, palier par palier

**Difficultés rencontrées**
- Aucune difficulté bloquante majeure notée ce sprint — sprint plus fluide que les précédents

**Améliorations retenues**
- Les utilities CSS centralisées (créées ce sprint) sont réutilisées sur tous les sprints suivants — confirme l'intérêt de factoriser tôt

---

## Sprint 6 — Sprint final MVP

**Ce qui a bien fonctionné**
- Toutes les pages restantes migrées et le MVP livré dans les temps (3 juillet)
- Refactorisation payante : `FieldActionCountry` remplace un champ texte fragile, `delegation_id` FK supprime un string matching source de bugs
- `FooterCta` dynamique centralise une logique auparavant dupliquée sur chaque page

**Difficultés rencontrées**
- Sprint dense — 5 migrations BDD + refonte de plusieurs pages + renommage global en une seule période
- Renommage "Sens Solidaire" → "Sens Solidaires" sur 23 occurrences — tâche mécanique mais à ne pas oublier de vérifier partout (y compris les commentaires de code)

**Améliorations retenues**
- Un sprint de clôture aussi chargé gagnerait à être scindé en deux la prochaine fois (finitions vs nouvelles fonctionnalités)
- `grep` + `sed` efficaces pour les renommages globaux, mais toujours vérifier le résultat visuellement après coup

---

## Rétrospective générale — Phase 1 (MVP)

**Ce qui a le mieux fonctionné sur l'ensemble de la phase**
- La discipline de documentation quotidienne (JDB) a permis de retracer précisément chaque décision, bug et correctif — indispensable pour cette synthèse elle-même
- Les décisions d'architecture ont été prises consciemment et documentées au moment où elles se posaient (soft delete, JWT à deux tokens, whitelist anti mass-assignment)

**Difficultés récurrentes sur toute la phase**
- Bugs liés à l'environnement Docker (volumes anonymes périmés, node_modules manquants après merge) — revenus plusieurs fois sous des formes différentes
- Prisma v7 étant récent, plusieurs frictions liées à des ressources en ligne datées (syntaxe pré-v7)

**Améliorations pour la Phase 2**
- Documenter systématiquement toute décision d'architecture au moment où elle est prise (pas après coup) — pratique déjà largement respectée, à maintenir
- Ajouter des tests automatisés plus tôt dans le cycle plutôt qu'en fin de MVP (fait rétroactivement lors du Sprint 7)