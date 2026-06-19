// Testimonials.jsx
// Page témoignages — témoignages courts + rapports de mission

import { useState, useEffect } from 'react'
import { fetchTestimonials, fetchMissionReports } from '../services/api'
import HeroPage from '../components/layout/HeroPage'
import TestimonialCard from '../components/testimonials/TestimonialCard'
import FilterSelect from '../components/ui/FilterSelect'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import Modal from '../components/ui/Modal'
import TestimonialForm from '../components/testimonials/TestimonialForm'
import { FILTER_CONFIG_TEMOIGNAGES } from '../utils/filters'

function Testimonials() {
  const [activeTab, setActiveTab] = useState('temoignages')
  const [filters, setFilters] = useState({})
  const [testimonials, setTestimonials] = useState([])
  const [rapports, setRapports] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchTestimonials()
      .then(data => setTestimonials(data))
      .catch(console.error)
      .finally(() => setLoading(false))

    fetchMissionReports()
      .then(setRapports)
      .catch(console.error)
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

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/groupe-jeune-2.jpg"
        title="Paroles de volontaires"
        subtitle="Ils sont partis, ils ont vécu l'aventure. Découvrez leurs récits et rapports de mission."
      />

      {/* ── Onglets + Filtres ── */}
      <div className="bg-primary px-24 py-4 flex items-center justify-between">
        <div className="flex">
          <button
            onClick={() => setActiveTab('temoignages')}
            className={`font-body font-bold text-sm px-6 py-3 border-b-2 mb-[-1px] transition-colors ${activeTab === 'temoignages' ? 'border-surface text-surface' : 'border-transparent text-surface/50 hover:text-surface'}`}
          >
            Témoignages
          </button>
          <button
            onClick={() => setActiveTab('rapports')}
            className={`font-body font-bold text-sm px-6 py-3 border-b-2 mb-[-1px] transition-colors ${activeTab === 'rapports' ? 'border-surface text-surface' : 'border-transparent text-surface/50 hover:text-surface'}`}
          >
            Rapports de mission
          </button>
        </div>
        <FilterSelect
          filters={FILTER_CONFIG}
          values={filters}
          onChange={handleFilter}
        />
      </div>

      {/* ── Onglet Témoignages ── */}
      {activeTab === 'temoignages' && (
        <section className="section-padding bg-surface-mid">
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

      {/* ── Onglet Rapports ── */}
      {activeTab === 'rapports' && (
        <section className="section-padding bg-surface-mid">
          {filteredRapports.length === 0 ? (
            <p className="font-body text-sm text-primary/50 italic">Aucun rapport pour ces critères.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredRapports.map(r => (
                <div key={r.id} className="flex flex-col justify-between gap-0 bg-surface rounded-xl overflow-hidden">
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src="/placeholder-rapport.png"
                      alt={`Rapport ${r.auteur}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
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

      {/* ── CTA formulaire ── */}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Partager votre témoignage">
        <TestimonialForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Testimonials