
# Journal de veille — Sens Solidaires

**Auteure :** Alison Amblard
**Projet :** Refonte du site de l'association Sens Solidaires
**Périmètre de veille :** sécurité applicative web, sécurité des bases de données, sécurité du déploiement, évolutions des technologies utilisées.

> **Note de transparence.** Ce journal a été formalisé le 24 août 2026. Les entrées antérieures à cette date sont **reconstruites à partir de traces datées existantes** — journal de bord (`docs/JDB.md`), historique Git, sorties de `npm audit` — et signalées par la mention *(reconstruit)*. Les entrées postérieures sont consignées au fil de l'eau.

---

## Pourquoi ce journal

Le référentiel du titre exige un système de veille à trois compétences distinctes :

- **CP1** — « le système de veille permet de suivre les évolutions technologiques et les problématiques de sécurité en lien avec l'installation et la configuration d'un environnement de travail » ;
- **CP6** — « … en lien avec les bases de données SQL et NoSQL » ;
- **CP8** — « … en lien avec le déploiement d'une application dynamique web ou web mobile, y compris dans le cadre d'une démarche DevOps ».

Il exige aussi, dans le dossier de projet, « la description de la veille effectuée par le candidat durant le projet, sur les vulnérabilités de sécurité, description des vulnérabilités éventuellement trouvées et des failles potentiellement corrigées ».

Ce fichier est la trace de cette veille.

---

## Mes sources

| Source                                                                           | Ce que j'y suis                                               | Fréquence                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| **CERT-FR** — cert.ssi.gouv.fr                                            | Avis et alertes sur Node.js, PostgreSQL, les navigateurs      | hebdomadaire                  |
| **ANSSI** — guide de recommandations pour la mise en œuvre d'un site web | Bonnes pratiques de référence, citées par le référentiel | ponctuel                      |
| **OWASP Top 10** — owasp.org/Top10                                        | Catégories de vulnérabilités applicatives                  | ponctuel, par thème          |
| **`npm audit`** (frontend et backend)                                    | Vulnérabilités des dépendances du projet                   | avant chaque merge sur`dev` |
| **GitHub Security Advisories**                                             | Alertes sur les paquets que j'utilise                         | notifications                 |
| **CNIL** — guides du développeur                                         | Conformité RGPD                                              | ponctuel                      |
| **Changelogs** Prisma, Express, React, Vite                                | Ruptures de compatibilité et correctifs de sécurité        | à chaque montée de version  |

---

## Entrées

### Modèle à recopier

```
## JJ/MM/AAAA — Titre court
**Source :** …
**Ce que j'en retiens :** …
**Impact sur le projet :** …
**Action :** … (ou « aucune »)
```

---

### ⚠️ À COMPLÉTER — entrées reconstruites

> Les cinq entrées ci-dessous correspondent à des décisions et incidents **réellement documentés** dans `docs/JDB.md`. Retrouve la date de chacun (JDB ou `git log`) et remplace les crochets. **Ne mets pas de date que tu ne peux pas justifier** — si tu ne la retrouves pas, écris « courant juin 2026 » plutôt qu'une date précise inventée.

## [JJ/MM/2026] — Secrets exposés dans l'historique Git *(reconstruit)*

**Source :** incident sur notre propre dépôt.
**Ce que j'en retiens :** un fichier `.env` avait été suivi par Git avant l'ajout au `.gitignore`. Ajouter un fichier au `.gitignore` ne le retire pas du suivi ni de l'historique — `.gitignore` n'est pas rétroactif. Une clé poussée sur un dépôt public doit être considérée comme compromise, même si le fichier est retiré ensuite.
**Impact sur le projet :** clés d'API exposées publiquement.
**Action :** révocation immédiate de la clé, `git rm --cached` du fichier, versionnement d'un `.env.example` vide. Purge de l'historique à prévoir avant la mise en production.

## [JJ/MM/2026] — Stockage des jetons d'authentification *(reconstruit)*

**Source :** [à compléter — OWASP ? article ? documentation ?]
**Ce que j'en retiens :** un jeton stocké dans le `localStorage` est lisible par tout script s'exécutant sur la page, donc exposé en cas de faille XSS. Un cookie `HttpOnly` n'est pas accessible en JavaScript et réduit cette surface.
**Impact sur le projet :** choix d'architecture de l'authentification admin.
**Action :** mise en place d'un système à deux jetons — access token de courte durée transmis dans l'en-tête `Authorization`, refresh token de longue durée en cookie `HttpOnly`, haché en base et roté à chaque requête.

## [JJ/MM/2026] — Énumération d'utilisateurs sur le formulaire de connexion *(reconstruit)*

**Source :** [à compléter]
**Ce que j'en retiens :** distinguer « email inconnu » de « mot de passe incorrect » permet à un attaquant de découvrir quels comptes existent. Le message doit être identique dans les deux cas.
**Impact sur le projet :** route `POST /api/auth/login`.
**Action :** message d'erreur unique côté serveur, quelle que soit la cause de l'échec.

## [JJ/MM/2026] — Injection par le corps de requête sur la modération *(reconstruit)*

**Source :** [à compléter]
**Ce que j'en retiens :** laisser le client transmettre une valeur de statut dans `req.body` revient à lui laisser choisir l'état de la ressource. Une liste blanche est plus sûre qu'une liste noire : on n'énumère pas ce qui est interdit, on n'autorise que ce qui est prévu.
**Impact sur le projet :** modération des témoignages.
**Action :** deux routes distinctes, `/approve` et `/reject`. Le serveur ne lit jamais `req.body.status`.

## [JJ/MM/2026] — `npm audit` sur les deux applications *(reconstruit)*

**Source :** `npm audit` (frontend et backend).
**Ce que j'en retiens :** aucune vulnérabilité connue à cette date.
**Impact sur le projet :** aucun.
**Action :** intégrer `npm audit` au réflexe d'avant-merge sur `dev`.

---

### Entrées à partir du 24 août 2026

## 24/08/2026 — Contrôle d'accès insuffisant sur les routes admin

**Source :** OWASP Top 10 — A01:2021 *Broken Access Control*.
**Ce que j'en retiens :** authentifier n'est pas autoriser. Vérifier qu'un jeton est valide ne dit rien sur ce que son porteur a le droit de faire. La catégorie A01 est la plus fréquente du classement OWASP.
**Impact sur le projet :** notre `authMiddleware` vérifie la validité du JWT mais ne contrôle pas `role === 'admin'`. Tout utilisateur authentifié peut donc appeler les routes de CRUD admin. C'est exactement A01.
**Action :** ajouter la vérification du rôle et renvoyer **403** (et non 401 : le porteur est authentifié, il n'est pas autorisé). Écrire un test qui attend un 403 pour un utilisateur non-admin.

## 24/08/2026 — [ta deuxième entrée du jour]

**Source :**
**Ce que j'en retiens :**
**Impact sur le projet :**
**Action :**

---

## Synthèse pour le dossier

*(à remplir en fin de projet — c'est ce paragraphe qui ira dans le chapitre « veille » du dossier)*

**Vulnérabilités trouvées dans le projet :**

1. Secrets suivis par Git sur un dépôt public → révoqués, fichier retiré du suivi, purge d'historique [statut].
2. Contrôle d'accès par rôle absent sur les routes admin (OWASP A01) → [statut].
3. Jeton d'accès en `localStorage` → mitigé par le passage du refresh token en cookie `HttpOnly` ; le durcissement complet de l'access token reste une dette assumée.

**Failles corrigées :** [à compléter]

**Ce que la veille a changé dans l'architecture :** l'authentification à deux jetons, la liste blanche de routes pour la modération, et l'uniformisation des messages d'erreur ne sont pas des ajouts tardifs — ce sont des décisions prises pendant la conception, à partir de sources identifiées.
