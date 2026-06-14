# Guide de style — Sens Solidaire
## Système de design · Frontend React + Tailwind CSS v4

---

## Palette de couleurs

| Token | Valeur | Usage |
|---|---|---|
| `primary` | `#143601` | Textes, titres, bordures |
| `accent` | `#A44A2F` | Terracotta — boutons primaires, icônes non inclus, bordures programme |
| `accent-2` | `#2F8A3A` | Vert — boutons secondaires, icônes inclus, pourcentages frais |
| `surface` | `#F8F6F1` | Fond clair principal |
| `surface-mid` | `#E8DFD1` | Fond clair secondaire |
| `surface-dark` | `#D9CBB8` | Fond clair tertiaire, bordures subtiles |

---

## Typographie

| Famille | Token | Usage |
|---|---|---|
| Lora | `font-heading` | Titres H1, H2, H3 |
| Source Sans 3 | `font-body` | Corps de texte, labels, légendes |

---

## Hiérarchie typographique

### H1 — Titre hero
```
font-heading font-bold text-surface
(taille définie dans HeroPage)
```

### H2 — Titre de section
```
section-title text-[couleur] mb-4
```
> `section-title` = Lora bold 2.25rem défini dans index.css

### H3 — Sous-titre de bloc
```
font-heading font-bold text-[couleur] text-base mb-2
```

### Paragraphe intro (sous le H2)
```
font-body text-sm text-[couleur]/60 mb-8
```

### Paragraphe subtitle (section-header)
```
font-body text-[couleur]/80
```

### Texte courant
```
font-body text-sm text-[couleur]/80 leading-relaxed
```

### Texte secondaire
```
font-body text-sm text-[couleur]/60
```

### Texte discret / mentions légales
```
font-body text-xs text-[couleur]/40 italic
```

### Label fort (tableau, badge)
```
font-body text-sm font-semibold text-[couleur]
```

---

## Opacités de couleur

### Sur fond clair (`bg-surface`, `bg-surface-mid`, `bg-surface-dark`)

| Niveau | Classe | Usage |
|---|---|---|
| Principal | `text-primary` | Titres, labels forts |
| Courant | `text-primary/80` | Corps de texte |
| Secondaire | `text-primary/60` | Paragraphes intro, textes d'appui |
| Discret | `text-primary/40` | Mentions légales, placeholders, italiques |

### Sur fond foncé (`bg-accent-2`, `bg-primary`)

| Niveau | Classe | Usage |
|---|---|---|
| Principal | `text-surface` | Titres |
| Courant | `text-surface/80` | Corps de texte |
| Secondaire | `text-surface/60` | Paragraphes intro |
| Discret | `text-surface/40` | Mentions, légendes |

---

## Espacements

### Sections
```
section-padding = padding: 4rem 6rem (défini dans index.css)
```

### Espacement interne des sections

| Élément | Classe |
|---|---|
| Après H2 | `mb-4` |
| Après paragraphe intro | `mb-8` |
| Après H3 | `mb-2` |
| Gap entre colonnes | `gap-8` ou `gap-12` |
| Gap entre cards | `gap-6` ou `gap-8` |

---

## Boutons

| Variante | Fond | Texte | Hover |
|---|---|---|---|
| `primary` | `accent` (terracotta) | `surface` | Inversion |
| `secondary` | `primary` (vert foncé) | `surface` | Inversion |

Props : `label`, `variant`, `fullWidth`

> ⚠️ Toujours utiliser la prop `label` — pas `children`

---

## Cards & blocs

```
bg-surface rounded-xl p-4      → card légère sur fond mid
bg-surface rounded-xl p-6      → card contenu riche
bg-surface-mid rounded-xl p-4  → card sur fond clair
```

---

## Carousel

Props disponibles :

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `items` | array | — | Données à afficher |
| `renderSlide` | function | — | Rendu de chaque slide |
| `slidesPerView` | number | `3` | Slides visibles |
| `spaceBetween` | number | `24` | Espacement px |
| `showPagination` | boolean | `false` | Afficher les dots |
| `color` | `"primary"` / `"surface"` | `"primary"` | Couleur des dots et flèches |

> `color="surface"` → sur fond foncé (`bg-accent-2`, `bg-primary`)  
> `color="primary"` → sur fond clair

---

## Alternance des fonds de section

Pattern recommandé pour éviter la monotonie visuelle :

```
bg-surface-mid  →  bg-surface  →  bg-surface-mid  →  bg-surface  →  bg-accent-2
```

---

## Rich text (HTML depuis BDD)

Classe à appliquer sur le wrapper : `rich-text`

Définie dans `index.css` :
```css
.rich-text ul { list-style: disc; padding-left: 1.5rem; }
.rich-text li { margin-bottom: 0.4rem; }
.rich-text p  { margin-bottom: 0.75rem; }
```

Champs concernés : `volunteer_role`, `health_info`, `admin_info`

---

## Icônes

Toutes centralisées dans `utils/icons.js` — une seule source de vérité.

| Export | Icône | Usage |
|---|---|---|
| `IconClock` | FiClock | Durée |
| `IconPin` | IoIosPin | Lieu |
| `IconMoney` | BiCoinStack | Prix |
| `IconCheck` | FaRegCheckCircle | Inclus |
| `IconTimes` | FaRegTimesCircle | Non inclus |
| `IconFlight` | FaPlaneDeparture | Départ / vol |
| `IconContact` | FaEnvelope | Contact |
| `IconBooking` | FaMapMarkerAlt | Réservation |
| `IconPayment` | FaCreditCard | Paiement |
| `IconContract` | FaFileContract | Convention |
| `IconGuide` | FaBook | Guide pratique |
| `IconFileMission` | FaFileAlt | Fiche mission |

> ⚠️ Ne jamais importer directement depuis `react-icons` dans les composants — toujours passer par `utils/icons.js`

---

## Règles générales

- Couleurs dynamiques → toujours `style={{}}` inline (Tailwind v4 ne génère pas de classes dynamiques)
- Tailwind v4 → config via `@theme` dans `index.css`, pas de `tailwind.config.js`
- Commits → toujours en français, une seule ligne
- Images publiques → `/frontend/public/images/`
- Images locations → `/frontend/public/images/locations/`