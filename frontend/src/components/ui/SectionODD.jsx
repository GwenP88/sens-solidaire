// SectionODD.jsx
// Section « Objectifs de Développement Durable » partagée (Notre impact, Éducation) : 17 icônes officielles de l'ONU + bouton vers le site de l'ONU.

// ── Composants UI
import Section from './Section'

// ── Données
import { ODDS, ODD_INFO_URL, oddIconUrl } from '../../utils/odds'

// Props :
//   subtitle : texte d'introduction, propre à chaque page
//   bg       : fond de la section (surface-mid par défaut)
//
// 17 icônes : 3 par ligne (mobile), 6 (tablette), 9 (ordinateur = 2 lignes, la 2e centrée).
// Largeur limitée (max-w-5xl) pour garder des icônes de taille raisonnable sur grand écran.
function SectionODD({ subtitle, bg = 'bg-surface-mid' }) {
  return (
    <Section
      bg={bg}
      title="Nos actions et les Objectifs de Développement Durable"
      subtitle={subtitle}
      cta={{ label: "En savoir plus sur les ODD →", href: ODD_INFO_URL, target: "_blank" }}
    >
      <ul className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto mt-8">

        {/* ── Une case par ODD : icône officielle + libellé en français ── */}
        {/* Largeur calculée (colonnes moins les espaces de 0,75 rem) : la dernière ligne reste centrée */}
        {ODDS.map(odd => (
          <li
            key={odd.n}
            className="flex flex-col items-center gap-xs text-center w-[calc((100%-1.5rem)/3)] sm:w-[calc((100%-3.75rem)/6)] lg:w-[calc((100%-6rem)/9)]"
          >
            <img
              loading="lazy"
              src={oddIconUrl(odd.n)}
              alt={`ODD ${odd.n}`}
              width="200"
              height="200"
              className="w-full aspect-square rounded-lg object-cover"
            />
            <p className="text-caption text-primary/90 leading-tight">{odd.label}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default SectionODD
