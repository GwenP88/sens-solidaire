// MissionCTA.jsx
// Barre de CTAs d'une section mission — bouton primaire optionnel + témoignages + contact

// ── Composants UI
import Button from '../ui/Button'

function MissionCTA({ primaryAction, secondaryAction, contactUrl = '/contact' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-sm w-full">

      {primaryAction && (
        primaryAction.external ? (
          <Button href={primaryAction.href} className="flex-1" label={primaryAction.label} variant="primary" fullWidth />
        ) : (
          <Button to={primaryAction.href} className="flex-1" label={primaryAction.label} variant="primary" fullWidth />
        )
      )}

      {secondaryAction && (
        secondaryAction.external ? (
          <Button href={secondaryAction.href} className="flex-1" label={secondaryAction.label} variant="secondary" fullWidth />
        ) : (
          <Button to={secondaryAction.href} className="flex-1" label={secondaryAction.label} variant="secondary" fullWidth />
        )
      )}

      <Button to={contactUrl} className="flex-1" label="Nous contacter →" variant="secondary" fullWidth />

    </div>
  )
}

export default MissionCTA