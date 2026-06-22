// MediaEtActualites.jsx
// Page Médias & Actualités — articles, newsletters, interviews

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchMediaPosts } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import FilterSelect from '../components/ui/FilterSelect'
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier
import MediaCard from '../components/media/MediaCard'

// ── Utils
import { FILTER_CONFIG_MEDIAS } from '../utils/filters'

function MediaEtActualites() {
  // ── État local — articles + chargement + filtres actifs
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  // ── Chargement des articles depuis l'API au montage
  useEffect(() => {
    fetchMediaPosts()
      .then(data => setPosts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // ── Mise à jour d'un filtre individuel
  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // ── Filtrage combiné — par thème ET par année
  const filteredPosts = posts.filter(p => {
    if (filters.theme && p.theme !== filters.theme) return false
    if (filters.annee && new Date(p.date).getFullYear() !== Number(filters.annee)) return false
    return true
  })

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-home.jpg"
        title="Médias & Actualités"
        subtitle="Restez informés des dernières nouvelles de l'association, de nos missions et de nos actions sur le terrain."
      />

      {/* ── Barre de filtres — collée au hero ── */}
      <div className="bg-primary px-24 py-6">
        <FilterSelect
          filters={FILTER_CONFIG_MEDIAS}
          values={filters}
          onChange={handleFilter}
        />
      </div>

      {/* ── Grille des articles — 3 colonnes ── */}
      <section className="section-padding">
        {loading ? (
          <p className="font-body text-sm text-primary/50 italic">Chargement...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="font-body text-sm text-primary/50 italic">Aucun article pour ces critères.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <MediaCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </section>

      <ScrollToTop />
    </div>
  )
}

export default MediaEtActualites