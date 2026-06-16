// Testimonials.jsx
// Page témoignages — témoignages courts + rapports de mission

import { useState, useEffect } from 'react'
import { fetchTestimonials } from '../services/api'
import HeroPage from '../components/layout/HeroPage'
import TestimonialCard from '../components/testimonials/TestimonialCard'
import FilterSelect from '../components/ui/FilterSelect'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import Modal from '../components/ui/Modal'
import TestimonialForm from '../components/testimonials/TestimonialForm'

// Données statiques rapports PDF
const RAPPORTS = [
  // Volontariat individuel — Kenya
  { id: 1, auteur: "Joelle", destination: "kenya", type: 'individuel', annee: 2025, pdf: "/pdfs/rapports/joelle-kenya-2025.pdf" },
  { id: 2, auteur: "Armand", destination: "kenya", type: 'individuel', annee: 2024, pdf: "/pdfs/rapports/armand-kenya-2024.pdf" },
  // Volontariat individuel — Sénégal
  { id: 3, auteur: "Amna", destination: "senegal", type: 'individuel', annee: 2025, pdf: "/pdfs/rapports/amna-senegal-2025.pdf" },
  { id: 4, auteur: "Tilla", destination: "senegal", type: 'individuel', annee: 2024, pdf: "/pdfs/rapports/tilla-senegal-2024.pdf" },
  // Volontariat individuel — Sri Lanka
  { id: 5, auteur: "Bérénice & Frédéric", destination: "sri-lanka", type: 'individuel', annee: 2024, pdf: "/pdfs/rapports/berenice-frederic-srilanka-2024.pdf" },
  { id: 6, auteur: "Clélia", destination: "sri-lanka", type: 'individuel', annee: 2023, pdf: "/pdfs/rapports/clelia-srilanka-2023.pdf" },
  // Volontariat individuel — Pérou
  { id: 7, auteur: "Andréa & Tristan", destination: "perou", type: 'individuel', annee: 2023, pdf: "/pdfs/rapports/andrea-tristan-perou-2023.pdf" },
  { id: 8, auteur: "Christine & Adèle", destination: "perou", type: 'individuel', annee: 2022, pdf: "/pdfs/rapports/christine-adele-perou-2022.pdf" },
  // Volontariat individuel — Sumatra
  { id: 9, auteur: "Lucile", destination: "sumatra", type: 'individuel', annee: 2026, pdf: "/pdfs/rapports/lucile-sumatra-2026.pdf" },
  { id: 10, auteur: "Cathy & Laurent", destination: "sumatra", type: 'individuel', annee: 2024, pdf: "/pdfs/rapports/cathy-laurent-sumatra-2024.pdf" },
  // Service civique
  { id: 11, auteur: "Kimberley", destination: null, type: 'service_civique', annee: 2025, pdf: "/pdfs/rapports/kimberley-service-civique-2025.pdf" },
  { id: 12, auteur: "Cyril", destination: null, type: 'service_civique', annee: 2024, pdf: "/pdfs/rapports/cyril-service-civique-2024.pdf" },
  // Groupe jeune
  { id: 13, auteur: "École Internationale de Fuveau", destination: null, type: 'groupe_jeune', annee: 2018, pdf: "/pdfs/rapports/ecole-fuveau-srilanka-2018.pdf" },
  { id: 14, auteur: "École Internationale de Nice", destination: null, type: 'groupe_jeune', annee: 2017, pdf: "/pdfs/rapports/ecole-nice-srilanka-2017.pdf" },
  // Congé solidaire
  { id: 15, auteur: "Jean-Yves, Loïc & Christian", destination: null, type: 'conge_solidaire', annee: 2016, pdf: "/pdfs/rapports/jeanyves-loic-christian-perou-2016.pdf" },
  { id: 16, auteur: "Édith & Thierry", destination: null, type: 'conge_solidaire', annee: 2020, pdf: "/pdfs/rapports/edith-thierry-sumatra-2020.pdf" },
  { id: 17, auteur: "Équipe Décathlon Nice", destination: null, type: 'conge_solidaire', annee: 2023, pdf: "/pdfs/rapports/decathlon-nice-conge-solidaire-2023.pdf" },
]

// Config filtres — réutilise FilterSelect
const FILTER_CONFIG = [
  {
    key: 'type',
    placeholder: 'Toutes les missions',
    options: [
      { value: 'individuel', label: 'Volontariat individuel' },
      { value: 'service_civique', label: 'Service civique' },
      { value: 'groupe_jeune', label: 'Groupe jeune' },
      { value: 'conge_solidaire', label: 'Congé solidaire' },
    ]
  },
  {
    key: 'destination',
    placeholder: 'Toutes les destinations',
    condition: (values) => !values.type || values.type === 'individuel',
    options: [
      { value: 'kenya', label: 'Kenya' },
      { value: 'senegal', label: 'Sénégal' },
      { value: 'sri-lanka', label: 'Sri Lanka' },
      { value: 'perou', label: 'Pérou' },
      { value: 'sumatra', label: 'Sumatra' },
    ]
  },
  {
    key: 'annee',
    placeholder: 'Toutes les années',
    options: [2026, 2025, 2024, 2023, 2022, 2021, 2020]
      .map(a => ({ value: String(a), label: String(a) }))
  },
]

function Testimonials() {
  // Onglet actif
  const [activeTab, setActiveTab] = useState('temoignages')

  // Filtres — état unique partagé entre les deux onglets
  const [filters, setFilters] = useState({})

  // Témoignages depuis l'API
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
      .then(data => setTestimonials(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      // Reset destination si on change de type
      if (key === 'type') next.destination = null
      return next
    })
  }

  // Fonction de filtrage commune
  const filterFn = (item) => {
    if (filters.type && item.type !== filters.type) return false
    if (filters.destination && item.destination !== filters.destination) return false
    if (filters.annee && String(item.annee) !== filters.annee) return false
    return true
  }

  const filteredTestimonials = testimonials.filter(filterFn)
  const filteredRapports = RAPPORTS.filter(filterFn)

  // État modale
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/groupe-jeune-2.jpg"
        title="Paroles de volontaires"
        subtitle="Ils sont partis, ils ont vécu l'aventure. Découvrez leurs récits et rapports de mission."
      />

      {/* ── Onglets + Filtres ── */}
      <div className="bg-primary px-24 py-4 flex items-center justify-between">

        {/* Onglets */}
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

        {/* Filtres — partagés entre les deux onglets */}
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
                  {/* Image */}
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={r.image || '/placeholder-rapport.png'}
                      alt={r.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-col justify-between gap-4 p-6 flex-1">
                    <div className="flex flex-col gap-2">
                      <span className="font-body text-xs font-bold text-primary/40 uppercase">{r.annee} — {r.destination}</span>
                      <p className="font-body text-xs text-primary/50">{r.auteur}</p>
                    </div>
                    <a href={r.pdf} target="_blank" rel="noopener noreferrer">
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