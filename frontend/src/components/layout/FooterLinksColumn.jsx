// FooterLinksColumn.jsx
// Colonne titre + liste de liens — utilisée pour "Découvrir" et "S'engager" sur les 3 versions du Footer
// Props :
//   title : titre de la colonne (ex: "Découvrir")
//   links : [{ label, href }]

function FooterLinksColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-xs">
      <h3 className="text-label text-surface mb-6">{title}</h3>
      {links.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          className={`link-footer text-surface/70 hover:text-surface ${i === 0 ? 'pt-4' : ''}`}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

export default FooterLinksColumn