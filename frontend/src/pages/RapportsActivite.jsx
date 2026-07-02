// RapportsActivite.jsx
// Page rapports d'activité — PDFs téléchargeables par année

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchActivityReports } from '../services/api'

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier
import RapportCard from '../components/testimonials/RapportCard'

function RapportsActivite() {
  const [rapports, setRapports] = useState([])

  useEffect(() => {
    fetchActivityReports().then(setRapports).catch(console.error)
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      <div className="bg-primary h-20" />

      <section className="padding-y padding-x max-w-6xl mx-auto flex flex-col gap-lg">

        <div className="flex flex-col gap-xs">
          <h1 className="h1-style text-primary">Rapports d'activité</h1>
          <p className="text-body text-primary/60">Retrouvez l'ensemble de nos rapports d'activité annuels, consultables librement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {rapports.map(r => (
            <RapportCard
              key={r.annee}
              annee={r.annee}
              type="Rapport d'activité"
              pdf_url={r.url}
              image="/images/equipe-et-rapports-activites/rapport-activite.png"
              bg="bg-primary"
            />
          ))}
        </div>

      </section>

      <ScrollToTop />
    </div>
  )
}

export default RapportsActivite