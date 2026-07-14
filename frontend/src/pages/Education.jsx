// Education.jsx
// Page Éducation & Sensibilisation — ODD + Éco-École + Correspondances + Ateliers

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchEducationItems, fetchFieldActions } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'
import CTASection from '../components/ui/CTASection'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import Section from '../components/ui/Section'
import Carousel from '../components/ui/Carousel'
import AnchorNav from '../components/navigation/AnchorNav'

// ── Composants métier
import EducationCard from '../components/education/EducationCard'
import ImpactCard from '../components/actions/ImpactCard'

// ── Utils
import { ODDS } from '../utils/odds'

// ── Sections de l'AnchorNav
const ANCHOR_SECTIONS = [
  { label: "Label Éco-École",    id: "eco-ecole"       },
  { label: "Correspondances",    id: "correspondances"  },
  { label: "Ateliers scolaires", id: "ateliers"         },
]

// ── Placeholders galerie correspondances
const GALLERY_CORRESPONDANCES = [
  '/images/placeholders/placeholder-galerie-1.png',
  '/images/placeholders/placeholder-galerie-2.png',
  '/images/placeholders/placeholder-galerie-3.png',
  '/images/placeholders/placeholder-galerie-4.png',
]

// ── Composant sidebar réutilisable — même structure pour les 3 sections
function InfoSidebar({ public: publicLabel, tarif, ctas = [], bg = 'bg-surface-mid' }) {
  return (
    <aside className={`sticky top-24 self-start ${bg} rounded-2xl p-6 flex flex-col gap-md`}>
      <h3 className="h3-style text-primary mb-0">Informations pratiques</h3>

      {/* Public cible */}
      {publicLabel && (
        <div className="flex flex-col gap-xs">
          <span className="text-eyebrow text-primary/40">Public</span>
          <p className="text-body text-primary/70">{publicLabel}</p>
        </div>
      )}

      {/* Tarif */}
      {tarif && (
        <div className="flex flex-col gap-xs">
          <span className="text-eyebrow text-primary/40">Tarif</span>
          <p className="text-stat text-primary">{tarif.prix}</p>
          {tarif.detail && (
            <p className="text-caption text-primary/50">{tarif.detail}</p>
          )}
        </div>
      )}

      {/* CTAs */}
      {ctas.length > 0 && (
        <div className="flex flex-col gap-sm">
          {ctas.map((cta, i) =>
            cta.external ? (
              <a key={i} href={cta.href} target="_blank" rel="noopener noreferrer">
                <Button label={cta.label} variant={cta.variant || 'secondary'} fullWidth />
              </a>
            ) : (
              <a key={i} href={cta.href}>
                <Button label={cta.label} variant={cta.variant || 'secondary'} fullWidth />
              </a>
            )
          )}
        </div>
      )}
    </aside>
  )
}

function Education() {
  const [items, setItems] = useState([])
  const [actionsFrance, setActionsFrance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchEducationItems(),
      fetchFieldActions(),
    ])
      .then(([educationData, actionsData]) => {
        setItems(educationData)
        setActionsFrance(actionsData.filter(a =>
          a.countries?.some(c => c.country === 'France')
        ))
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const itemsAteliers = items.filter(i => i.type === 'Atelier')

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-education.jpg"
        title="Éducation & Sensibilisation"
        subtitle="Nous intervenons dans les écoles, collèges et lycées pour sensibiliser les jeunes à la biodiversité et au développement durable."
      />

      {/* ── Navigation ancres ── */}
      <AnchorNav variant="dark" sections={ANCHOR_SECTIONS} />

      {/* ── Section ODD ── */}
      <Section
        bg="bg-surface-mid"
        title="Nos actions et les Objectifs de Développement Durable"
        subtitle="Les Objectifs de Développement Durable (ODD) sont 17 grands objectifs définis par l'ONU pour relever les défis sociaux, environnementaux et économiques de notre époque. Toutes nos actions d'éducation et de sensibilisation s'inscrivent dans cette dynamique."
        cta={{ label: "En savoir plus sur les ODD →", href: "https://www.un.org/sustainabledevelopment/fr/", target: "_blank" }}
      >
        <div className="flex flex-wrap gap-xs justify-center mt-8">
          {ODDS.map(odd => (
            <div key={odd.n} className="flex flex-col items-center gap-xs w-20 text-center">
              <img
                src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(odd.n).padStart(2, '0')}.jpg`}
                alt={`ODD ${odd.n}`}
                className="w-full rounded-lg object-cover"
              />
              <p className="text-caption text-primary/60 leading-tight">{odd.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Section Éco-École ── */}
      <section id="eco-ecole" className="padding-y padding-x bg-surface">

        <div className="flex flex-col gap-sm mb-8">
          <p className="text-eyebrow text-accent-2">Programme international</p>
          <h2 className="h2-style text-primary">Label Éco-École</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">

          {/* Colonne principale — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-sm">
            <p className="text-body text-primary/80">
              Nous sommes dorénavant Relais local du label Éco-École pour les établissements scolaires de l'agglomération d'Annemasse. Si vous souhaitez mettre en place un projet d'éducation au développement durable dans votre établissement scolaire, inscrivez-vous au programme Éco-École.
            </p>
            <p className="text-body text-primary/80">
              Présent dans 73 pays, c'est un programme international d'éducation au développement durable, développé en France depuis 2005 par l'association Teragir. Il est ouvert à tous les établissements scolaires, publics et privés, de la maternelle au lycée et la participation au programme est gratuite.
            </p>
            <p className="text-body text-primary/80">
              Notre rôle en tant que Relais local Éco-École est d'accompagner les Éco-Écoles, Éco-Collèges et Éco-Lycées inscrits au programme sur notre périmètre, les renseigner sur les ressources du territoire utiles pour la mise en œuvre de leur démarche de développement durable.
            </p>
            <p className="text-body text-primary/80">
              Le programme Éco-École propose une méthodologie en sept points, simple et participative, pour guider les établissements scolaires dans leur projet d'éducation au développement durable en s'appuyant sur 8 thématiques : alimentation, biodiversité, climat, déchets, eau, énergie, santé ou solidarités.
            </p>
          </div>

          {/* Sidebar — infos pratiques Éco-École */}
          <InfoSidebar
            public="Du collège au lycée — établissements publics et privés"
            tarif={{ prix: "Gratuit", detail: "La participation au programme Éco-École est gratuite" }}
            ctas={[
              { label: "Site officiel Éco-École →", href: "https://www.eco-ecole.org/", variant: "secondary", external: true },
              { label: "S'inscrire au programme →", href: "http://espace-etablissement.eco-ecole.org/signup", variant: "primary", external: true },
            ]}
          />

        </div>

        {/* Carousel actions menées en France — pleine largeur */}
        {!loading && actionsFrance.length > 0 && (
          <div className="flex flex-col gap-sm mt-10">
            <h3 className="h3-style text-primary mb-0">Actions menées en France</h3>
            <Carousel
              items={actionsFrance}
              showPagination={true}
              color="primary"
              renderSlide={(action) => (
                <ImpactCard
                  slug={action.slug}
                  title={action.title}
                  description={action.description}
                  image={action.image_url}
                  tags={action.tags?.map(t => t.tag)}
                  odds={action.odds?.map(o => o.odd_number)}
                />
              )}
            />
          </div>
        )}

      </section>

      {/* ── Section Correspondances ── */}
      <section id="correspondances" className="padding-y padding-x bg-surface-mid">

        <div className="flex flex-col gap-sm mb-8">
          <p className="text-eyebrow text-accent-2">Depuis 10 ans</p>
          <h2 className="h2-style text-primary">Correspondances scolaires internationales</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">

          {/* Colonne principale — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-sm">
            <p className="text-body text-primary/80">
              Nous organisons depuis 10 ans des échanges de lettres entre des écoles niçoises et celles de pays en développement sur le thème des 17 objectifs du développement durable (ODD). À travers nos outils pédagogiques, les élèves pourront comprendre l'importance d'adapter nos comportements afin de préserver et de partager de manière plus équitable les ressources naturelles avec les pays en développement.
            </p>
            <p className="text-body text-primary/80">
              Le saviez-vous ? Un rapport scientifique constate que les pays développés sont à la cause de plus de 30 % de la perte de la biodiversité dans les pays du Sud.
            </p>

            {/* Apports éducatifs */}
            <div className="flex flex-col gap-xs">
              <p className="text-eyebrow text-primary/40">Apports éducatifs</p>
              {[
                "Favoriser l'expression à l'écrit et enrichissement du vocabulaire",
                "Favoriser la compréhension et l'expression en anglais",
                "Acculturation et ouverture sur le monde",
                "Développement des connaissances sur le développement durable ici et à l'international",
                "Projet transversal : français, anglais, géographie, sciences",
              ].map(item => (
                <div key={item} className="flex items-start gap-xs">
                  <span className="text-accent-2 shrink-0">→</span>
                  <p className="text-body text-primary/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar — infos pratiques Correspondances */}
          <InfoSidebar
            public="Écoles primaires, collèges et lycées"
            tarif={{ prix: "500 €", detail: "Pour l'ensemble du projet sur l'année scolaire" }}
            ctas={[
              { label: "Nous contacter →", href: "/contact", variant: "primary" },
            ]}
            bg="bg-surface"
          />

        </div>

        {/* Carousel photos — pleine largeur */}
        <div className="flex flex-col gap-sm mt-10">
          <h3 className="h3-style text-primary mb-0">En images</h3>
          <Carousel
            items={GALLERY_CORRESPONDANCES}
            showPagination={true}
            color="primary"
            renderSlide={(url) => (
              <div className="w-full h-56 overflow-hidden rounded-xl">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          />
        </div>

      </section>

      {/* ── Section Ateliers scolaires ── */}
      <section id="ateliers" className="padding-y padding-x bg-surface">

        <div className="flex flex-col gap-sm mb-8">
          <p className="text-eyebrow text-accent-2">Interventions en établissement</p>
          <h2 className="h2-style text-primary">Ateliers scolaires</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start mb-10">

          {/* Colonne principale — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-sm">
            <p className="text-body text-primary/80">
              Nos interventions dans les écoles primaires, collèges publiques et/ou privés sont riches d’apprentissages, de découvertes et d’échanges avec les scolaires.Nous sommes convaincus que l’acquisition de connaissances sur des sujets sensibles tels que la conservation de la biodiversité, le développement durable, la notion de solidarité internationale…éveillera les consciences de nos futurs écocitoyens.
            </p>
            <p className="text-body text-primary/80">Connaitre un peu plus les bienfaits des ressources naturelles que la Planète peut nous apporter permettra de mieux vivre ensemble, n’oublions pas que nous sommes qu’un maillon de la chaine du vivant… Alors commençons par construire notre avenir commun en harmonie avec la nature !
            </p>
            <p className="text-body text-primary/80">
              Sans être professionnel de la solidarité internationale, chacun peut accueillir un atelier. Nous nous adaptons à vos contraintes horaires et à votre programme pédagogique.
            </p>
          </div>

          {/* Sidebar — infos pratiques Ateliers */}
          <InfoSidebar
            public="A partir de 5 ans"
            tarif={{ prix: "Sur devis", detail: "Tarif adapté selon le type d'intervention et l'établissement" }}
            ctas={[
              { label: "Demander un atelier →", href: "/contact", variant: "primary" },
            ]}
          />

        </div>

        {/* Carousel des ateliers — pleine largeur */}
        {loading ? (
          <p className="text-body text-primary/50 italic">Chargement...</p>
        ) : itemsAteliers.length === 0 ? (
          <p className="text-body text-primary/50 italic">Aucun atelier disponible.</p>
        ) : (
          <Carousel
            items={itemsAteliers}
            showPagination={true}
            color="primary"
            renderSlide={(item) => <EducationCard item={item} />}
          />
        )}

      </section>

      {/* ── CTA contact ── */}
      <CTASection
        title="Vous souhaitez accueillir une intervention ?"
        text="Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux."
        ctaLabel="Nous contacter →"
        ctaHref="/contact"
      />

      <ScrollToTop />
    </div>
  )
}

export default Education