// RapportCard.jsx
// Card rapport de mission — image, année, destination, auteur, bouton télécharger PDF
// Props :
//   auteur      : nom du/des auteur(s)
//   annee       : année de la mission
//   destination : destination optionnelle (kenya, senegal...)
//   pdf_url     : lien vers le PDF
//   image       : image optionnelle — placeholder si absente (V2 : upload par la cliente)

// ── Composants UI
import Button from '../ui/Button'

function RapportCard({ auteur, annee, destination, pdf_url, image }) {
  return (
    <div className="flex flex-col bg-accent-2 rounded-xl overflow-hidden">
      <div className="w-full h-40 overflow-hidden">
        <img
          src={image || '/images/temoignages-et-rapports-missions/rapport-mission.png'}
          alt={`Rapport ${auteur}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between gap-sm p-6 flex-1">
        <div className="flex flex-col gap-xs">
          {/* text-eyebrow mb-0 : dans flex flex-col gap-xs, marge redondante avec gap */}
          <span className="text-eyebrow text-surface/50 mb-0">
            {annee}{destination ? ` — ${destination}` : ''}
          </span>
          <p className="text-caption text-surface/80">{auteur}</p>
        </div>
        <a href={pdf_url} target="_blank" rel="noopener noreferrer">
          <Button label="Télécharger le rapport ↓" variant="light" fullWidth />
        </a>
      </div>
    </div>
  )
}

export default RapportCard