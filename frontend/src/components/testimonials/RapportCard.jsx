// RapportCard.jsx
// Card rapport — rapport de mission ET rapport d'activité
// Layout identique à BaseContentCard : portrait → paysage 768 → portrait 1024+
// Card indépendante — hauteurs adaptées au contenu court des rapports
// Props :
//   auteur      : nom ou type du rapport
//   annee       : année
//   destination : destination optionnelle (rapports de mission)
//   pdf_url     : lien vers le PDF
//   image       : image optionnelle (fallback si absente)

// ── Composants UI
import Button from '../ui/Button'

function RapportCard({ auteur, annee, destination, type, pdf_url, image, bg = 'bg-accent-2' }) {
  return (
    <article className={`flex flex-col ${bg} rounded-2xl overflow-hidden `}>

      {/* ── Zone image ── */}
      <div className="w-full h-40 overflow-hidden shrink-0">
        <img
          src={image || '/images/temoignages-et-rapports-missions/rapport-mission.png'}
          alt={`Rapport ${auteur}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Zone contenu ── */}
      <div className="flex flex-col justify-between flex-1 min-w-0 p-6 gap-sm">

        {/* ── Zone haute — année + destination/type + auteur ── */}
        <div className="flex flex-col gap-xs">
          <span className="text-eyebrow text-surface/60 mb-0">
            {annee}{destination ? ` — ${destination}` : ''}{type ? ` — ${type}` : ''}
          </span>
          <p className="text-caption text-surface/70">{auteur}</p>
        </div>

        {/* ── Zone basse — bouton télécharger ── */}
        <a href={pdf_url} target="_blank" rel="noopener noreferrer">
          <Button label="Télécharger le rapport ↓" variant="light" fullWidth />
        </a>

      </div>
    </article>
  )
}

export default RapportCard