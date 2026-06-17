// RapportsActivite.jsx
// Page rapports d'activité — PDFs téléchargeables par année

import ScrollToTop from '../components/ui/ScrollToTop'

const RAPPORTS = [
  { annee: 2024, url: "https://www.sensolidaire.org/wp-content/uploads/2025/06/Rapport-dactivites-2024-1.pdf" },
  { annee: 2023, url: "https://www.sensolidaire.org/wp-content/uploads/2024/07/Rapport-des-activites-2023.pdf" },
  { annee: 2022, url: "https://www.sensolidaire.org/wp-content/uploads/2023/11/Rapport-dactivites-2022.pdf" },
  { annee: 2021, url: "https://www.sensolidaire.org/wp-content/uploads/2023/04/rapport-annuel-2021.pdf" },
  { annee: 2020, url: "https://www.sensolidaire.org/wp-content/uploads/2021/05/rapportmoral-2020.pdf" },
  { annee: 2019, url: "https://www.sensolidaire.org/wp-content/uploads/2020/05/rapportannuel19-compress%C3%A9-1.pdf" },
  { annee: 2018, url: "https://www.sensolidaire.org/wp-content/uploads/2020/02/rapportactivit%C3%A9s18.pdf" },
  { annee: 2017, url: "https://www.sensolidaire.org/wp-content/uploads/2019/10/rapportactivit%C3%A9s17.pdf" },
  { annee: 2016, url: "https://www.sensolidaire.org/wp-content/uploads/2025/01/rapportannuel16.pdf" },
  { annee: 2015, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportdactivit%C3%A92015.pdf" },
  { annee: 2014, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportactivit%C3%A914.pdf" },
  { annee: 2013, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportannuel13.pdf" },
  { annee: 2012, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportmoral2012.pdf" },
]

function RapportsActivite() {
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