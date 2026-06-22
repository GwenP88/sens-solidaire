// RapportsActivite.jsx
// Page rapports d'activité — PDFs téléchargeables par année

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchActivityReports } from '../services/api'

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function RapportsActivite() {
  // ── État local — liste des rapports depuis l'API
  const [rapports, setRapports] = useState([])

  // ── Chargement des rapports au montage
  useEffect(() => {
    fetchActivityReports()
      .then(setRapports)
      .catch(console.error)
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Bande de couleur en haut — remplace le hero sur cette page ── */}
      <div className="bg-primary h-20" />

      <section className="section-padding max-w-4xl mx-auto flex flex-col gap-8">

        {/* ── Titre de page ── */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading font-bold text-primary text-4xl">Rapports d'activité</h1>
          <p className="font-body text-sm text-primary/60">Retrouvez l'ensemble de nos rapports d'activité annuels, consultables librement.</p>
        </div>

        {/* ── Grille des rapports — 3 colonnes ── */}
        <div className="grid grid-cols-3 gap-6">
          {rapports.map(r => (
            <a
              key={r.annee}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-0 bg-surface-mid rounded-2xl overflow-hidden hover:bg-surface-dark transition-colors group"
            >
              {/* Image de couverture du rapport */}
              <div className="w-full h-40 overflow-hidden">
                <img
                  src="/images/equipe-et-rapports-activites/rapport-activite.png"
                  alt={`Rapport d'activité ${r.annee}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Année + label + lien téléchargement */}
              <div className="flex flex-col items-center gap-2 p-4">
                <p className="font-heading font-bold text-primary text-lg">{r.annee}</p>
                <p className="font-body text-xs text-primary/60">Rapport d'activité</p>
                <p className="font-body text-xs text-accent group-hover:underline">Consulter ↓</p>
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