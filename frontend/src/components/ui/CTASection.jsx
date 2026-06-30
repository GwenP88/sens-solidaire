// CTASection.jsx
// Bloc CTA de fin de page — titre + texte + bouton, fond accent-2 fixe
// Pattern répété à l'identique sur la majorité des pages (Equipe, Impact, ActionDetail,
// ActionsEducatives, EducationDetail, APropos, Testimonials...)
// Toujours bg-accent-2 + text-surface — pas de prop bg/textColor, contrairement à Section

// ── Composants UI
import Button from './Button'

function CTASection({ title, text, ctaLabel, ctaHref }) {
  return (
    <section className="padding-y padding-x bg-accent-2">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
        <div>
          <h2 className="h2-style text-surface">{title}</h2>
          <p className="text-body text-surface/80">{text}</p>
        </div>
        <a href={ctaHref}>
          <Button label={ctaLabel} variant="primary" />
        </a>
      </div>
    </section>
  )
}

export default CTASection