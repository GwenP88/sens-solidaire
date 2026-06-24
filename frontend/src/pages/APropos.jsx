// APropos.jsx
// Page à propos — histoire, valeurs, champs d'activité, engagements, équipe, transparence

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchTeamMembers } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Utils
import { IconHeart, IconGlobe, IconPeople, IconLeaf, IconGuide } from '../utils/icons'

// ── Données statiques — valeurs de l'association (contenu fixe)
const VALEURS = [
  { icon: IconHeart, titre: "Solidarité", description: "Placer l'humain au cœur de chaque action." },
  { icon: IconLeaf, titre: "Respect", description: "Respecter les cultures, les individus et l'environnement." },
  { icon: IconPeople, titre: "Échange", description: "Créer des ponts entre les peuples par le dialogue et la rencontre." },
  { icon: IconGuide, titre: "Éducation", description: "Sensibiliser et former les jeunes aux enjeux du monde." },
  { icon: IconGlobe, titre: "Responsabilité", description: "Agir durablement pour un impact positif et responsable." },
]

// ── Données statiques — champs d'activité (contenu fixe)
const ACTIVITES = [
  { titre: "Projets environnementaux", description: "Nous agissons aux côtés de nos partenaires en France et à l'international pour construire des projets concrets en faveur de l'environnement : agriculture durable, accès à l'eau, reforestation et préservation des écosystèmes." },
  { titre: "Éducation", description: "Nous accompagnons les jeunes dans la découverte des enjeux environnementaux grâce à des activités ludiques et participatives : ateliers pédagogiques, jeux, projets de correspondance et actions de sensibilisation adaptées à chaque âge." },
  { titre: "Solidarité", description: "Nous permettons à des volontaires de s'engager sur le terrain aux côtés de nos partenaires locaux. Ces expériences favorisent le partage de compétences, les rencontres humaines et une véritable ouverture sur le monde." },
  { titre: "Information", description: "Nous suivons avec attention les questions environnementales et le respect des réglementations afin d'informer, sensibiliser et encourager chacun à devenir acteur de la protection de notre planète." },
]

function APropos() {
  // ── État local — 4 membres de la direction pour l'aperçu équipe
  const [direction, setDirection] = useState([])

  // ── Chargement des membres direction depuis l'API au montage
  useEffect(() => {
    fetchTeamMembers('direction', 4)
      .then(data => setDirection(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-home.jpg"
        title="À propos de Sens Solidaire"
        subtitle="Voyager, rencontrer, partager et agir pour un monde plus solidaire."
      />

      {/* ── Notre histoire — texte + image ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex flex-col gap-6 flex-1">
            <p className="text-eyebrow text-accent-2">Notre histoire</p>
            <h2 className="h2-style text-primary">
              Une aventure humaine et solidaire <span className="text-accent-2">depuis 2007</span>
            </h2>
            <p className="text-body text-primary/80">
              Sens Solidaire est une association d'intérêt général régie par la loi 1901. Née d'une conviction simple : le voyage peut être un formidable vecteur de rencontres, d'échanges et de transformation, à condition d'être vécu dans le respect des populations et de l'environnement.
            </p>
            <p className="text-body text-primary/80">
              Depuis plus de 15 ans, nous œuvrons aux côtés des communautés locales à travers des missions de terrain, des projets solidaires et des actions d'éducation à la citoyenneté mondiale.
            </p>
            <p className="text-body text-primary/80">
              Sens Solidaire est <strong>multiculturelle, indépendante, apolitique et à vocation internationale.</strong> Nous contribuons à la préservation de l'environnement par des actions de solidarité internationale.
            </p>
          </div>
          <div className="w-full md:w-2/5 shrink-0">
            <img
              src="/images/missions/groupe-jeune-2.jpg"
              alt="Sens Solidaire sur le terrain"
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── Nos valeurs — grille 5 colonnes avec icônes ── */}
      <section className="section-padding bg-surface-mid">
        <h2 className="h2-style text-primary text-center mb-10">Nos valeurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {VALEURS.map(v => (
            <div key={v.titre} className="flex flex-col items-center gap-3 text-center">
              <v.icon className="text-accent-2 text-3xl" />
              <h3 className="h3-style text-primary">{v.titre}</h3>
              <p className="text-body text-primary/60">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Champs d'activité — grille 2 colonnes ── */}
      <section className="section-padding bg-surface">
        <h2 className="h2-style text-primary mb-2">Nos champs d'activité</h2>
        <p className="text-body text-primary/60 mb-10">Nous accompagnons les communautés locales dans la planification et l'exécution de leurs projets, en répondant à leurs besoins et en s'adaptant à leur culture.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIVITES.map(a => (
            <div key={a.titre} className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="h3-style text-primary">{a.titre}</h3>
              <p className="text-body text-primary/70">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Aperçu équipe — 4 membres direction depuis l'API ── */}
      <section className="section-padding bg-surface-mid">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-eyebrow text-accent-2 mb-2">L'équipe engagée</p>
            <h2 className="h2-style text-primary">Celles et ceux qui font vivre <span className="text-accent-2">Sens Solidaire</span></h2>
            <p className="text-body text-primary/60 mt-2">Une équipe passionnée et engagée sur le terrain comme au quotidien.</p>
          </div>
          <a href="/equipe">
            <Button label="Découvrir toute l'équipe →" variant="secondary" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {direction.map(m => (
            <div key={m.id} className="flex flex-col items-center gap-3 bg-surface rounded-2xl p-6 text-center">
              <img src={m.avatar_url || '/placeholder-testimonials.png'} alt={m.nom} className="w-20 h-20 rounded-full object-cover" />
              <p className="h3-style text-primary">{m.nom}</p>
              <p className="text-caption text-primary/60">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Transparence — texte + image + lien rapports ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-eyebrow text-accent-2">Notre engagement</p>
            <h2 className="h2-style text-primary">Transparence et confiance</h2>
            <p className="text-body text-primary/80">
              Sens Solidaire agit en toute transparence. Nos comptes sont contrôlés et nos rapports d'activité sont publiés chaque année.
            </p>
            <a href="/rapports-activite">
              <Button label="Consulter nos rapports d'activité →" variant="secondary" />
            </a>
          </div>
          <div className="w-full md:w-2/5 shrink-0">
            <img
              src="/images/equipe-et-rapports-activites/rapport-activite.png"
              alt="Rapport d'activité"
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── CTA contact ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="h2-style text-surface">Une question, une envie de collaborer avec nous ?</h2>
            <p className="text-body text-surface/80">Notre équipe est à votre écoute.</p>
          </div>
          <a href="/contact">
            <Button label="Nous contacter →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default APropos