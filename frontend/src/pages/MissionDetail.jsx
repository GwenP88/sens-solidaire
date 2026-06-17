// MissionDetail.jsx
// Page détail d'une mission — Hero, description, rôle, programme, tarifs, lieux, témoignages

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchMissionBySlug } from '../services/api'
import { getDuration } from '../utils/missions'
import HeroPage from '../components/layout/HeroPage'
import Carousel from '../components/ui/Carousel'
import Button from '../components/ui/Button'
import TestimonialCard from '../components/testimonials/TestimonialCard'
import LocationCard from '../components/locations/LocationCard'
import SectionHero from '../components/ui/SectionHero'
import AnchorNav from '../components/navigation/AnchorNav'
import ScrollToTop from '../components/ui/ScrollToTop'
import { IconClock, IconPin, IconMoney, IconFlight, IconContact, IconBooking, IconPayment, IconContract, IconGuide, IconFileMission, IconCheck, IconTimes, } from '../utils/icons'

// Icônes et labels fixes pour la section "Comment partir"
const HOW_TO_GO_ICONS = [IconFlight, IconContact, IconBooking, IconPayment, IconContract, IconGuide, IconFileMission]

function MissionDetail() {
  const { slug } = useParams()
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMission = async () => {
      try {
        const data = await fetchMissionBySlug(slug)
        setMission(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMission()
  }, [slug])

  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error) return <p className="p-12 font-body text-accent">Erreur : {error}</p>
  if (!mission) return null

  // Parse how_to_go JSON
  const howToGoSteps = mission.how_to_go ? JSON.parse(mission.how_to_go) : []

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero ── */}
      <HeroPage
        image={mission.image_url}
        title={mission.title}
        subtitle={mission.short_description}
        duration={getDuration(mission.pricing)}
        price={mission.pricing?.sort((a, b) => a.display_order - b.display_order)[0]?.price || null}
      />

      <AnchorNav
        variant="dark"
        sections={[
          { label: "La mission", id: "description" },
          { label: "Rôle & Programme", id: "role-programme" },
          { label: "Lieux partenaires", id: "lieux" },
          { label: "Impact terrain", id: "impact" },
          { label: "Coût & durée", id: "cout" },
          { label: "Comment partir", id: "comment-partir" },
          { label: "Infos pratiques", id: "infos-pratiques" },
          { label: "Témoignages", id: "temoignages" },
          { label: "Galerie", id: "galerie" },
        ]} />

      {/* ── Description + accroche + rôle + image ── */}
      {mission.description && (
        <section id="description" className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-4">{mission.title}</h2>
          <div className="flex gap-12 items-start">

            {/* 2/3 texte */}
            <div className="flex flex-col gap-10 w-2/3">
              
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                {mission.description}
              </p>

              {/* Accroche fixe */}
              <h3 className="font-heading font-bold text-primary text-base mb-2">
                De nombreux volontaires ont déjà sauté le pas…
              </h3>
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Découvrez la satisfaction de participer à des projets porteurs de sens. Que vous soyez étudiant, en activité ou retraité, aucun diplôme particulier n'est requis : nous recherchons avant tout des personnes motivées, ouvertes aux autres et désireuses de s'engager. Au cours de votre mission, vous vivrez une expérience humaine enrichissante au contact des populations locales, découvrirez une nouvelle culture et contribuerez concrètement à des actions solidaires, éducatives ou environnementales.
              </p>
            </div>

            {/* 1/3 image */}
            <div className="w-1/3 shrink-0">
              <img
                src={mission.image_url}
                alt={mission.title}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Rôle + Programme côte à côte ── */}
      {(mission.volunteer_role || mission.programme) && (
        <section id="role-programme" className="section-padding bg-surface">
          <div className="flex gap-12 items-start">

            {/* Rôle du volontaire — 2/5 */}
            {mission.volunteer_role && (
              <div className="w-2/5">
                <h2 className="section-title text-primary mb-4">Votre rôle sur le terrain</h2>
                <div
                  className="font-body text-sm text-primary/80 leading-relaxed rich-text"
                  dangerouslySetInnerHTML={{ __html: mission.volunteer_role }}
                />
              </div>
            )}

            {/* Programme — 3/5 */}
            {mission.programme && (
            <div className="w-3/5">
              <h2 className="section-title text-primary mb-4">Programme de volontariat</h2>
              <div className="flex flex-col gap-1">
                {mission.programme.split('\n').map((line, i) => {
                  if (!line.trim()) return null
                  const [label, ...rest] = line.split(':')
                  const content = rest.join(':').trim()
                  return (
                    <div key={i} className="flex items-stretch border-l-4 border-accent rounded-r-xl overflow-hidden">
                      <span className="font-body text-sm font-semibold text-accent bg-surface-dark px-4 py-3 shrink-0 w-32 flex items-center">
                        {label.trim()}
                      </span>
                      <span className="font-body text-sm text-primary/80 bg-surface-mid px-5 py-3 leading-relaxed flex-1 flex items-center">
                        {content}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 border border-surface-dark rounded-xl px-5 py-4">
                <p className="font-body text-xs text-primary/40 italic">
                  La nature exacte de la mission dépendra des priorités du moment sur le terrain.
                </p>
              </div>
            </div>
          )}
          </div>
        </section>
      )}

    {/* ── Lieux ── */}
    {mission.location?.length > 0 && (
      <section id="lieux" className="section-padding bg-surface-mid">
        <div className="flex items-end justify-between gap-12 mb-6">
          <div>
            <h2 className="section-title text-primary mb-2">Nos lieux partenaires</h2>
            <p className="font-body text-sm text-primary/60 mb-8">Nos partenaires locaux sont au cœur de chaque mission. Engagés dans la protection de la biodiversité et le développement des communautés, ils accueillent les volontaires et les accompagnent tout au long de leur expérience sur le terrain.</p>
          </div>
          <div className="w-1/4 shrink-0">
            <img src="/images/one-line-3.png" alt="" aria-hidden="true" className="w-full object-contain max-h-40" />
          </div>
        </div>
        <Carousel
          items={mission.location}
          slidesPerView={3}
          spaceBetween={24}
          showPagination={true}
          color="primary"
          renderSlide={(loc) => <LocationCard {...loc} />}
        />
      </section>
    )}

      {/* ── Actions terrain ── */}
      <section id="impact" className="section-padding bg-surface">

        {/* En-tête */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex flex-col gap-2 max-w-4xl">
            <h2 className="section-title text-primary mb-4">Votre impact sur le terrain</h2>
            <p className="font-body text-sm text-primary/60">
              Depuis plus de 20 ans, des centaines de volontaires mettent leur temps, leur énergie et leurs compétences au service de projets portés par nos partenaires locaux. Ensemble, ils participent à des initiatives concrètes qui bénéficient à la fois aux communautés, à l'environnement et aux générations futures.
            </p>
          </div>
          {/* TODO V2 : lien vers /actions?country=:country */}
          <Button label="Voir toutes les actions →" variant="secondary" />
        </div>

        {/* TODO V2 : remplacer par GET /api/actions?mission_id=:id&limit=6 */}
        <div className="flex gap-12 items-center">
          <div className="w-1/2 shrink-0">
            <img
              src={mission.image_url}
              alt={mission.country}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          <div className="w-1/2 flex items-center justify-center bg-surface-mid rounded-xl h-64">
            <p className="font-body text-sm text-primary/40 italic text-center px-8">
              Nous préparons actuellement la présentation des actions menées avec nos partenaires au {mission.country}. Revenez bientôt pour les découvrir.
            </p>
          </div>
        </div>

      </section>

      {/* cout / durée */}
      {mission.pricing?.length > 0 && (
        <section id="cout" className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-4">Durée du séjour & participation</h2>
          <p className="font-body text-sm text-primary/60 mb-8">
            Choisissez la durée de séjour qui correspond le mieux à vos disponibilités et à votre projet d'engagement. Les frais de mission contribuent directement à l'organisation du séjour, à l'encadrement des volontaires et au soutien des actions menées sur le terrain.
          </p>

          <div className="grid grid-cols-3 gap-8 items-stretch">

            {/* Ligne 1 col 1 — Tableau tarifs */}
            <div className="flex flex-col bg-surface rounded-xl p-4">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-surface-dark">
                    <th className="text-left py-2 text-primary font-semibold flex items-center gap-3">
                      <IconClock className="text-accent" /> Durée
                    </th>
                    <th className="text-right py-2 text-primary font-semibold">
                      <span className="flex items-center justify-end gap-3">
                        <IconMoney className="text-accent" /> Prix
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mission.pricing
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((p) => (
                      <tr key={p.id} className="border-b border-surface-dark/50">
                        <td className="py-3 text-primary/80">{p.duration_label}</td>
                        <td className="py-3 text-right font-semibold text-primary">
                          {p.price > 0 ? `${p.price} €` : 'Nous contacter'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Ligne 1 col 2 — Inclus / Non inclus */}
            <div className="flex flex-col justify-between self-stretch gap-6">
              {mission.included && (
                <div>
                  <h3 className="font-heading font-bold text-primary text-base mb-2 flex items-center gap-2">
                    <IconCheck className="text-accent-2" /> Inclus
                  </h3>
                  <p className="font-body text-sm text-primary/80 leading-relaxed">{mission.included}</p>
                </div>
              )}
              {mission.not_include && (
                <div>
                  <h3 className="font-heading font-bold text-primary text-base mb-2 flex items-center gap-2">
                    <IconTimes className="text-accent" /> Non inclus
                  </h3>
                  <p className="font-body text-sm text-primary/80 leading-relaxed">{mission.not_include}</p>
                </div>
              )}
            </div>

            {/* Ligne 1 col 3 — CTAs */}
            <div className="h-full flex flex-col gap-4 justify-between">
              <div className="bg-surface rounded-xl p-4 flex flex-col gap-3">
                <p className="font-heading font-bold text-primary text-base">Prêt à vous engager ?</p>
                <a href={mission.helloasso_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button label="Je pars en mission →" variant="primary" fullWidth />
                </a>
              </div>
              <div className="bg-surface rounded-xl p-4 flex flex-col gap-3">
                <p className="font-heading font-bold text-primary text-base">Besoin de plus d'informations ?</p>
                <Button label="Nous contacter →" variant="secondary" fullWidth />
              </div>
            </div>

            {/* Ligne 2 — À quoi servent les frais (3 col) */}
            <div className="col-span-3 grid grid-cols-3 gap-8 pt-6 border-t border-surface-dark">

              {/* Col 1 — Titre + texte intro */}
              <div className="flex flex-col gap-3">
                <h3 className="font-heading font-bold text-primary text-base mb-2">
                  À quoi servent les frais de mission ?
                </h3>
                <p className="font-body text-sm text-primary/60 leading-relaxed">
                  Chez Sens Solidaire, nous avons à cœur de vous informer en toute transparence sur l'utilisation des fonds qui soutiennent nos actions sur le terrain.
                </p>
              </div>

              {/* Col 2 — 30-40% */}
              <div className="bg-accent-2/10 rounded-xl p-4">
                <p className="font-heading font-bold text-accent-2 text-2xl">30 – 40 %</p>
                <p className="font-body text-sm text-primary/60 mt-2">
                  Préparation des missions, accompagnement des volontaires, suivi des projets et fonctionnement de l'association.
                </p>
              </div>

              {/* Col 3 — 60-70% */}
              <div className="bg-accent-2/10 rounded-xl p-4">
                <p className="font-heading font-bold text-accent-2 text-2xl">60 – 70 %</p>
                <p className="font-body text-sm text-primary/60 mt-2">
                  Reversés aux partenaires locaux : hébergement, repas, transports, équipes locales et projets terrain.
                </p>
              </div>

            </div>

            {/* Ligne 3 — Mention fiscale (3 col) */}
            <div className="col-span-3">
              <p className="font-body text-xs text-primary/40 italic">
                Conformément aux articles 200 et 238 bis du CGI, 66 % du montant engagé est déductible de vos impôts. Un reçu fiscal vous sera délivré à l'issue de votre mission.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* ── Comment partir ── */}
      {howToGoSteps.length > 0 && (
        <section id="comment-partir" className="section-padding bg-surface">
          <h2 className="section-title text-primary mb-4">Comment partir ?</h2>
          <p className="font-body text-sm text-primary/60 mb-8">
            Nous accueillons des volontaires toute l'année. Ensemble, nous définissons la période de départ la plus adaptée à votre projet, à vos disponibilités et aux besoins de nos partenaires sur le terrain.
          </p>
          <div className="flex items-start gap-2">
            {howToGoSteps.map((step, i) => {
              const Icon = HOW_TO_GO_ICONS[i]
              return (
                <div key={i} className="flex items-start gap-2 flex-1">
                  <div className="flex flex-col items-center gap-3 flex-1">
                    {/* Cercle icône */}
                    <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0">
                      <Icon className="text-primary/80 text-xl" />
                    </div>
                    {/* Numéro + label */}
                    <p className="font-heading font-bold text-primary/80 text-xs text-center">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="font-body text-xs text-primary/60 text-center leading-tight">
                      {step}
                    </p>
                  </div>
                  {/* Flèche entre étapes */}
                  {i < howToGoSteps.length - 1 && (
                    <span className="text-primary/40 text-lg mt-4 shrink-0">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Infos pratiques ── */}
      {(mission.health_info || mission.admin_info) && (
        <section id="infos-pratiques" className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-4">Préparer votre départ</h2>
          <p className="font-body text-sm text-primary/60 mb-8">Pour vivre cette expérience dans les meilleures conditions, prenez le temps de préparer votre départ grâce à nos recommandations et informations pratiques</p>
          <div className="flex gap-8">
            {mission.health_info && (
              <div className="flex-1 bg-surface rounded-xl p-6">
                <h3 className="font-heading font-bold text-primary text-base mb-2">Avant le départ : santé & prévention</h3>
                <div
                  className="font-body text-sm text-primary/80 leading-relaxed rich-text"
                  dangerouslySetInnerHTML={{ __html: mission.health_info }}
                />
              </div>
            )}
            {mission.admin_info && (
              <div className="flex-1 bg-surface rounded-xl p-6">
                <h3 className="font-heading font-bold text-primary text-base mb-2">Avant de prendre votre envol</h3>
                <div
                  className="font-body text-sm text-primary/80 leading-relaxed rich-text"
                  dangerouslySetInnerHTML={{ __html: mission.admin_info }}
                />
              </div>
            )}
          </div>
          
          {/* PDF + Ministère */}
          <div className="mt-8 flex gap-6">
            <div className="flex-1 bg-surface rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-primary text-base">Guide du volontaire</p>
                <p className="font-body text-sm text-primary/60">Votre guide complet pour préparer votre mission.</p>
              </div>
              <Button label="Télécharger ↓" variant="secondary" />
            </div>

            <div className="flex-1 bg-surface rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-primary text-base">Recommandations officielles</p>
                <p className="font-body text-sm text-primary/60">Consultez les informations officielles avant votre départ.</p>
              </div>
              <a href={mission.ministry_url || '#'} target="_blank" rel="noopener noreferrer">
                <Button label="Consulter →" variant="secondary" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Témoignages ── */}
      {mission.testimonials?.length > 0 && (
        <section id="temoignages" className="section-padding bg-accent-2">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="section-title text-surface mb-4">Ils ont vécu l'aventure, découvrez leurs témoignages</h2>
              <p className="font-body text-sm text-surface/60">Chaque mission est une expérience unique. Découvrez les récits de volontaires partis avant vous, leurs rencontres, leurs découvertes et l'impact de leur engagement sur le terrain.</p>
            </div>
            <a href="/temoignages">
              <Button label="Voir tous les témoignages →" variant="secondary" />
            </a>
          </div>
          <Carousel
            items={mission.testimonials}
            renderSlide={(t) => <TestimonialCard {...t} />}
            slidesPerView={3}
            spaceBetween={24}
            showPagination={true}
            color="surface"
          />
        </section>
      )}

      {/* ── Galerie photos ── */}
      <section id="galerie" className="section-padding bg-surface-mid">
        <h2 className="section-title text-primary mb-4">Plongez dans l'aventure</h2>
        <p className="font-body text-sm text-primary/60 mb-8">Explorez la mission à travers les images de nos volontaires et découvrez l'environnement, les projets et les expériences qui vous attendent sur le terrain.</p>
        {/* TODO V2 : remplacer par GET /api/media?entity_type=mission&entity_id=:id&file_type=image */}
        <Carousel
          items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          slidesPerView={3}
          spaceBetween={16}
          showPagination={true}
          color="primary"
          renderSlide={() => (
            <div className="w-full h-56 bg-surface rounded-xl flex items-center justify-center">
              <p className="font-body text-xs text-primary/40 italic">Photo à venir</p>
            </div>
          )}
        />
      </section>
      <ScrollToTop />
    </div>
  )
}

export default MissionDetail