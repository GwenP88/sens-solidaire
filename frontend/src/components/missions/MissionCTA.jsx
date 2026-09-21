// MissionCTA.jsx
// Barre de CTAs d'une section mission — bouton primaire optionnel + témoignages + contact

// ── Router
import { Link } from 'react-router-dom'

// ── Composants UI
import Button from '../ui/Button'

function MissionCTA({ primaryAction, secondaryAction, contactUrl = '/contact' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-sm w-full">

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

      {secondaryAction && (
        secondaryAction.external ? (
          <a href={secondaryAction.href} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button label={secondaryAction.label} variant="secondary" fullWidth />
          </a>
        ) : (
          <Link to={secondaryAction.href} className="flex-1">
            <Button label={secondaryAction.label} variant="secondary" fullWidth />
          </Link>
        )
      )}

      <Link to={contactUrl} className="flex-1">
        <Button label="Nous contacter →" variant="secondary" fullWidth />
      </Link>

    </div>
  )
}

export default MissionCTA