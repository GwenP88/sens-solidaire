// CookieBanner.jsx
// Bannière cookies CNIL — s'affiche au premier chargement si pas de consentement stocké

import { useState, useEffect } from 'react'
import Button from './Button'

function CookieBanner() {
  const [visible, setVisible] = useState(false)

  // Vérifie si le consentement a déjà été donné
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary px-16 py-6 flex items-center justify-between gap-8 shadow-lg">
      <p className="font-body text-sm text-surface/80 max-w-2xl">
        Ce site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé.{' '}
        <a href="/mentions-legales" className="text-surface underline hover:text-accent transition-colors">
          En savoir plus
        </a>
      </p>
      <div className="flex gap-4 shrink-0">
        <Button label="Refuser" variant="secondary" onClick={handleRefuse} />
        <Button label="Accepter" variant="primary" onClick={handleAccept} />
      </div>
    </div>
  )
}

export default CookieBanner