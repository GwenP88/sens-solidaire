// CookieBanner.jsx
// Bannière cookies CNIL — s'affiche au premier chargement si pas de consentement stocké
// Le choix est persisté dans localStorage sous la clé 'cookie_consent'

// ── React
import { useState, useEffect } from 'react'

// ── Composants UI
import Button from './Button'

function CookieBanner() {
  // ── État local — visibilité de la bannière
  const [visible, setVisible] = useState(false)

  // ── Vérifie au montage si le consentement a déjà été enregistré
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  // ── Acceptation — stocke le consentement et masque la bannière
  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  // ── Refus — stocke le refus et masque la bannière
  const handleRefuse = () => {
    localStorage.setItem('cookie_consent', 'refused')
    setVisible(false)
  }

  // ── Ne rend rien si le consentement est déjà enregistré
  if (!visible) return null

  return (
    // ── Bannière fixe en bas de page — z-index élevé pour passer au-dessus du contenu
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 shadow-lg">

      {/* Message d'information + lien politique cookies */}
      <p className="text-body text-surface/80 max-w-2xl">
        Ce site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé.{' '}
        <a href="/cookies" className="link-inline text-surface hover:text-accent">
          En savoir plus
        </a>
      </p>

      {/* Boutons refuser / accepter */}
      <div className="flex gap-4 shrink-0 w-full md:w-auto">
        <Button label="Refuser" variant="secondary" onClick={handleRefuse} />
        <Button label="Accepter" variant="primary" onClick={handleAccept} />
      </div>

    </div>
  )
}

export default CookieBanner