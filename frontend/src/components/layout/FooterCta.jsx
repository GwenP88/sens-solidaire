// FooterCta.jsx
// Zone CTA immersive — boutons adaptés selon la route active

import { useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import { FOOTER_CTA_BUTTONS, FOOTER_CTA_ALIASES, FOOTER_CTA_PREFIXES } from '../../utils/footerCta'

function FooterCta({ hideCta = false }) {
  const { pathname } = useLocation()

  if (hideCta) return null

// Résolution — alias exact d'abord, puis préfixe, puis config directe, sinon default
const resolvedByPrefix = FOOTER_CTA_PREFIXES.find(p => pathname.startsWith(p.prefix))
const resolvedRoute = FOOTER_CTA_ALIASES[pathname] || resolvedByPrefix?.config || pathname
const buttons = FOOTER_CTA_BUTTONS[resolvedRoute] || FOOTER_CTA_BUTTONS.default

  return (
    <div
      className="relative w-full h-auto min-h-64 md:h-96 flex items-end padding-x p-6 md:p-16"
      style={{ backgroundImage: `url(/images/hero/hero-footer.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex flex-col gap-sm">
        <h2 className="h2-style text-surface">Chaque action peut changer une vie.</h2>
        <p className="text-lead text-surface">
          Rejoignez-nous sur le terrain ou soutenez nos projets. <br /> Ensemble, construisons un avenir plus solidaire.
        </p>
        <div className="flex flex-wrap gap-sm mt-2">
          {buttons.map(btn => (
            <a key={btn.href} href={btn.href}>
              <Button label={btn.label} variant={btn.variant} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FooterCta