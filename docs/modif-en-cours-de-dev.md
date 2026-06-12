# Modifications apportées en cours de développement
## Sens Solidaire — Refonte du site web
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Dernière mise à jour : 8 juin 2026*

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
| 33 | 12/06/26 | Composant — TestimonialCard.jsx | Témoignages limités à 280 caractères max (`maxLength={280}` à ajouter sur le textarea du formulaire de soumission). Hauteur fixe de la card : `h-[270px]` | Cohérence visuelle du carousel — card uniforme quelle que soit la longueur du témoignage | ✅ Appliquée |

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