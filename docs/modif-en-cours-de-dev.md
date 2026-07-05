# Modifications apportées en cours de développement
## Sens Solidaire — Refonte du site web
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Dernière mise à jour : 5 juillet 2026*

Ce document trace toutes les décisions qui s'écartent des guides initiaux.
Il sera mis à jour en continu et servira à actualiser la documentation officielle en fin de projet.

**Légende** : ✅ Appliquée · ⏳ En attente · 📋 À documenter

---

## Tableau des modifications

| N° | Date | Document | Modification | Raison | Statut |
|---|---|---|---|---|---|
| 01 | 30/05/26 | Guide 2 — Navbar (§2.4.1) | Remplacement de 'Actions éducatives' par 'Notre impact ▾' avec deux sous-pages : Actions sur le terrain / Éducation & sensibilisation | Meilleure architecture UX — sépare conversion et preuve d'impact. Réduit la charge cognitive (6 liens au lieu de 7) | 📋 À documenter |
| 02 | 30/05/26 | Guide 2 — Pages (§2.2) | Page 'Notre impact' ajoutée comme page parente regroupant Actions sur le terrain / Éducation & sensibilisation | Cohérence avec la modification navbar — création d'un niveau de navigation intermédiaire | 📋 À documenter |
| 03 | 30/05/26 | Tous les guides — Navbar | Libellés navbar finalisés : Accueil (🏠) · Missions ▾ · À propos ▾ · Notre impact ▾ · Médias & actualités · Contact · FR · Faire un don | Décision UX finale après réflexion sur les profils utilisateurs (bénévoles, donateurs, enseignants, RSE) | 📋 À documenter |
| 04 | 30/05/26 | Palette — Guide de style | #1E4D2B remplacé par #143601 partout dans la palette | Contraste WCAG AAA — ratio 12.48:1 | ✅ Appliquée |
| 05 | 30/05/26 | Composants — Boutons | Suppression de Button/Dark et Button/Ghost | Redondants avec les nouveaux boutons | 📋 À documenter |
| 06 | 30/05/26 | Button/Primary | Fond #A44A2F (terracotta) au lieu du vert | Meilleure différenciation visuelle des CTA | 📋 À documenter |
| 07 | 30/05/26 | Button/Secondary | Fond #143601 vert foncé | Cohérence avec la palette mise à jour | 📋 À documenter |
| 08 | 30/05/26 | Règle palette | #2F8A3A = accents uniquement / #143601 = fonds et boutons | Accessibilité — ratio insuffisant sur boutons avec #2F8A3A en fond | 📋 À documenter |
| 09 | 02/06/26 | Navbar — Hero | Gradient noir 70%→0% ajouté en haut du Hero | Lisibilité des liens navbar sur image immersive | 📋 À documenter |
| 10 | 02/06/26 | Logo navbar | Cercle blanc 40% opacité derrière le logo. Version blanche du logo à demander à la cliente | Logo illisible sur Hero immersif — navbar transparente | 📋 À documenter |
| 11 | 02/06/26 | Composants — ODD | Icônes ODD officielles ONU remplacées par badges carrés colorés numérotés | Icônes ONU trop chargées et peu lisibles en petit format | 📋 À documenter |
| 12 | 04/06/26 | Composant — ActionCard | Nouveau layout horizontal (image gauche + contenu droite) au lieu d'image immersive plein fond | Plus lisible, plus flexible, meilleure gestion des dimensions | 📋 À documenter |
| 13 | 04/06/26 | Composant — Tag | 2 variants : light (fond #E8DFD1, texte #143601) + dark (sans fond, texte blanc italique) | Adaptation aux deux contextes : fond clair et fond sombre | 📋 À documenter |
| 14 | 04/06/26 | Navbar — structure finale | Retour à l'option initiale : 'Notre impact' = lien direct + 'Actions éducatives' = lien direct. Abandon du dropdown 'Notre impact'. | Meilleure visibilité pour les enseignants + navigation plus directe | 📋 À documenter |
| 15 | Mai 2026 | Pages — /lieux/:slug | Ajout de la page Lieu (LocationDetail.jsx) : hero, lien retour vers /missions/:slug, description, galerie Carousel | Besoin de zoom sur un lieu partenaire spécifique. Aucun nouveau composant réutilisable nécessaire. | 📋 À documenter |
| 16 | Mai 2026 | Pages — /equipe | Ajout de la page Équipe avec 3 composants séparés dans /components/team/ (option B). Sélection du composant selon le champ category retourné par l'API. | 3 catégories visuellement distinctes nécessitent 3 composants dédiés | 📋 À documenter |
| 17 | Mai 2026 | Composant — TeamMemberCardLarge.jsx | Grande carte rectangulaire pour direction/bureau. Champs : nom/prénom, poste, citation courte (optionnel), icône mail (optionnel). Photo par défaut si absente. | Membres de direction — besoin d'une présentation valorisante avec citation et contact | 📋 À documenter |
| 18 | Mai 2026 | Composant — TeamMemberCardSmall.jsx | Petite carte compacte avec avatar circle pour conseil/equipe_operationnelle. Champs : nom/prénom, poste (une ligne). Avatar neutre par défaut. | Catégories secondaires — affichage compact pour listes potentiellement longues | 📋 À documenter |
| 19 | Mai 2026 | Composant — DelegationCard.jsx | Carte immersive pleine largeur (style MissionCard) pour les délégations. Badge drapeau Unicode ISO 3166-1 alpha-2. Titre + liste membres sur la carte. Pas de bouton. | Délégations = identité géographique forte. Badge drapeau via emoji Unicode — aucune dépendance externe. | 📋 À documenter |
| 20 | 08/06/26 | Tailwind config | Tailwind v4 : pas de tailwind.config.js — configuration via `@theme` dans index.css. Noms sémantiques par rôle : `primary`, `accent`, `accent-green`, `surface`, `surface-mid`, `surface-dark`, `font-heading`, `font-body` | Tailwind v4 installé via @tailwindcss/vite — nouvelle syntaxe de configuration | ✅ Appliquée |
| 21 | 08/06/26 | Button | `px-7` → `px-5` — padding horizontal réduit | Bouton trop large visuellement | 📋 À documenter |
| 22 | 08/06/26 | StatsBar | Fond `surface-mid` remplacé par `primary` (#143601) — chiffres et labels en `surface` | Meilleure séparation visuelle avec les sections adjacentes | 📋 À documenter |
| 23 | 08/06/26 | Navbar | Fond `bg-transparent` — suppression du `bg-primary` temporaire utilisé pendant les tests | Navbar transparente sur le Hero comme prévu dans le Figma | 📋 À documenter |
| 24 | 08/06/26 | Navbar | Icône maison (FaHome) à la place du texte "Accueil" | Cohérence avec le Figma |  📋 À documenter |
| 25 | 08/06/26 | Navbar | Chevrons FaChevronDown ajoutés sur Nos missions, À propos et FR | Indication visuelle des dropdowns — cohérence Figma | 📋 À documenter |
| 26 | 08/06/26 | Button | `uppercase tracking-wider` ajoutés — texte en majuscules | Cohérence avec le Figma | 📋 À documenter |
| 27 | 09/06/26 | Section Partenaires — Home | Fond changé de `surface` (beige) à `primary` (vert foncé) + texte `surface` | Meilleure alternance visuelle des sections — cohérence vert/beige sur la page Accueil | ✅ Appliquée |
| 28 | 10/06/26 | BDD — schema.prisma | `short_description` passé NOT NULL, `description` passé nullable (`String?`) | Cards missions nécessitent toujours une accroche courte — la description longue est réservée à la page détail | ✅ Appliquée |
| 29 | 10/06/26 | BDD — schema.prisma | Ajout champ `type` avec valeur `service_civique` — 2 nouvelles missions seed (service-civique-kenya, service-civique-senegal) | Section service civique sur page /missions avec destinations dynamiques depuis la BDD | ✅ Appliquée |
| 30 | 10/06/26 | Composant — MissionCard.jsx | Ajout props optionnelles `ctaLabel` et `ctaUrl` — permet de personnaliser le bouton CTA selon le contexte (lien externe service civique) | Les missions service civique ne mènent pas vers une page détail interne mais vers le site officiel | ✅ Appliquée |
| 31 | 10/06/26 | utils/missions.js | Création fichier utilitaires partagés : `COUNTRY_IMAGES`, `getDuration`, `TYPE_LABELS` | Évite les doublons entre Home.jsx et Missions.jsx | ✅ Appliquée |
| 32 | 10/06/26 | index.css | Ajout utilities Tailwind v4 : `section-padding`, `section-header`, `section-title`, `section-subtitle` | Uniformisation des espacements et styles de section sur tout le site | ✅ Appliquée |
| 33 | 12/06/26 | TestimonialCard | Hauteur fixe h-[270px] — témoignages limités à 280 caractères (maxLength={280} à ajouter sur textarea du formulaire) | Cohérence visuelle carousel | ✅ Appliquée |
| 34 | 12/06/26 | missionService.js | Formatage témoignages : content → quote, author_name → name, mission.title → mission | Cohérence props TestimonialCard | ✅ Appliquée |
| 35 | 12/06/26 | Composant — LocationCard.jsx | Nouveau composant dans /components/locations/ — card lieu réutilisable sur MissionDetail et Missions | Évite la duplication de code | ✅ Appliquée |
| 36 | 12/06/26 | Composant — FilterChips.jsx | Nouveau composant dans /components/navigation/ — props : filters, active, onChange, variant (light/dark) | Réutilisable sur toutes les pages avec filtres | ✅ Appliquée |
| 37 | 12/06/26 | Composant — AnchorNav.jsx | Nouveau composant dans /components/navigation/ — props : sections, variant (light/dark) | Réutilisable sur pages longues : MissionDetail, LocationDetail | ✅ Appliquée |
| 38 | 12/06/26 | BDD — schema.prisma | Ajout champ image_url (String?) sur table Location + migration | Carousel lieux partenaires avec photos | ✅ Appliquée |
| 39 | 12/06/26 | Seed — toutes missions | Pattern xxxData appliqué sur toutes les missions (Sénégal, Pérou, Sri Lanka, Sumatra) — update: xxxData | Re-seed met tout à jour automatiquement | ✅ Appliquée |
| 40 | 12/06/26 | Navbar | Dropdown "Nos missions" au survol — liste des 5 destinations | Accès direct aux pages détail mission | ✅ Appliquée |
| 41 | 12/06/26 | Carousel | Navigation conditionnelle — chevrons et dots masqués si items ≤ slidesPerView | Évite les contrôles inutiles sur peu d'items | ✅ Appliquée |
| 42 | 15/06/26 | Feature — Dashboard articles | Créer un modèle Article (title, content WYSIWYG, image_url, published_at, status draft/published) + page publique /medias-et-actualites | V2 | 🔵 À faire |
| 43 | 15/06/26 | Feature — Intégration Buffer | Au moment de la publication d'un article dans le dashboard, appel API Buffer pour créer un brouillon de post automatiquement. Nécessite clé API Buffer de la cliente. | V2 | 🔵 À faire |
| 44 | 12/06/26 | Composant — Carousel.jsx | Module Navigation de Swiper v12 cassé en React → navigation custom via `useRef` + boutons externes appelant `slidePrev()`/`slideNext()` | Bug connu de Swiper v12 avec React — le module officiel ne fonctionne pas correctement | ✅ Appliquée |
| 45 | 12/06/26 | Navigation — scroll | `react-scroll` incompatible React 19 → remplacé par `smoothScrollTo` custom (`window.scrollTo({ behavior: 'smooth' })`) | Incompatibilité de version bloquante | ✅ Appliquée |
| 46 | 15/06/26 | Backend — update mission | Méthode **PATCH** retenue (vs PUT) pour la modification de mission — seuls les champs fournis sont mis à jour | Adapté à un dashboard d'édition champ par champ, pas de risque d'écraser un champ non renvoyé | ✅ Appliquée |
| 47 | 15/06/26 | Backend — delete mission | **Soft delete** (`is_active = false`) retenu au lieu d'une suppression réelle | Réversibilité, traçabilité, évite la gestion en cascade des relations (pricing, location, testimonials) | ✅ Appliquée |
| 48 | 15/06/26 | Backend — delete témoignage | **Hard delete** conservé pour les témoignages, contrairement aux missions (soft delete) | Droit à l'oubli RGPD (article 17) — une donnée personnelle doit pouvoir être effacée réellement | ✅ Appliquée |
| 49 | 15/06/26 | schema.prisma — Mission.type | `VALID_TYPES` remplacés : anciens types périmés (`faune_sauvage`...) → taxonomie réelle (`volontariat_individuel`, `service_civique`, `groupe_jeunes`, `conge_solidaire`) | Alignement avec les types réellement utilisés dans le seed | ✅ Appliquée (provisoire — à valider avec la cliente) |
| 50 | 15/06/26 | missionService.js — findBySlug | `findUnique` → `findFirst` + filtre `is_active: true` | Une mission soft-deletée doit aussi disparaître de la page détail publique, pas seulement de la liste | ✅ Appliquée |
| 51 | 19/06/26 | schema.prisma | Nouvelles tables créées : `ActivityReport`, `Delegation`, `MissionReport`, `TeamMember`, `Partner` | Besoin des pages secondaires (équipe, rapports d'activité, délégations internationales, témoignages enrichis) | ✅ Appliquée |
| 52 | 19/06/26 | Testimonials.jsx | Abandon du système d'onglets → filtre unique `vue` intégré dans `FilterSelect` | Simplification de l'UX — un seul composant de filtre au lieu de deux systèmes parallèles | ✅ Appliquée |
| 53 | 22/06/26 | /public/images/ | Réorganisation complète — 10 dossiers thématiques créés, tous les fichiers renommés en kebab-case et déplacés | Structure par contexte métier plus maintenable, cohérence de nommage | ✅ Appliquée |
| 54 | 29/06 → 03/07/26 | schema.prisma — FieldAction | `FieldActionCountry` (relation FK) remplace l'ancien champ `country: String` sur `FieldAction` | `country: string` était fragile et non filtrable proprement — une action peut désormais concerner plusieurs pays | ✅ Appliquée |
| 55 | 29/06 → 03/07/26 | schema.prisma — Location | FK `delegation_id` ajoutée sur `Location` → `Delegation` | Supprime le string matching fragile (`d.lieu === location.name`), source de bugs par typo | ✅ Appliquée |
| 56 | 29/06 → 03/07/26 | Composant — FooterCta.jsx | Nouveau composant dynamique par route, remplaçant `CTASection` sur toutes les pages | Évite la redondance CTASection + FooterCta — un seul point de vérité pour les CTAs de fin de page | ✅ Appliquée |
| 57 | 03/07/26 | Nom du projet | Renommage global "Sens Solidaire" → "Sens Solidaires" — 23 occurrences corrigées (grep + sed) | Nom officiel exact de l'association | ✅ Appliquée |
| 58 | 04/07/26 | Composant — LignesToPuces.jsx | Composant utilitaire créé puis extrait de `MissionDetail.jsx` vers `components/ui/` — transforme un texte multi-lignes (`\n`) en liste à puces | Permet à la cliente de saisir du contenu riche (rôle volontaire, infos santé/admin) sans éditeur WYSIWYG complexe ; extraction nécessaire pour rendre le composant testable unitairement | ✅ Appliquée |
| 59 | 05/07/26 | schema.prisma — MissionReport | Ajout FK optionnelle `mission_id` (+ relation inverse `missionReports[]` sur `Mission`) | `destination`/`type` en texte libre dupliquaient l'information déjà présente sur `Mission` — même anti-pattern déjà corrigé sur `FieldActionCountry`. FK optionnelle car un rapport peut exister sans mission liée (ex : retour d'expérience enseignant) | ✅ Appliquée |

---

## Détail des modifications

### Modification 01 — Navbar : Notre impact ▾

**Avant**
- Navbar contenait un lien direct 'Actions éducatives'
- Structure : Accueil · Missions ▾ · À propos ▾ · Actions éducatives · Médias & Actualités · Contact

**Après**
- 'Actions éducatives' remplacé par 'Notre impact ▾' avec deux sous-pages
- Structure : 🏠 · Missions ▾ · À propos ▾ · Notre impact ▾ · Médias & actualités · Contact · FR · Faire un don
- Sous-menu 'Notre impact ▾' : Actions sur le terrain / Éducation & sensibilisation

**Raison**
- 'Notre impact' répond mieux aux besoins des donateurs et entreprises RSE
- Regroupe logiquement les deux types d'actions sous un même chapeau sémantique
- Réduit la charge cognitive de la navbar (6 liens au lieu de 7)

---

### Modification 14 — Structure finale de la navbar

- Retour à l'option initiale : 'Notre impact' = lien direct ET 'Actions éducatives' = lien direct.
- Abandon du dropdown 'Notre impact' décidé en modification 01.
- Raison : meilleure visibilité pour les enseignants + navigation plus directe.

---

### Modification 15 — /lieux/:slug

Page non maquettée dans les documents initiaux. Zoom sur un lieu partenaire, accessible depuis la page mission parente.

**Structure de la page**
- Hero : titre du lieu, accroche courte, photo immersive pleine largeur.
- Lien retour : bouton « ← Retour à la mission [nom] » vers /missions/:slug.
- Description : présentation du lieu et ce que les volontaires y font concrètement.
- Galerie : photos du lieu via le composant Carousel/galerie existant.

**Nouveau composant — LocationDetail.jsx**
- Chemin : `/frontend/src/pages/LocationDetail.jsx`
- Données : `GET /api/locations/:slug` + `GET /api/media?entity_type=location&entity_id=:id` + `GET /api/missions/:mission_id`
- Note : aucun nouveau composant réutilisable nécessaire.

---

### Modifications 16, 17, 18, 19 — /equipe

Trois composants distincts selon la catégorie du membre. Option B retenue : 3 composants séparés dans `/frontend/src/components/team/`.

**TeamMemberCardLarge.jsx** (direction, bureau)
- Grande carte rectangulaire avec photo (paysage ou portrait).
- Champs : Nom/prénom (obligatoire), Poste (obligatoire), Citation courte (optionnel), Icône mail (optionnel).
- Photo par défaut si absente.

**TeamMemberCardSmall.jsx** (conseil, equipe_operationnelle)
- Petite carte compacte avec photo ronde (avatar circle).
- Champs : Nom/prénom (obligatoire), Poste — une ligne courte (obligatoire).
- Avatar neutre par défaut si photo absente.

**DelegationCard.jsx** (delegations)
- Carte immersive pleine largeur — même style que MissionCard.
- Photo de fond immersive avec overlay sombre.
- Badge drapeau rond en haut à gauche (emoji Unicode généré depuis code ISO 3166-1 alpha-2, ex : KE → 🇰🇪).
- Titre de la délégation + liste des membres affichée directement sur la carte. Pas de bouton.
- Props : title (obligatoire), country (obligatoire), members[] (obligatoire), photo (obligatoire).

---

### Modification 20 — Tailwind v4 : configuration via @theme

**Avant** (attendu)
- Fichier `tailwind.config.js` avec `theme.extend.colors`

**Après** (réel)
- Tailwind v4 installé via `@tailwindcss/vite` — pas de `tailwind.config.js`
- Configuration dans `index.css` via le bloc `@theme`

```css
@theme {
  --color-primary:      #143601;
  --color-accent:       #A44A2F;
  --color-accent-green: #2F8A3A;
  --color-surface:      #F8F6F1;
  --color-surface-mid:  #E8DFD1;
  --color-surface-dark: #D9CBB8;
  --font-heading: 'Lora', serif;
  --font-body:    'Source Sans 3', sans-serif;
}
```

**Usage dans les composants**
```jsx
<div className="bg-primary text-surface font-heading">Titre</div>
<button className="bg-accent text-surface font-body">CTA</button>
```

---

### Modification 44 — Carousel.jsx : navigation Swiper custom

**Problème rencontré**
Le module `Navigation` officiel de Swiper v12 ne fonctionne pas correctement dans un contexte React — les flèches précédent/suivant ne réagissent pas de façon fiable.

**Solution retenue**
- `useRef` pointant vers l'instance Swiper
- Boutons HTML externes (hors du module Swiper) appelant directement `swiperRef.current?.slidePrev()` / `slideNext()`

**Impact**
Solution appliquée uniformément dans le composant `Carousel.jsx` réutilisable — tous les carrousels du site en bénéficient sans dupliquer le contournement.

---

### Modification 46, 47, 48 — Stratégie de suppression : PATCH + soft/hard delete

Trois décisions liées, prises ensemble lors du CRUD admin missions (15/06) :

| Ressource | Méthode update | Méthode delete | Justification |
|---|---|---|---|
| Mission | PATCH (partiel) | Soft delete (`is_active`) | Dashboard d'édition champ par champ + réversibilité |
| Témoignage | — | Hard delete | RGPD article 17 (droit à l'oubli) — donnée personnelle |

Cette distinction est une décision d'architecture à part entière : toutes les ressources ne suivent pas la même politique de suppression, et c'est volontaire.

---

### Modification 58 — LignesToPuces : extraction pour testabilité

**Contexte**
Le composant était initialement défini localement (non exporté) à l'intérieur de `MissionDetail.jsx`.

**Problème**
Un composant non exporté ne peut pas être importé isolément dans un fichier de test — impossible de le tester unitairement sans dépendre de tout `MissionDetail`.

**Solution**
Extraction vers `components/ui/LignesToPuces.jsx`, avec `export default`, puis import dans `MissionDetail.jsx`. Permet un test unitaire dédié (`LignesToPuces.test.jsx`).

---

### Modification 59 — MissionReport : ajout de la relation vers Mission

**Avant**
`MissionReport` utilisait deux champs texte libres (`destination`, `type`) sans lien réel avec la table `Mission`.

**Problème identifié**
Anti-pattern déjà rencontré et corrigé sur `FieldAction` : un champ texte dupliquant une information qui existe déjà ailleurs en base, sans contrainte d'intégrité.

**Solution**
Ajout d'une FK optionnelle `mission_id` (nullable) + relation inverse `missionReports: MissionReport[]` sur `Mission`. Nullable car un rapport peut exister sans mission officiellement fichée en base (ex : retour d'expérience déposé par un enseignant).

**Champs `destination`/`type` conservés** : ils deviennent redondants avec `mission.country`/`mission.type` quand `mission_id` est renseigné, mais servent de repli quand ce n'est pas le cas.