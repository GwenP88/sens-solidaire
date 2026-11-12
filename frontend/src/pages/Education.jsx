// Education.jsx
// Page Éducation & Sensibilisation — hero, ODD et appel à contacter fixes ; sections gérées depuis le dashboard (tâche 172).

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchEducationSections } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'
import CTASection from '../components/ui/CTASection'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import Carousel from '../components/ui/Carousel'
import TexteMisEnForme from '../components/ui/TexteMisEnForme'
import AnchorNav from '../components/navigation/AnchorNav'

// ── Composants métier
import EducationCard from '../components/education/EducationCard'

// ── Utils
import SectionODD from '../components/ui/SectionODD'
import { SECTION_AUDIENCE_OPTIONS } from '../utils/filters'

// ── Référencement
import useSEO from '../hooks/useSEO'

// ── Public : codes enregistrés → libellés (« maternelle,college » → « École maternelle, Collège »)
const AUDIENCE_LABELS = Object.fromEntries(SECTION_AUDIENCE_OPTIONS.map(o => [o.value, o.label]))
const formatAudience = (codes) =>
  (codes || '').split(',').map(c => AUDIENCE_LABELS[c.trim()]).filter(Boolean).join(', ')

// ── Tarif sur la page générale : euros ET francs suisses (une seule fois s'ils sont identiques, ex. « Gratuit »)
// Les pages /france et /suisse n'afficheront que leur devise.
const formatPrice = (eur, chf) => {
  if (eur && chf && eur.trim().toLowerCase() === chf.trim().toLowerCase()) return eur
  return [eur, chf].filter(Boolean).join(' · ')
}

// ── Bouton : page du site (Link), autre site ou document importé (nouvel onglet)
const isExternal = (url) => /^https?:\/\//i.test(url) || url.startsWith('/uploads/')

// ── Encadré « Informations pratiques » — n'affiche que ce qui est rempli
function InfoSidebar({ section, bg }) {
  const audience = formatAudience(section.audience)
  const price = formatPrice(section.price_eur, section.price_chf)
  const buttons = section.buttons || []

  if (!audience && !price && buttons.length === 0) return null

  return (
    <aside className={`lg:sticky lg:top-24 self-start ${bg} rounded-2xl p-6 flex flex-col gap-md`}>
      <h3 className="h3-style text-primary mb-0">Informations pratiques</h3>

      {audience && (
        <div className="flex flex-col gap-xs">
          <span className="text-eyebrow text-primary/90">Public</span>
          <p className="text-body text-primary/90">{audience}</p>
        </div>
      )}

      {price && (
        <div className="flex flex-col gap-xs">
          <span className="text-eyebrow text-primary/90">Tarif</span>
          <p className="text-stat text-primary">{price}</p>
          {section.price_detail && <p className="text-caption text-primary/90">{section.price_detail}</p>}
        </div>
      )}

      {buttons.length > 0 && (
        <div className="flex flex-col gap-sm">
          {buttons.map((button, i) => {
            const variant = i === 0 ? 'primary' : 'secondary' // le premier bouton est mis en avant
            return isExternal(button.file_url)
              ? <Button key={button.id} href={button.file_url} label={button.label} variant={variant} fullWidth />
              : <Button key={button.id} to={button.file_url} label={button.label} variant={variant} fullWidth />
          })}
        </div>
      )}
    </aside>
  )
}

// ── Une section de la page — même mise en page pour toutes, les fonds alternent
function EducationSection({ section, index }) {
  const isEven = index % 2 === 0
  const bg = isEven ? 'bg-surface' : 'bg-surface-mid'
  const sidebarBg = isEven ? 'bg-surface-mid' : 'bg-surface'
  const images = section.images || []
  const items = section.items || []

  return (
    <section id={section.slug} className={`padding-y padding-x ${bg}`}>

      <div className="flex flex-col gap-sm mb-8">
        {section.eyebrow && <p className="text-eyebrow text-accent-2">{section.eyebrow}</p>}
        <h2 className="h2-style text-primary">{section.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
        {/* Texte — 2/3 */}
        <div className="lg:col-span-2">
          <TexteMisEnForme texte={section.content} />
        </div>
        {/* Informations pratiques — 1/3 */}
        <InfoSidebar section={section} bg={sidebarBg} />
      </div>

      {/* Cartes (ateliers…) */}
      {items.length > 0 && (
        <div className="mt-10">
          <Carousel
            items={items}
            showPagination={true}
            color="primary"
            renderSlide={(item) => <EducationCard item={item} />}
          />
        </div>
      )}

      {/* Photos */}
      {images.length > 0 && (
        <div className="flex flex-col gap-sm mt-10">
          <h3 className="h3-style text-primary mb-0">En images</h3>
          <Carousel
            items={images}
            showPagination={true}
            color="primary"
            renderSlide={(image) => (
              <div className="w-full h-56 overflow-hidden rounded-xl">
                <img loading="lazy" src={image.file_url} alt={image.label || ''} className="w-full h-full object-cover" />
              </div>
            )}
          />
        </div>
      )}

    </section>
  )
}

function Education() {
  // ── Référencement : titre d'onglet, description Google, aperçu réseaux sociaux (tâche 174)
  useSEO({ title: 'Éducation & sensibilisation', description: "Ateliers pédagogiques, correspondance scolaire et relais Éco-École : les actions éducatives de Sens Solidaires pour les écoles et les jeunes.", image: '/images/design/hero/hero-education.webp' })

  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEducationSections()
      .then(setSections)
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  // Menu d'ancres généré à partir des sections visibles, dans l'ordre choisi dans le dashboard
  const anchorSections = sections.map(s => ({ label: s.title, id: s.slug }))

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/design/hero/hero-education.webp"
        title="Éducation & Sensibilisation"
        subtitle="Nous intervenons dans les écoles, collèges et lycées pour sensibiliser les jeunes à la biodiversité et au développement durable."
      />

      {/* ── Navigation ancres ── */}
      {anchorSections.length > 0 && <AnchorNav variant="dark" sections={anchorSections} />}

      {/* ── Section ODD (fixe, composant partagé) ── */}
      <SectionODD subtitle="Les Objectifs de Développement Durable (ODD) sont 17 grands objectifs définis par l'ONU pour relever les défis sociaux, environnementaux et économiques de notre époque. Toutes nos actions d'éducation et de sensibilisation s'inscrivent dans cette dynamique." />

      {/* ── Sections gérées depuis le dashboard ── */}
      {loading && <p className="text-body text-primary/90 italic padding-x padding-y">Chargement...</p>}
      {error && <p className="text-body text-primary/90 italic padding-x padding-y">{error}</p>}
      {sections.map((section, index) => (
        <EducationSection key={section.id} section={section} index={index} />
      ))}

      {/* ── CTA contact (fixe) ── */}
      <CTASection
        title="Vous souhaitez accueillir une intervention ?"
        text="Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux."
        ctaLabel="Nous contacter →"
        ctaHref="/contact"
      />

      <ScrollToTop />
    </div>
  )
}

export default Education
