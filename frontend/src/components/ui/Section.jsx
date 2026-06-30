// Section.jsx
// Bloc de section générique réutilisable — header (titre/sous-titre/CTA optionnel) + contenu
// Utilise padding-y / padding-x / section-header / h2-style / text-eyebrow / section-subtitle
// Toutes les marges viennent des utilities du texte — aucune marge en dur dans ce composant
// But : éliminer la duplication de <section className="padding-y padding-x ..."> sur chaque page

// ── Composants UI
import Button from './Button'

function Section({
  bg = 'bg-surface',
  textColor = 'text-primary',
  eyebrow,
  title,
  subtitle,
  cta,
  id,
  children,
}) {
  // ── Couleur secondaire dérivée — text-primary/70 ou text-surface/80 selon le fond
  const subTextColor = textColor === 'text-surface' ? 'text-surface/80' : 'text-primary/70'

  return (
    <section id={id} className={`padding-y padding-x ${bg}`}>

      {/* ── En-tête — deux variantes selon présence d'un CTA ── */}
      {cta ? (
        // ── Avec CTA — section-header place le bloc texte à gauche, le bouton à droite ── */}
        <div className="section-header">
          <div>
            {eyebrow && <p className="text-eyebrow text-accent-2">{eyebrow}</p>}
            <h2 className={`h2-style ${textColor}`}>{title}</h2>
            {subtitle && <p className={`section-subtitle ${subTextColor}`}>{subtitle}</p>}
          </div>
          <a href={cta.href}>
            <Button label={cta.label} variant="primary" />
          </a>
        </div>
      ) : (
        // ── Sans CTA — titre simple suivi du sous-titre, aucun CTA aligné à droite ── */}
        <>
          {eyebrow && <p className="text-eyebrow text-accent-2">{eyebrow}</p>}
          <h2 className={`h2-style ${textColor}`}>{title}</h2>
          {subtitle && <p className={`section-subtitle ${subTextColor}`}>{subtitle}</p>}
        </>
      )}

      {/* ── Contenu — grille, carousel, texte libre... ── */}
      {children}

    </section>
  )
}

export default Section