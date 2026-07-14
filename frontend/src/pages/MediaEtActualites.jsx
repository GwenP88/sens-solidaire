// MediaEtActualites.jsx
// Page Médias & Actualités — articles, newsletters, interviews

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchMediaPosts } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Filters from '../components/navigation/Filters'
import ScrollToTop from '../components/ui/ScrollToTop'
import Section from '../components/ui/Section'

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

      {/* ── Barre de filtres ── */}
      <div className="bg-primary padding-x filter-py">
        <Filters
          selects={FILTER_CONFIG_MEDIAS}
          selectValues={filters}
          onSelectChange={handleFilter}
        />
      </div>

      {/* ── Grille des articles ── */}
      <Section bg="bg-surface-mid">
        {loading ? (
          <p className="text-body text-primary/50 italic">Chargement...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-body text-primary/50 italic">Aucun article pour ces critères.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-md">
            {filteredPosts.map(post => (
              <MediaCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </Section>

      <ScrollToTop />
    </div>
  )
}

export default MediaEtActualites