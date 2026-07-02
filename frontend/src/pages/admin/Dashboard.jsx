// Dashboard.jsx
// Page dashboard admin — affiche les témoignages à modérer

// 1. On importe les hooks React et notre fonction API
import { useState, useEffect } from 'react'
import { fetchAdminTestimonials, approveTestimonial, rejectTestimonial } from '../../services/api'
import ModerationCard from '../../components/admin/ModerationCard'

function Dashboard() {

  // ── ÉTATS ──
  // La liste des témoignages (vide au départ)
  const [testimonials, setTestimonials] = useState([])
  // Vrai pendant le chargement, faux une fois fini
  const [loading, setLoading] = useState(true)
  // Stocke un message d'erreur éventuel
  const [error, setError] = useState(null)

  // ── CHARGEMENT ──
  // Fonction réutilisable : appelée au montage ET après chaque action.
  const loadTestimonials = async () => {
    try {
      const data = await fetchAdminTestimonials('pending')
      setTestimonials(data)
    } catch (err) {
      console.error("Erreur chargement témoignages:", err)
      setError("Impossible de charger les témoignages.")
    } finally {
      setLoading(false)
    }
  }

  // useEffect ne fait QU'appeler la fonction, une fois, au montage.
  useEffect(() => {
    loadTestimonials()
  }, [])

  // ── ACTIONS DE MODÉRATION ──

  // Valider un témoignage
  const handleApprove = async (id) => {
    try {
      // 1. on demande au backend de passer le statut à "approved"
      await approveTestimonial(id)
      // 2. on recharge la liste pour voir le changement à l'écran
      await loadTestimonials()
    } catch (err) {
      console.error("Erreur lors de l'approbation:", err)
    }
  }

  // Refuser un témoignage
  const handleReject = async (id) => {
    try {
      await rejectTestimonial(id)
      await loadTestimonials()
    } catch (err) {
      console.error("Erreur lors du refus:", err)
    }
  }

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
          <ModerationCard
            key={t.id}
            testimonial={t}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
