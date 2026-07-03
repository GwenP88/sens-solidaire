// CookieBanner.jsx
// Bannière cookies CNIL — s'affiche au premier chargement si pas de consentement stocké
// Le choix est persisté dans localStorage sous la clé 'cookie_consent'

// ── React
import { useState, useEffect } from 'react'

// ── Composants UI
import Button from './Button'

function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleRefuse = () => {
    localStorage.setItem('cookie_consent', 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary padding-x py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-sm md:gap-lg shadow-lg">

      {/* Message d'information + lien politique cookies */}
      <p className="text-body text-surface/80 max-w-2xl">
        Ce site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé.{' '}
        <a href="/cookies" className="link-inline text-surface hover:text-accent">
          En savoir plus
        </a>
      </p>

      {/* Boutons refuser / accepter */}
      <div className="flex gap-sm shrink-0 w-full md:w-auto">
        <Button label="Refuser" variant="secondary" onClick={handleRefuse} />
        <Button label="Accepter" variant="primary" onClick={handleAccept} />
      </div>

    </div>
  )
}

export default CookieBanner