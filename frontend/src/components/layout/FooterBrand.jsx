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
          <img src="/logo.png" alt="Sens Solidaire" className={logoSize} />
        </div>
        <span className="text-brand text-surface">Sens Solidaires</span>
      </div>
      <p className="text-body text-surface">Une association engagée pour un monde plus solidaire et durable.</p>
      <p className="text-body text-surface/80">Sur le terrain, nous agissons aux côtés des communautés locales pour un impact positif et durable.</p>
      <div className="flex gap-md">
        {SOCIAL_LINKS.map(({ icon: Icon, href }) => (
          <a key={href} href={href}>
            <Icon className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}

export default FooterBrand