// FooterLinksColumn.jsx
// Colonne titre + liste de liens — utilisée pour "Découvrir" et "S'engager" sur les 3 versions du Footer
// Props :
//   title : titre de la colonne (ex: "Découvrir")
//   links : [{ label, href }] — liens internes, donc <Link> (pas de rechargement de page)

import { Link } from 'react-router-dom'

function FooterLinksColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-xs">
      <h3 className="text-label text-surface mb-6">{title}</h3>
      {links.map((link, i) => (
        <Link
          key={link.label}
          to={link.href}
          className={`link-footer text-surface/80 hover:text-surface ${i === 0 ? 'pt-4' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export default FooterLinksColumn