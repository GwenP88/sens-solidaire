// FooterBrand.jsx
// Bloc logo + tagline + réseaux sociaux — colonne 1 du Footer, répétée sur les 3 versions responsive
// Props :
//   logoSize : taille du logo (classe Tailwind, ex: 'h-10', 'h-12', 'h-14')

import { SOCIAL_LINKS } from '../../utils/footerData'

function FooterBrand({ logoSize = 'h-12' }) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-start gap-md">
        <div className="bg-white/50 rounded-full p-1 w-fit">
          <img src="/logo.webp" alt="Sens Solidaires" width="160" height="160" className={`${logoSize} w-auto`} />
        </div>
        <span className="text-brand text-surface">Sens Solidaires</span>
      </div>
      <p className="text-body text-surface">Une association engagée pour un monde plus solidaire et durable.</p>
      <p className="text-body text-surface/80">Sur le terrain, nous agissons aux côtés des communautés locales pour un impact positif et durable.</p>
      <div className="flex gap-md">
        {SOCIAL_LINKS.map(({ name, icon: Icon, href }) => (
          // Lien externe : nouvel onglet ; aria-label = texte lu à la place de l'icône (tâche 173)
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (nouvel onglet)`}>
            <Icon aria-hidden="true" className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}

export default FooterBrand