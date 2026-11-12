// BandeauODD.jsx
// Version compacte des ODD (accueil) : ligne des 17 icônes officielles de l'ONU + lien « En savoir plus ».

// ── Composants UI
import Button from './Button'

// ── Données
import { ODDS, ODD_INFO_URL, oddIconUrl } from '../../utils/odds'

// Le libellé de chaque ODD apparaît au survol (title) et sert de texte alternatif.
function BandeauODD() {
  return (
    <div className="flex flex-col items-center gap-sm my-8">
      <ul aria-label="Les 17 Objectifs de Développement Durable" className="flex flex-wrap justify-center gap-xs">
        {ODDS.map(odd => (
          <li key={odd.n}>
            <img
              loading="lazy"
              src={oddIconUrl(odd.n)}
              alt={`ODD ${odd.n} : ${odd.label}`}
              title={`ODD ${odd.n} : ${odd.label}`}
              width="64"
              height="64"
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded object-cover"
            />
          </li>
        ))}
      </ul>
      <Button href={ODD_INFO_URL} variant="secondary" label="En savoir plus sur les ODD →" />
    </div>
  )
}

export default BandeauODD
