// Equipe.jsx
// Page équipe — direction, bureau, conseil d'administration, délégations

import HeroPage from '../components/layout/HeroPage'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

// Direction
const DIRECTION = [
  { nom: "Delphine Thibaut", role: "Fondatrice et Chargée des Programmes", description: "Master administratrice S.I. Institut Bioforce — Ancienne guide spécialisée Afrique", avatar: '/avatar-women.png' },
  { nom: "Arya Monchauzou", role: "Chargée des projets des Alpes-Maritimes", description: "Master Risques et Environnement", avatar: '/avatar-women.png' },
  { nom: "Amna Labidi", role: "Chargée de mission Service Civique", description: "Licence Sciences de la vie — Master biologie (en cours)", avatar: '/avatar-women.png' },
  { nom: "Emile Augsburger", role: "Chargé de mission Service Civique", description: "Ingénieur écologue HES-SO", avatar: '/avatar-men.png' },
  { nom: "Clémence Armanet", role: "Chargée de mission Service Civique", description: "Master Ecologie de l'anthropocène", avatar: '/avatar-women.png' },
  { nom: "Eymeric Coffi", role: "Chargé de mission Service Civique", description: "Master en science de Gestion et Marketing", avatar: '/avatar-men.png' },
]

// Bureau
const BUREAU = [
  { nom: "Elodie Tisserand", role: "Présidente", description: "Management de projets culturels et innovation — Chargée des projets d'éducation populaire.", avatar: '/avatar-women.png' },
  { nom: "Hervé Caffin", role: "Trésorier", description: "Responsable affaires transition énergétique Paris — Ancien chargé de mission pour Energie Solidaire au Burkina Faso.", avatar: '/avatar-men.png' },
  { nom: "Lynda Tabet", role: "Secrétaire", description: "Coach professionnel — Professeur de Yoga — Coordinatrice projets Transition Bien-être.", avatar: '/avatar-women.png' },
]

// Conseil d'administration
const CA = [
  { nom: "Ingrid von Anthoni", role: "Chargée des plaidoyers sur le massacre des éléphants", avatar: '/avatar-women.png' },
  { nom: "Virginie Blumet", role: "Manager International Business Finance WWF", avatar: '/avatar-women.png' },
  { nom: "Emilie della-guardia", role: "Professeure de Science et Vie de la Terre", avatar: '/avatar-women.png' },
  { nom: "Crystel Cantariti", role: "Professeure des écoles", avatar: '/avatar-women.png' },
  { nom: "Marc Olivier", role: "Consultant, professeur en ethnobotanique", avatar: '/avatar-women.png' },
  { nom: "Coralie Pinchart", role: "Master 2 économie de développement à l'International", avatar: '/avatar-women.png' },
  { nom: "John Rebmann", role: "Ancien directeur financier de Parcs Hôteliers", avatar: '/avatar-men.png' },
  { nom: "Brigitte Schwarz", role: "Chargée de communication", avatar: '/avatar-women.png' },
  { nom: "Patricia Valensi", role: "Docteur en Préhistoire, paléontologue", avatar: '/avatar-women.png' },
  { nom: "Eduardo Widakowich", role: "Consultant en gestion de projet développement durable", avatar: '/avatar-men.png' },
  { nom: "Johanna Zerbib", role: "Responsable Opérations Thompson Africa", avatar: '/avatar-women.png' },
]

// Également à nos côtés
const EGALEMENT = [
  { nom: "Bertrand D.", role: "Infographiste", avatar: '/avatar-men.png' },
  { nom: "Thierry Montalban", role: "Agence de communication", avatar: '/avatar-men.png' },
  { nom: "Sabine Jerome", role: "Comptabilité", avatar: '/avatar-women.png' },
]

// Délégations internationales
const DELEGATIONS = [
  // Kenya
  { pays: "Kenya", flag: "https://flagcdn.com/w40/ke.png", image: "/images/locations/LUMO-kenya.jpeg", lieu: "LUMO Community Wildlife Sanctuary", contacts: "Denis (coordinateur), Ernest (chargé des projets biodiversité) et les 22 Rangers" },
  { pays: "Kenya", flag: "https://flagcdn.com/w40/ke.png", image: "/images/locations/TTNP-kenya.jpeg", lieu: "Taita Taveta National Polytechnic", contacts: "Kefa Okari (Coordinateur des missions, professeur de français), Madeline Nabwire (directrice du département de tourisme)" },
  { pays: "Kenya", flag: "https://flagcdn.com/w40/ke.png", image: "/images/locations/ECT-kenya.jpeg", lieu: "Elsa Conservation Trust", contacts: "Antony — Coordinateur des missions" },
  // Sénégal
  { pays: "Sénégal", flag: "https://flagcdn.com/w40/sn.png", image: "/images/locations/AGADA-senegal.jpg", lieu: "Association AGADA", contacts: "François Bassene et Penda Diémé" },
  { pays: "Sénégal", flag: "https://flagcdn.com/w40/sn.png", image: "/images/locations/campement-senegal.jpg", lieu: "Campement de l'Ile d'Effrane", contacts: "Mamadou Ndiaye" },
  // Sri Lanka
  { pays: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png", image: "/images/locations/mef-sri-lanka.jpg", lieu: "Millenium Elephant Foundation", contacts: "Nalaka — Chargé des volontaires, Sara — Coordinatrice des missions" },
  // Pérou
  { pays: "Pérou amazonien", flag: "https://flagcdn.com/w40/pe.png", image: "/images/locations/amazon-shelter-perou.jpg", lieu: "Amazon Shelter", contacts: "Magali, Kim et Latam" },
  // Sumatra
  { pays: "Sumatra", flag: "https://flagcdn.com/w40/id.png", image: "/images/locations/batu-kapal-sumatra.jpg", lieu: "Batu Kapal Conservation", contacts: "L'équipe Batu Kapal Conservation" },
]

function Equipe() {
  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/hero_missions.jpg"
        title="Notre équipe"
        subtitle="Des femmes et des hommes engagés, en France et à l'international, pour un monde plus juste et la protection de la biodiversité."
      />

      {/* ── Direction ── */}
      <section className="section-padding bg-surface">
        <h2 className="section-title text-primary mb-8">Direction</h2>
        <div className="grid grid-cols-3 gap-6">
          {DIRECTION.map(m => (
            <div key={m.nom} className="flex gap-4 items-start bg-surface-mid rounded-2xl p-6">
              <img src={m.avatar} alt={m.nom} className="w-16 h-16 rounded-full object-cover shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="font-heading font-bold text-primary text-sm">{m.nom}</p>
                <p className="font-body font-bold text-accent-2 text-xs">{m.role}</p>
                <p className="font-body text-xs text-primary/60 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bureau ── */}
      <section className="section-padding bg-surface-mid">
        <h2 className="section-title text-primary mb-8">Membres du bureau</h2>

        <div className="grid grid-cols-3 gap-6">
          {BUREAU.map(m => (
            <div key={m.nom} className="flex gap-4 items-start bg-surface rounded-2xl p-6">
              <img src={m.avatar} alt={m.nom} className="w-16 h-16 rounded-full object-cover shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="font-heading font-bold text-primary text-sm">{m.nom}</p>
                <p className="font-body font-bold text-accent-2 text-xs">{m.role}</p>
                <p className="font-body text-xs text-primary/60 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── Conseil d'administration ── */}
      <section className="section-padding bg-surface">
        <h2 className="section-title text-primary mb-8">Conseil d'administration</h2>
        <div className="grid grid-cols-4 gap-6">
          {CA.map(m => (
            <div key={m.nom} className="flex flex-col items-center gap-3 bg-surface-mid rounded-2xl p-4 text-center">
              <img src={m.avatar} alt={m.nom} className="w-16 h-16 rounded-full object-cover" />
              <p className="font-heading font-bold text-primary text-sm">{m.nom}</p>
              <p className="font-body text-xs text-primary/60 leading-relaxed">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Également à nos côtés ── */}
      <section className="section-padding bg-surface-mid">
        <h2 className="section-title text-primary mb-8">Également à nos côtés</h2>
        <div className="grid grid-cols-3 gap-6">
          {EGALEMENT.map(m => (
            <div key={m.nom} className="flex flex-col items-center gap-3 bg-surface rounded-2xl p-6 text-center">
              <img src={m.avatar} alt={m.nom} className="w-16 h-16 rounded-full object-cover" />
              <p className="font-heading font-bold text-primary text-sm">{m.nom}</p>
              <p className="font-body text-xs text-primary/60">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Délégations internationales ── */}
      <section className="section-padding bg-surface">
        <h2 className="section-title text-primary mb-8">Nos délégations et partenaires terrain</h2>

        <div className="grid grid-cols-3 gap-6">
        {DELEGATIONS.map((d, i) => (
          <div key={i} className="relative h-42 rounded-2xl overflow-hidden">
            {/* Image immersive */}
            <img src={d.image} alt={d.lieu} className="w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            {/* Contenu */}
            <div className="absolute inset-0 p-6 flex flex-col justify-start gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0">
                  <img src={d.flag} alt={d.pays} className="w-full h-full object-cover" />
                </div>
                <p className="font-heading font-bold text-surface text-base">Délégation nationale au {d.pays}</p>
              </div>
              <p className="font-body font-bold text-surface text-sm">{d.lieu}</p>
              <p className="font-body text-xs italic text-surface leading-relaxed">{d.contacts}</p>
            </div>
          </div>
        ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-surface mb-2">Envie de rejoindre l'aventure ?</h2>
            <p className="font-body text-surface/80 text-sm">Bénévole, volontaire, enseignant, partenaire... Il existe mille façons d'agir avec nous.</p>
          </div>
          <a href="/contact">
            <Button label="Nous contacter →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Equipe