// Dashboard.jsx
// Page dashboard admin — affiche les témoignages à modérer

// 1. On importe les hooks React et notre fonction API
import { useState, useEffect } from 'react'
import { fetchAdminTestimonials } from '../../services/api'

function Dashboard() {

  // ── ÉTATS ──
  // La liste des témoignages (vide au départ)
  const [testimonials, setTestimonials] = useState([])
  // Vrai pendant le chargement, faux une fois fini
  const [loading, setLoading] = useState(true)
  // Stocke un message d'erreur éventuel
  const [error, setError] = useState(null)

  // ── CHARGEMENT AU MONTAGE ──
  // useEffect avec [] = s'exécute UNE fois, quand la page s'affiche
  useEffect(() => {
    // On définit une fonction async (useEffect n'accepte pas async directement)
    const loadTestimonials = async () => {
      try {
        // 👉 appelle la fonction API et récupère les données
        const data = await fetchAdminTestimonials()

        // 👉 range les données dans l'état testimonials
        setTestimonials(data)

      } catch (err) {
        console.error("Erreur chargement témoignages:", err)
        setError("Impossible de charger les témoignages.")
      } finally {
        // Dans tous les cas (succès ou échec), le chargement est fini
        setLoading(false)
      }
    }

    loadTestimonials()
  }, []) // 👈 le tableau vide = "une seule fois au montage"

  // ── RENDU ──

  // Cas 1 : en cours de chargement
  if (loading) {
    return <div className="p-12 font-body text-primary">Chargement...</div>
  }

  // Cas 2 : une erreur s'est produite
  if (error) {
    return <div className="p-12 font-body text-red-600">{error}</div>
  }

  // Cas 3 : données chargées → on affiche
  return (
    <div className="p-12 font-body text-primary">
      <h1 className="font-heading font-bold text-2xl mb-4">Dashboard admin</h1>
      <p className="mb-6">Témoignages à modérer : {testimonials.length}</p>

      {/* On parcourt la liste : une carte par témoignage */}
      <div className="flex flex-col gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="border border-surface-dark rounded p-4">
            <p className="font-semibold">{t.author_name}</p>
            <p className="text-sm text-primary/70 mb-2">Statut : {t.status}</p>
            <p className="italic">"{t.content}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
