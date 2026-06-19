// RapportsActivite.jsx
// Page rapports d'activité — PDFs téléchargeables par année

import { useState, useEffect } from 'react'
import ScrollToTop from '../components/ui/ScrollToTop'
import { fetchActivityReports } from '../services/api'

function RapportsActivite() {
  const [rapports, setRapports] = useState([])

  useEffect(() => {
    fetchActivityReports()
      .then(setRapports)
      .catch(console.error)
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      {/* Header */}
      <div className="bg-primary h-20" />

      <section className="section-padding max-w-4xl mx-auto flex flex-col gap-8">

        {/* Titre */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading font-bold text-primary text-4xl">Rapports d'activité</h1>
          <p className="font-body text-sm text-primary/60">Retrouvez l'ensemble de nos rapports d'activité annuels, téléchargeables librement.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
        {RAPPORTS.map(r => (
          <a
            key={r.annee}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-0 bg-surface-mid rounded-2xl overflow-hidden hover:bg-surface-dark transition-colors group"
          >
            {/* Image paysage */}
            <div className="w-full h-40 overflow-hidden">
              <img
                src="/images/rapport-activite.png"
                alt={`Rapport d'activité ${r.annee}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu */}
            <div className="flex flex-col items-center gap-2 p-4">
              <p className="font-heading font-bold text-primary text-lg">{r.annee}</p>
              <p className="font-body text-xs text-primary/60">Rapport d'activité</p>
              <p className="font-body text-xs text-accent group-hover:underline">Télécharger ↓</p>
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