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
import FilterSelect from '../components/ui/FilterSelect'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import Modal from '../components/ui/Modal'

// ── Composants métier
import TestimonialCard from '../components/testimonials/TestimonialCard'
import TestimonialForm from '../components/testimonials/TestimonialForm'

// ── Utils
import { FILTER_CONFIG_TEMOIGNAGES } from '../utils/filters'

function Testimonials() {
  // ── Initialisation du filtre type depuis l'URL (?type=service_civique)
  const [searchParams] = useSearchParams()

  // ── État local — filtres + données + chargement + modale
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || null
  })
  const [testimonials, setTestimonials] = useState([])
  const [rapports, setRapports] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  // ── Chargement des témoignages et rapports en parallèle au montage
  useEffect(() => {
    fetchTestimonials()
      .then(data => setTestimonials(data))
      .catch(console.error)
      .finally(() => setLoading(false))

    fetchMissionReports()
      .then(setRapports)
      .catch(console.error)
  }, [])

  // ── Mise à jour d'un filtre — reset destination si changement de type
  const handleFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'type') next.destination = null
      return next
    })
  }

  // ── Fonction de filtrage commune témoignages et rapports
  const filterFn = (item) => {
    if (filters.type && item.type !== filters.type) return false
    if (filters.destination && item.destination !== filters.destination) return false
    if (filters.annee && String(item.annee) !== filters.annee) return false
    return true
  }

  const filteredTestimonials = testimonials.filter(filterFn)
  const filteredRapports = rapports.filter(filterFn)

  // ── Visibilité des sections selon le filtre vue
  const showTemoignages = !filters.vue || filters.vue === 'temoignages'
  const showRapports = !filters.vue || filters.vue === 'rapports'

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/missions/groupe-jeune-2.jpg"
        title="Paroles de volontaires"
        subtitle="Ils sont partis, ils ont vécu l'aventure. Découvrez leurs récits et rapports de mission."
      />

      {/* ── Barre de filtres — collée au hero ── */}
      <div className="bg-primary px-24 py-4">
        <FilterSelect
          filters={FILTER_CONFIG_TEMOIGNAGES}
          values={filters}
          onChange={handleFilter}
        />
      </div>

      {/* ── Section témoignages courts — grille 3 colonnes ── */}
      {showTemoignages && (
        <section className="section-padding bg-surface">
          <h2 className="section-title text-primary mb-8">Témoignages</h2>
          {loading ? (
            <p className="font-body text-sm text-primary/50 italic">Chargement...</p>
          ) : filteredTestimonials.length === 0 ? (
            <p className="font-body text-sm text-primary/50 italic">Aucun témoignage pour ces critères.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
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
        </section>
      )}

      {/* ── Section rapports de mission — grille 3 colonnes ── */}
      {showRapports && (
        <section className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-8">Rapports de mission</h2>
          {filteredRapports.length === 0 ? (
            <p className="font-body text-sm text-primary/50 italic">Aucun rapport pour ces critères.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredRapports.map(r => (
                <div key={r.id} className="flex flex-col justify-between gap-0 bg-surface rounded-xl overflow-hidden">

                  {/* Image placeholder du rapport */}
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src="/placeholder-rapport.png"
                      alt={`Rapport ${r.auteur}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Métadonnées + bouton téléchargement */}
                  <div className="flex flex-col justify-between gap-4 p-6 flex-1">
                    <div className="flex flex-col gap-2">
                      <span className="font-body text-xs font-bold text-primary/40 uppercase">{r.annee} — {r.destination}</span>
                      <p className="font-body text-xs text-primary/50">{r.auteur}</p>
                    </div>
                    <a href={r.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button label="Télécharger le rapport ↓" variant="secondary" fullWidth />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── CTA soumission témoignage — ouvre la modale ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex items-center justify-between">
          <div className="max-w-2xl">
            <h2 className="section-title text-surface mb-2">Vous êtes partis en mission ?</h2>
            <p className="font-body text-surface/80 text-sm">Vos rencontres, vos découvertes et les moments forts vécus sur le terrain peuvent donner à d'autres l'envie de s'engager et de vivre cette aventure à leur tour.</p>
          </div>
          <Button label="Partager mon expérience →" variant="primary" onClick={() => setModalOpen(true)} />
        </div>
      </section>

      <ScrollToTop />

      {/* ── Modale formulaire de témoignage ── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Partager votre témoignage">
        <TestimonialForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Testimonials