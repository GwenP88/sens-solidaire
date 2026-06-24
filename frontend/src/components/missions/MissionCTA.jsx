// MissionCTA.jsx
// Barre de CTAs d'une section mission — bouton primaire optionnel + témoignages + contact

// ── Router
import { Link } from 'react-router-dom'

// ── Composants UI
import Button from '../ui/Button'

function MissionCTA({ primaryAction, testimonialsUrl, contactUrl = '/contact' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">

      {/* Bouton primaire — optionnel (candidater, télécharger, en savoir plus...) */}
      {primaryAction && (
        primaryAction.external ? (
          <a href={primaryAction.href} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button label={primaryAction.label} variant="primary" fullWidth />
          </a>
        ) : (
          <Link to={primaryAction.href} className="flex-1">
            <Button label={primaryAction.label} variant="primary" fullWidth />
          </Link>
        )
      )}

      {/* Bouton témoignages */}
      {testimonialsUrl && (
        <Link to={testimonialsUrl} className="flex-1">
          <Button label="Voir les témoignages →" variant="secondary" fullWidth />
        </Link>
      )}

      {/* Bouton contact */}
      <Link to={contactUrl} className="flex-1">
        <Button label="Nous contacter →" variant="secondary" fullWidth />
      </Link>

    </div>
  )
}

export default MissionCTA