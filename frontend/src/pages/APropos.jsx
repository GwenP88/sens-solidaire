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
import Section from '../components/ui/Section'
import TeamMemberCard from '../components/team/TeamMemberCard'
import Carousel from '../components/ui/Carousel'

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
// ── État local — membres direction + bureau pour l'aperçu équipe
const [direction, setDirection] = useState([])
const [bureau, setBureau] = useState([])

useEffect(() => {
  fetchTeamMembers('direction', 4)
    .then(setDirection)
    .catch(console.error)
  fetchTeamMembers('bureau', 4)
    .then(setBureau)
    .catch(console.error)
}, [])

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-home.jpg"
        title="À propos de Sens Solidaires"
        subtitle="Voyager, rencontrer, partager et agir pour un monde plus solidaire."
      />

      {/* ── Notre histoire — texte + image ── */}
      <Section eyebrow="Notre histoire" title={<>Une aventure humaine et solidaire <span className="text-accent-2">depuis 2007</span></>}>
        <div className="flex flex-col xl:flex-row gap-lg items-center">
          <div className="flex flex-col gap-sm flex-1">
            <p className="text-body text-primary/80">
              Sens Solidaires est une association d'intérêt général régie par la loi 1901. Née d'une conviction simple : le voyage peut être un formidable vecteur de rencontres, d'échanges et de transformation, à condition d'être vécu dans le respect des populations et de l'environnement. Elle est également reconnue pour son engagement international à travers ses accréditations et cadres de référence, notamment auprès de l'ONU, de l'UICN et des Objectifs de Développement Durable.
            </p>
            <p className="text-body text-primary/80">
              Depuis plus de 15 ans, nous œuvrons aux côtés des communautés locales à travers des missions de terrain, des projets solidaires et des actions d'éducation à la citoyenneté mondiale. 
            </p>
            <p className="text-body text-primary/80">
              Sens Solidaires est <strong>multiculturelle, indépendante, apolitique et à vocation internationale.</strong> Nous contribuons à la préservation de l'environnement par des actions de solidarité internationale.
            </p>
          </div>
          <div className="w-full xl:w-2/5 shrink-0">
            <img
              src="/images/missions/groupe-jeune-2.jpg"
              alt="Sens Solidaires sur le terrain"
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
        </div>
      </Section>

      {/* ── Nos valeurs — scroll horizontal jusqu'à 1024, grille en 1280+ ── */}
      <Section title="Nos valeurs" bg="bg-surface-mid">
        {/* ── Mobile + 768 + 1024 — scroll horizontal avec dégradé ── */}
        <div className="relative xl:hidden">
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface-mid to-transparent z-10 pointer-events-none" />
          <div className="flex flex-row gap-md overflow-x-auto scroll-pb">
            {VALEURS.map(v => (
              <div key={v.titre} className="flex flex-col items-center gap-sm text-center shrink-0 w-[160px]">
                <v.icon className="text-accent-2 text-3xl" />
                <h3 className="h3-style text-primary">{v.titre}</h3>
                <p className="text-body text-primary/60">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop 1280+ — répartition en ligne ── */}
        <div className="hidden xl:flex flex-wrap justify-center gap-md">
          {VALEURS.map(v => (
            <div key={v.titre} className="flex flex-col items-center gap-sm text-center w-[18%]">
              <v.icon className="text-accent-2 text-3xl" />
              <h3 className="h3-style text-primary">{v.titre}</h3>
              <p className="text-body text-primary/60">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Champs d'activité — grille 2 colonnes ── */}
      <Section title="Nos champs d'activité" subtitle="Nous accompagnons les communautés locales dans la planification et l'exécution de leurs projets, en répondant à leurs besoins et en s'adaptant à leur culture.">
        <div className="grid-cards-2">
          {ACTIVITES.map(a => (
            <div key={a.titre} className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
              <h3 className="h3-style text-primary">{a.titre}</h3>
              <p className="text-body text-primary/70">{a.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Aperçu équipe — membres direction + bureau en carousel ── */}
      <Section
        bg="bg-surface-mid"
        eyebrow="L'équipe engagée"
        title={<>Celles et ceux qui font vivre <span className="text-accent-2">Sens Solidaires</span></>}
        subtitle="Une équipe passionnée et engagée sur le terrain comme au quotidien."
        cta={{ label: "Découvrir toute l'équipe →", href: "/equipe" }}
      >
        <Carousel
          items={[...direction, ...bureau]}
          renderSlide={(m) => (
            <TeamMemberCard
              variant="small"
              nom={m.nom}
              role={m.role}
              avatar={m.avatar_url}
              bg="bg-surface"
            />
          )}
          showPagination={true}
          color="primary"
        />
      </Section>

      {/* ── Transparence — texte + image + lien rapports ── */}
      <Section eyebrow="Notre engagement" title="Transparence et confiance">
        <div className="flex flex-col md:flex-row gap-lg items-center">
          <div className="flex flex-col gap-sm flex-1">
            <p className="text-body text-primary/80">
              Sens Solidaires agit en toute transparence. Nos comptes sont contrôlés et nos rapports d'activité sont publiés chaque année.
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
      </Section>

      <ScrollToTop />
    </div>
  )
}

export default APropos