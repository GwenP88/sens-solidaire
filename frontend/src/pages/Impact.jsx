// ActionsEducatives.jsx
// Page Éducation & Sensibilisation — projets éducatifs et environnementaux

import { useState } from 'react'
import HeroPage from '../components/layout/HeroPage'
import ActionCard from '../components/actions/ActionCard'
import FilterChips from '../components/navigation/FilterChips'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

// Filtres disponibles
const FILTERS = [
  { label: "Tous", value: null },
  { label: "Environnement", value: "Environnement" },
  { label: "Biodiversité", value: "Biodiversité" },
  { label: "Agriculture", value: "Agriculture" },
  { label: "Éducation", value: "Éducation" },
  { label: "Échanges culturels", value: "Échanges culturels" },
  { label: "Accès à l'eau", value: "Accès à l'eau" },
  { label: "Sensibilisation", value: "Sensibilisation" },
]

// Actions — données statiques
const ACTIONS = [
  {
    slug: 'fabrique-papier-maktau-kenya',
    title: 'Fabrique de papier écologique de Maktau',
    description: 'Nous avons appuyé le projet de la fabrique de papier recyclé en bouse d\'éléphant, permettant aux locaux de recevoir un revenu économique tout en préservant leurs richesses naturelles.',
    tags: ['Environnement', 'Biodiversité'],
    country: 'Kenya',
    image: '/images/jardin_potager_kenya.jpg',
    odds: [8, 12, 15],
  },
  {
    slug: 'patrouilles-rangers-lumo',
    title: 'Patrouilles avec les rangers du sanctuaire LUMO',
    description: 'Depuis plus de 10 ans, l\'association investit ses efforts au sanctuaire de LUMO pour soutenir les rangers dans leur mission de lutte contre le braconnage.',
    tags: ['Environnement', 'Biodiversité'],
    country: 'Kenya',
    image: '/images/locations/LUMO-kenya.jpeg',
    odds: [15, 16],
  },
  {
    slug: 'potager-agro-ecologique-ttnp',
    title: 'Potager agro-écologique face à la sécheresse',
    description: 'Projet mené conjointement avec les élèves du TTNP de Voi visant à améliorer la production durable de cultures et diffuser les connaissances sur l\'agroécologie.',
    tags: ['Agriculture', 'Éducation'],
    country: 'Kenya',
    image: '/images/locations/TTNP-kenya.jpeg',
    odds: [2, 13, 15],
  },
  {
    slug: 'jardins-potagers-senegal',
    title: 'Jardins potagers et consommation responsable',
    description: 'En partenariat avec l\'association AGADA, nous avons installé des potagers dans les établissements scolaires de Casamance pour former les élèves à la production et à la consommation responsable.',
    tags: ['Agriculture', 'Éducation'],
    country: 'Sénégal',
    image: '/images/jardin_potager_senegal.jpg',
    odds: [3, 12, 15],
  },
  {
    slug: 'correspondances-scolaires-senegal',
    title: 'Correspondances scolaires France — Sénégal',
    description: 'Des échanges entre écoles primaires, collèges et lycées de la Métropole de Nice et des établissements de Casamance sur le thème de la consommation responsable et de la solidarité internationale.',
    tags: ['Éducation', 'Échanges culturels'],
    country: 'Sénégal / France',
    image: '/images/locations/AGADA-senegal.jpg',
    odds: [4, 10, 17],
  },
  {
    slug: 'correspondances-amazonie',
    title: 'Correspondances avec les écoles d\'Amazonie',
    description: 'Suite à la rencontre avec le Chef Raoni, nous avons mis en place une correspondance entre des écoles françaises et le peuple Kukama kukamiria sur le thème "Un jardin au cœur de la forêt".',
    tags: ['Éducation', 'Échanges culturels'],
    country: 'Pérou',
    image: '/images/jardin_potager_kenya.jpg',
    odds: [4, 10, 15],
  },
  {
    slug: 'projet-puits-sri-lanka',
    title: 'Accès à l\'eau potable dans les écoles',
    description: 'Nous finançons des forages dans les écoles du Sri Lanka pour garantir un accès durable à l\'eau potable aux élèves et aux communautés locales.',
    tags: ['Accès à l\'eau', 'Éducation'],
    country: 'Sri Lanka',
    image: '/images/puit-srilanka.jpg',
    odds: [3, 6, 4],
  },
  {
    slug: 'fabrique-eco-maximus',
    title: 'Fabrique de papier Eco Maximus',
    description: 'Sens Solidaire soutient la fabrique Eco Maximus en promouvant ses objets artisanaux issus de bouse d\'éléphant, contribuant à la protection de la biodiversité et à l\'économie locale.',
    tags: ['Environnement', 'Biodiversité'],
    country: 'Sri Lanka',
    image: '/images/fabrique_eco_maximus_srilanka.jpg',
    odds: [8, 12, 15],
  },
]

// badge ODD 
const ODDS = [
  { n: 1, label: "Pas de pauvreté" },
  { n: 2, label: "Faim zéro" },
  { n: 3, label: "Bonne santé" },
  { n: 4, label: "Éducation de qualité" },
  { n: 5, label: "Égalité des sexes" },
  { n: 6, label: "Eau propre" },
  { n: 7, label: "Énergie propre" },
  { n: 8, label: "Travail décent" },
  { n: 9, label: "Industrie & innovation" },
  { n: 10, label: "Inégalités réduites" },
  { n: 11, label: "Villes durables" },
  { n: 12, label: "Consommation responsable" },
  { n: 13, label: "Lutte contre le climat" },
  { n: 14, label: "Vie aquatique" },
  { n: 15, label: "Vie terrestre" },
  { n: 16, label: "Paix & justice" },
  { n: 17, label: "Partenariats" },
]

function Impact() {
  const [activeFilter, setActiveFilter] = useState(null)

  const filteredActions = activeFilter
    ? ACTIONS.filter(a => a.tags.includes(activeFilter))
    : ACTIONS

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/hero_missions.jpg"
        title="Notre impact"
        subtitle="Depuis plus de 15 ans, nous agissons aux côtés des communautés locales et des établissements scolaires pour un impact concret et durable."
      />

      <section className="section-padding">

        {/* Intro */}
        <p className="font-body text-sm text-primary/80 leading-relaxed mb-10 max-w-3xl">
          Sens Solidaire s'investit sur tous les continents afin de collaborer sur des projets tournés vers la sauvegarde de la biodiversité, le bien-être des populations locales et un développement durable. Nos actions combinent éducation, échanges interculturels et projets environnementaux concrets.
        </p>

        {/* Filtres */}
        <div className="mb-8">
          <FilterChips
            filters={FILTERS}
            active={activeFilter}
            onChange={setActiveFilter}
            variant="light"
          />
        </div>

        {/* Grille actions */}
        {filteredActions.length === 0 ? (
          <p className="font-body text-sm text-primary/50 italic">Aucune action pour ce filtre.</p>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {filteredActions.map(action => (
              <ActionCard key={action.slug} {...action} />
            ))}
          </div>
        )}

      </section>

      {/* ── Section ODD détaillée ── */}
      <section className="section-padding bg-surface-mid">
        <div className='section-header'>
          <div className='max-w-5xl'>
            <h2 className="section-title text-primary mb-2">Nos actions et les Objectifs de Développement Durable</h2>
            <p className="font-body text-sm text-primary/60">Les Objectifs de Développement Durable (ODD) sont 17 grands objectifs définis par l’ONU pour relever les défis sociaux, environnementaux et économiques de notre époque. Ils nous rappellent qu’un avenir durable se construit en agissant ensemble pour préserver la planète, réduire les inégalités et améliorer les conditions de vie de chacun. <br /><br />À notre échelle, chacun de nos projets s’inscrit dans cette dynamique. Qu’il s’agisse de protéger la biodiversité, favoriser l’accès à l’éducation, soutenir les communautés locales ou sensibiliser les jeunes aux enjeux environnementaux, nous contribuons concrètement à bâtir un monde plus juste, plus solidaire et plus respectueux du vivant.</p>
          </div>
            <a href="https://www.un.org/sustainabledevelopment/fr/" target="_blank" rel="noopener noreferrer">
              <Button label="Découvrir les 17 ODD →" variant="secondary" />
            </a>
        </div>

        <div className="flex flex-col gap-4 items-center">

          {/* Ligne 1 — 9 ODD */}
          <div className="flex flex-wrap gap-3 justify-center">
            {ODDS.map(odd => (
              <div key={odd.n} className="flex flex-col items-center gap-4 w-20 text-center">
                <img
                  src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(odd.n).padStart(2, '0')}.jpg`}
                  className="w-full rounded-lg object-cover"
                />
                <p className="font-body text-xs text-primary/60 leading-tight">{odd.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Impact