// RapportsActivite.jsx
// Page rapports d'activité — PDFs téléchargeables par année

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchActivityReports } from '../services/api'

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function RapportsActivite() {
  const [rapports, setRapports] = useState([])

  useEffect(() => {
    fetchActivityReports().then(setRapports).catch(console.error)
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      <div className="bg-primary h-20" />

      <section className="section-padding max-w-4xl mx-auto flex flex-col gap-8">

        <div className="flex flex-col gap-2">
          <h1 className="h1-style text-primary">Rapports d'activité</h1>
          <p className="text-body text-primary/60">Retrouvez l'ensemble de nos rapports d'activité annuels, consultables librement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rapports.map(r => (
            <a
              key={r.annee}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-surface-mid rounded-2xl overflow-hidden hover:bg-surface-dark transition-colors group"
            >
              <div className="w-full h-40 overflow-hidden">
                <img
                  src="/images/equipe-et-rapports-activites/rapport-activite.png"
                  alt={`Rapport d'activité ${r.annee}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-2 p-4">
                <p className="h3-style text-primary">{r.annee}</p>
                <p className="text-caption text-primary/60">Rapport d'activité</p>
                <p className="link-cta text-accent group-hover:underline">Consulter ↓</p>
              </div>
            </a>
          ))}
        </div>

      </section>

      <ScrollToTop />
    </div>
  )
}

export default RapportsActivite