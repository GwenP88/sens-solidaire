// RapportCard.jsx
// Card rapport de mission — wrapper de BaseContentCard
// Zone haute : année + destination | Zone centrale : auteur | Zone basse : bouton télécharger
// Props :
//   auteur      : nom du/des auteur(s)
//   annee       : année de la mission
//   destination : destination optionnelle
//   pdf_url     : lien vers le PDF
//   image       : image optionnelle (V2 : upload par la cliente)

// ── Composants UI
import Button from '../ui/Button'
import BaseContentCard from '../ui/BaseContentCard'

function RapportCard({ auteur, annee, destination, pdf_url, image }) {
  return (
    <BaseContentCard
      image={image}
      fallbackImage="/images/temoignages-et-rapports-missions/rapport-mission.png"
      alt={`Rapport ${auteur}`}
      bg="bg-accent-2"
    >

      {/* ── Zone haute — année + destination ── */}
      <div className="flex flex-col gap-xs">
        <span className="text-eyebrow text-surface/60 mb-0">
          {annee}{destination ? ` — ${destination}` : ''}
        </span>
        <p className="text-caption text-surface/70">{auteur}</p>
      </div>

      {/* ── Zone centrale — vide, espace géré par justify-between ── */}
      <div className="flex-1" />

      {/* ── Zone basse — bouton télécharger ── */}
      <a href={pdf_url} target="_blank" rel="noopener noreferrer">
        <Button label="Télécharger le rapport ↓" variant="light" fullWidth />
      </a>

    </BaseContentCard>
  )
}

export default RapportCard