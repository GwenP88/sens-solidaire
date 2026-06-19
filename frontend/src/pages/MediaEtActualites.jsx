// MediaEtActualites.jsx
// Page Médias & Actualités — articles, newsletters, interviews

import { useState, useEffect } from 'react'
import HeroPage from '../components/layout/HeroPage'
import FilterSelect from '../components/ui/FilterSelect'
import MediaCard from '../components/media/MediaCard'
import ScrollToTop from '../components/ui/ScrollToTop'
import { fetchMediaPosts } from '../services/api'
import { FILTER_CONFIG_MEDIAS } from '../utils/filters'

function MediaEtActualites() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchMediaPosts()
      .then(data => setPosts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredPosts = posts.filter(p => {
    if (filters.theme && p.theme !== filters.theme) return false
    if (filters.annee && new Date(p.date).getFullYear() !== Number(filters.annee)) return false
    return true
  })

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
      image="/images/hero_missions.jpg"
      title="Médias & Actualités"
      subtitle="Restez informés des dernières nouvelles de l'association, de nos missions et de nos actions sur le terrain."
    />

    {/* Filtres — collés au hero */}
    <div className="bg-primary px-24 py-6">
      <FilterSelect
        filters={FILTER_CONFIG_MEDIAS}
        values={filters}
        onChange={handleFilter}
      />
    </div>

      <section className="section-padding">

        {/* Grille */}
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