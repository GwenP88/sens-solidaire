// Testimonials.jsx
// Page témoignages — témoignages courts + rapports de mission

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useSearchParams } from 'react-router-dom'

// ── API
import { fetchTestimonials, fetchMissionReports } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Filters from '../components/navigation/Filters'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import Modal from '../components/ui/Modal'
import Section from '../components/ui/Section'
import CTASection from '../components/ui/CTASection'

// ── Composants métier
import TestimonialCard from '../components/testimonials/TestimonialCard'
import TestimonialForm from '../components/testimonials/TestimonialForm'
import RapportCard from '../components/testimonials/RapportCard'

// ── Utils
import { FILTER_CONFIG_TEMOIGNAGES } from '../utils/filters'

function Testimonials() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ type: searchParams.get('type') || null })
  const [testimonials, setTestimonials] = useState([])
  const [rapports, setRapports] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(console.error).finally(() => setLoading(false))
    fetchMissionReports().then(setRapports).catch(console.error)
  }, [])

  const handleFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'type') next.destination = null
      return next
    })
  }

  const filterFn = (item) => {
    if (filters.type && item.type !== filters.type) return false
    if (filters.destination && item.destination !== filters.destination) return false
    if (filters.annee && String(item.annee) !== filters.annee) return false
    return true
  }

  const filteredTestimonials = testimonials.filter(filterFn)
  const filteredRapports = rapports.filter(filterFn)
  const showTemoignages = !filters.vue || filters.vue === 'temoignages'
  const showRapports = !filters.vue || filters.vue === 'rapports'

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/missions/groupe-jeune-2.jpg"
        title="Paroles de volontaires"
        subtitle="Ils sont partis, ils ont vécu l'aventure. Découvrez leurs récits et rapports de mission."
      />

      {/* ── Barre de filtres ── */}
      <div className="bg-primary padding-x filter-py">
        <Filters
          selects={FILTER_CONFIG_TEMOIGNAGES}
          selectValues={filters}
          onSelectChange={handleFilter}
        />
      </div>

      {/* ── Section témoignages ── */}
      {showTemoignages && (
        <Section title="Témoignages" bg="bg-surface-mid">
          {loading ? (
            <p className="text-body text-primary/50 italic">Chargement...</p>
          ) : filteredTestimonials.length === 0 ? (
            <p className="text-body text-primary/50 italic">Aucun témoignage pour ces critères.</p>
          ) : (
            <div className="grid-cards-3">
              {filteredTestimonials.map(t => (
                <TestimonialCard
                  key={t.id}
                  quote={t.content}
                  name={t.author_name}
                  mission={t.mission?.title || ''}
                  avatar={t.avatar_url || undefined}
                />
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── Section rapports de mission ── */}
      {showRapports && (
        <Section title="Rapports de mission" bg="bg-surface">
          {filteredRapports.length === 0 ? (
            <p className="text-body text-primary/50 italic">Aucun rapport pour ces critères.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {filteredRapports.map(r => (
                <RapportCard
                  key={r.id}
                  auteur={r.auteur}
                  annee={r.annee}
                  destination={r.destination}
                  pdf_url={r.pdf_url}
                  image={r.image_url}
                />
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── CTA soumission témoignage ── */}
      <CTASection
        title="Vous êtes partis en mission ?"
        text="Vos rencontres, vos découvertes et les moments forts vécus sur le terrain peuvent donner à d'autres l'envie de s'engager et de vivre cette aventure à leur tour."
        ctaLabel="Partager mon expérience →"
        ctaHref="#"
        onCtaClick={() => setModalOpen(true)}
      />

      <ScrollToTop />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Partager votre témoignage">
        <TestimonialForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Testimonials