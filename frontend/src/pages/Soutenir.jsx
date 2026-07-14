// Soutenir.jsx
// Page don & adhésion — parcours narratif, impact concret, confiance

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import AnchorNav from '../components/navigation/AnchorNav'

// ── Utils
import { IconHeart, IconPeople, IconGuide, IconGlobe, IconLeaf } from '../utils/icons'

// ── Liens HelloAsso
const DON_URL = 'https://www.helloasso.com/associations/sens-solidaires/formulaires/1/widget'
const ADHESION_URL = 'https://www.helloasso.com/associations/sens-solidaires/adhesions/adhesion-a-l-association-sens-solidaires'

// ── Actions rendues possibles par le soutien
const IMPACTS = [
  "Des actions éducatives auprès des jeunes",
  "Des projets environnementaux avec les partenaires locaux",
  "Des missions de volontariat encadrées sur le terrain",
  "Un accompagnement durable des communautés partenaires",
]

// ── Raisons de soutenir
const RAISONS = [
  { icon: IconLeaf, titre: "Nature", description: "Préserver les écosystèmes et la biodiversité." },
  { icon: IconPeople, titre: "Communautés", description: "Agir avec les populations locales, jamais à leur place." },
  { icon: IconGuide, titre: "Éducation", description: "Sensibiliser les jeunes aux enjeux environnementaux." },
  { icon: IconGlobe, titre: "Solidarité", description: "Créer des liens durables entre les cultures." },
]

// ── Sections de navigation
const ANCHOR_SECTIONS = [
  { label: "Pourquoi", id: "pourquoi" },
  { label: "Impact", id: "impact" },
  { label: "Don & adhésion", id: "agir" },
  { label: "Transparence", id: "rapports" },
]

function Soutenir() {
  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-home.jpg"
        title="Soutenir des actions utiles, concrètes et durables"
        subtitle="Chaque don, chaque adhésion permet de faire vivre des projets solidaires sur le terrain, aux côtés des volontaires et des communautés locales."
      />

      <AnchorNav variant="dark" sections={ANCHOR_SECTIONS} />

      {/* ── Pourquoi soutenir ── */}
      <section id="pourquoi" className="padding-y padding-x bg-surface">
        <div className="flex flex-col gap-lg">

          <div className="flex flex-col gap-md">
            <p className="text-eyebrow text-accent-2">Pourquoi nous soutenir ?</p>
            <h2 className="h2-style text-primary">
              Parce qu’un projet solidaire a besoin de temps, de présence et de confiance.
            </h2>
            <div className="bg-surface-mid rounded-3xl p-8 flex flex-col gap-sm">
              <p className="h3-style text-primary mb-0">
                "Chaque mission est rendue possible par des personnes qui choisissent d'agir, même à leur échelle."
              </p>
              <p className="text-body text-primary/70">
                Sens Solidaires accompagne des actions de terrain autour de la biodiversité, de l'éducation et de la solidarité internationale. Soutenir l'association, c'est participer à une chaîne d'engagement : des donateurs, des adhérents, des volontaires, des équipes locales et des bénéficiaires qui avancent ensemble.
              </p>
            </div>

            {/* Mobile — scroll horizontal avec dégradé indicateur */}
            <div className="relative sm:hidden overflow-hidden mt-6">
              <div className="flex flex-row gap-md overflow-x-auto pb-3">
                {RAISONS.map(r => (
                  <div key={r.titre} className="flex flex-col gap-xs shrink-0 w-40">
                    <r.icon className="text-accent-2 text-2xl" />
                    <h3 className="h3-style text-primary mb-0">{r.titre}</h3>
                    <p className="text-caption text-primary/60">{r.description}</p>
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
            </div>

            {/* Desktop — grille avec séparateurs ── */}
            <div className="hidden sm:grid grid-cols-4 gap-md pt-2 divide-x divide-surface-dark mt-6">
              {RAISONS.map(r => (
                <div key={r.titre} className="flex flex-col gap-xs px-4 first:pl-0">
                  <r.icon className="text-accent-2 text-2xl" />
                  <h3 className="h3-style text-primary mb-0">{r.titre}</h3>
                  <p className="text-caption text-primary/60">{r.description}</p>
                </div>
              ))}
            </div>
          </div>    
        </div>
      </section>

      {/* ── Impact visuel ── */}
      <section id="impact" className="padding-y padding-x bg-accent-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-center">

          <div className="overflow-hidden rounded-3xl">
            <img
              src='/images/placeholders/placeholder-galerie-1.png'
              alt="Projet soutenu sur le terrain"
              className="w-full h-[360px] lg:h-[460px] object-cover"
            />
          </div>

          <div className="flex flex-col gap-md">
            <p className="text-eyebrow text-surface/70">Grâce à votre soutien</p>
            <h2 className="h2-style text-surface">
              Des projets peuvent continuer à grandir sur le terrain.
            </h2>
            <p className="text-body text-surface/80">
              Votre contribution aide l’association à accompagner des actions concrètes, à soutenir les partenaires locaux et à transmettre aux jeunes l’envie de protéger le vivant.
            </p>

            <div className="flex flex-col gap-sm">
              {IMPACTS.map(item => (
                <div key={item} className="flex items-start gap-sm">
                  <span className="text-surface text-lg shrink-0">✓</span>
                  <p className="text-body text-surface/90">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Choix don / adhésion ── */}
      <section id="agir" className="padding-y padding-x bg-surface">
        <div className="flex flex-col gap-lg">

          <div className="max-w-3xl mx-auto text-center flex flex-col gap-sm">
            <p className="text-eyebrow text-accent-2">Comment agir ?</p>
            <h2 className="h2-style text-primary">
              Deux façons simples de soutenir Sens Solidaires
            </h2>
            <p className="text-body text-primary/70">
              Le don finance directement les actions. L’adhésion vous permet de rejoindre la vie associative et de soutenir les projets dans la durée.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">

            {/* Don */}
            <article id="don" className="bg-surface-mid rounded-3xl overflow-hidden flex flex-col">
              <img
                src='/images/placeholders/placeholder-galerie-2.png'
                alt="Faire un don"
                className="w-full h-56 object-cover"
              />

              <div className="p-6 md:p-8 flex flex-col gap-md flex-1">
                <div className="flex flex-col gap-xs">
                  <p className="text-eyebrow text-accent-2">Faire un don</p>
                  <h3 className="h2-style text-primary mb-0">Financer une action concrète</h3>
                  <p className="text-body text-primary/80">
                    Votre don aide à financer les projets de solidarité internationale, les actions éducatives et les initiatives environnementales portées avec les partenaires locaux.
                  </p>
                </div>

                <div className="border-y border-primary/10 py-4 flex flex-col gap-sm">
                  <div className="flex justify-between gap-sm">
                    <p className="text-body text-primary font-semibold">20 €</p>
                    <p className="text-body text-primary/70 text-right">du matériel pédagogique</p>
                  </div>
                  <div className="flex justify-between gap-sm">
                    <p className="text-body text-primary font-semibold">50 €</p>
                    <p className="text-body text-primary/70 text-right">une action de sensibilisation</p>
                  </div>
                  <div className="flex justify-between gap-sm">
                    <p className="text-body text-primary font-semibold">100 €</p>
                    <p className="text-body text-primary/70 text-right">un soutien terrain</p>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl p-5 flex flex-col gap-xs">
                  <p className="text-eyebrow text-accent-2">Déduction fiscale</p>
                  <p className="text-body text-primary/80">
                    66 % de votre don est déductible de vos impôts. Un don de <strong>60 €</strong> revient réellement à <strong>20,40 €</strong> après réduction fiscale.
                  </p>
                </div>

                <div className="flex flex-col gap-xs mt-auto">
                  <a href={DON_URL} target="_blank" rel="noopener noreferrer">
                    <Button label="Je fais un don →" variant="primary" fullWidth />
                  </a>
                  <p className="text-mention text-primary/40 text-center">
                    Paiement 100% sécurisé via HelloAsso
                  </p>
                </div>
              </div>
            </article>

            {/* Adhésion */}
            <article id="adhesion" className="bg-primary rounded-3xl overflow-hidden flex flex-col">
              <img
                src='/images/placeholders/placeholder-galerie-3.png'
                alt="Adhérer à l'association"
                className="w-full h-56 object-cover"
              />

              <div className="p-6 md:p-8 flex flex-col gap-md flex-1">
                <div className="flex flex-col gap-xs">
                  <p className="text-eyebrow text-surface/70">Adhérer</p>
                  <h3 className="h2-style text-surface mb-0">Rejoindre l’association</h3>
                  <p className="text-body text-surface/80">
                    En adhérant, vous devenez membre de Sens Solidaires. Vous soutenez les projets toute l’année et participez à la vie de l’association.
                  </p>
                </div>

                <div className="flex flex-col gap-sm">
                  {[
                    "Participer à la vie associative",
                    "Recevoir les informations de l’association",
                    "Soutenir les projets sur la durée",
                    "Rejoindre un réseau engagé",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-sm">
                      <span className="text-surface shrink-0">✓</span>
                      <p className="text-body text-surface/90">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 divide-x divide-surface/20 border-y border-surface/20 py-4">
                  {[
                    { prix: "25 €", type: "Particulier" },
                    { prix: "50 €", type: "Structure" },
                    { prix: "250 €", type: "Entreprise" },
                  ].map(t => (
                    <div key={t.type} className="text-center px-3">
                      <p className="text-stat text-surface">{t.prix}</p>
                      <p className="text-caption text-surface/60">{t.type}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-xs mt-auto">
                  <a href={ADHESION_URL} target="_blank" rel="noopener noreferrer">
                    <Button label="J'adhère à l'association →" variant="light" fullWidth />
                  </a>
                  <p className="text-mention text-surface/50 text-center">
                    Adhésion en ligne via HelloAsso
                  </p>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ── Transparence ── */}
      <section id="rapports" className="padding-y padding-x bg-surface-mid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-center">

          <div className="flex flex-col gap-md">
            <p className="text-eyebrow text-accent-2">Transparence</p>
            <h2 className="h2-style text-primary">Votre confiance est essentielle.</h2>
            <p className="text-body text-primary/80">
              Sens Solidaires agit avec transparence. Les rapports d’activité permettent de suivre les actions menées, les projets soutenus et l’évolution de l’association.
            </p>

            <div className="flex flex-col gap-sm">
              {[
                "Des rapports publiés régulièrement",
                "Des actions documentées sur le terrain",
                "Un engagement associatif clair et durable",
              ].map(item => (
                <div key={item} className="flex items-start gap-sm">
                  <span className="text-accent-2 shrink-0">✓</span>
                  <p className="text-body text-primary/70">{item}</p>
                </div>
              ))}
            </div>

            <a href="/rapports-activite">
              <Button label="Consulter nos rapports d'activité →" variant="secondary" />
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <img
              src="/images/equipe-et-rapports-activites/rapport-activite.png"
              alt="Rapport d'activité"
              className="w-full h-72 lg:h-96 object-cover"
            />
          </div>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Soutenir