// FooterCta.jsx
// Zone CTA immersive en haut du Footer — image de fond + titre + accroche + 2 boutons
// Props :
//   hideCta : si true, ce composant ne rend rien (masqué sur certaines pages)

import Button from '../ui/Button'

function FooterCta({ hideCta = false }) {
  if (hideCta) return null

  return (
    <div
      className="relative w-full h-auto min-h-64 md:h-96 flex items-end padding-x p-6 md:p-16"
      style={{ backgroundImage: `url(/images/hero/hero-footer.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative flex flex-col gap-sm">
        <h2 className="h2-style text-surface">
          Chaque action peut changer une vie.
        </h2>
        <p className="text-lead text-surface">
          Rejoignez-nous sur le terrain ou soutenez nos projets. <br /> Ensemble, construisons un avenir plus solidaire.
        </p>
        <div className="flex flex-wrap gap-sm mt-2">
          <a href="/missions">
            <Button label="Je pars en mission →" variant="primary" />
          </a>
          <a href="/soutenir">
            <Button label="Je fais un don →" variant="secondary" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default FooterCta