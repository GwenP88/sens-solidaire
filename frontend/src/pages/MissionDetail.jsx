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
import { IconClock, IconPin, IconMoney, IconFlight, IconContact, IconBooking, IconPayment, IconContract, IconGuide, IconFileMission } from '../utils/icons'

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
        subtitle={mission.country}
        duration={getDuration(mission.pricing)}
        price={mission.pricing?.sort((a, b) => a.display_order - b.display_order)[0]?.price || null}
      />

      {/* ── Description + accroche + rôle + image ── */}
      {mission.description && (
        <section className="section-padding bg-surface">
          <h2 className="section-title text-primary">Une mission au cœur de la biodiversité kényane</h2>
          <div className="flex gap-12 items-start">

            {/* 2/3 texte */}
            <div className="flex flex-col gap-6 w-2/3">
              
              <p className="font-body text-primary/80 text-base leading-relaxed">
                {mission.description}
              </p>

              {/* Accroche fixe */}
              <h3 className="font-heading font-bold text-primary text-xl">
                De nombreux volontaires ont déjà sauté le pas…
              </h3>
              <p className="font-body text-primary/80 text-base leading-relaxed">
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
        <section className="section-padding bg-surface-mid">
          <div className="flex gap-12 items-start">

            {/* Rôle du volontaire — 1/2 */}
            {mission.volunteer_role && (
              <div className="flex-1">
                <h2 className="section-title text-primary mb-6">Votre rôle sur le terrain</h2>
                <div
                  className="font-body text-sm text-primary/80 leading-relaxed rich-text"
                  dangerouslySetInnerHTML={{ __html: mission.volunteer_role }}
                />
              </div>
            )}

            {/* Programme — 1/2 */}
            {mission.programme && (
              <div className="flex-1">
                <h2 className="section-title text-primary mb-6">Programme de volontariat</h2>
                <div className="flex flex-col gap-3">
                  {mission.programme.split('\n').map((line, i) => (
                    line.trim() && (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="font-body text-sm font-semibold text-accent shrink-0 w-28">
                          {line.split(':')[0]}
                        </span>
                        <span className="font-body text-sm text-primary/80">
                          {line.split(':').slice(1).join(':').trim()}
                        </span>
                      </div>
                    )
                  ))}
                </div>
                <p className="font-body text-xs text-primary/50 italic mt-6">
                  La nature exacte de la mission dépendra des priorités du moment sur le terrain.
                </p>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── Coût & durée + Inclus + Frais ── */}
      {mission.pricing?.length > 0 && (
        <section className="section-padding bg-surface">
          <h2 className="section-title text-primary mb-6">Coût & durée</h2>
          <div className="flex gap-8 items-start">

            {/* Colonne 1 — Tableau tarifs */}
            <div className="flex-1">

              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-surface-dark">
                    <th className="text-left py-3 text-primary font-semibold">Durée</th>
                    <th className="text-right py-3 text-primary font-semibold">Prix</th>
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

            {/* Colonne 2 — Inclus / Non inclus */}
            <div className="flex-1 flex flex-col gap-6">
              {mission.included && (
                <div>
                  <h3 className="font-heading font-bold text-primary text-base mb-3">✓ Inclus</h3>
                  <p className="font-body text-sm text-primary/80 leading-relaxed">{mission.included}</p>
                </div>
              )}
              {mission.not_include && (
                <div>
                  <h3 className="font-heading font-bold text-primary text-base mb-3">✗ Non inclus</h3>
                  <p className="font-body text-sm text-primary/80 leading-relaxed">{mission.not_include}</p>
                </div>
              )}
            </div>

            {/* Colonne 3 — Répartition des frais */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-primary text-base">
                À quoi servent les frais de mission ?
              </h3>
              <p className="font-body text-xs text-primary/70 leading-relaxed">
                Sens Solidaires s'engage à une totale transparence sur l'utilisation des fonds versés par les volontaires.
              </p>
              <div className="flex flex-col gap-3">
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="font-heading font-bold text-accent text-2xl">30 – 40 %</p>
                  <p className="font-body text-xs text-primary/70 mt-1">
                    Préparation des missions, accompagnement des volontaires, suivi des projets et fonctionnement de l'association.
                  </p>
                </div>
                <div className="bg-accent-2/10 rounded-lg p-4">
                  <p className="font-heading font-bold text-accent-2 text-2xl">60 – 70 %</p>
                  <p className="font-body text-xs text-primary/70 mt-1">
                    Reversés aux partenaires locaux : hébergement, repas, transports, équipes locales et projets terrain.
                  </p>
                </div>
              </div>
              <p className="font-body text-xs text-primary/50 italic">
                Conformément aux articles 200 et 238 bis du CGI, 66 % du montant engagé est déductible de vos impôts. Un reçu fiscal vous sera délivré à l'issue de votre mission.
              </p>
            </div>

          </div>
          {/* CTA bas de section */}
<div className="flex gap-8 mt-10">
  <div className="flex-1 bg-primary rounded-xl p-6 flex flex-col gap-4">
    <p className="font-heading font-bold text-surface text-lg">Prêt à vous engager ?</p>
    <p className="font-body text-sm text-surface/70">
      Rejoignez les volontaires qui ont déjà vécu cette expérience unique.
    </p>
    <Button label="Je m'inscris →" variant="primary" fullWidth />
  </div>
  <div className="flex-1 bg-surface-mid rounded-xl p-6 flex flex-col gap-4">
    <p className="font-heading font-bold text-primary text-lg">Une question avant de partir ?</p>
    <p className="font-body text-sm text-primary/70">
      Notre équipe répond à toutes vos questions sur la mission.
    </p>
    <a href={mission.helloasso_url} target="_blank" rel="noopener noreferrer" className="block w-full">
      <Button label="Candidater sur HelloAsso →" variant="secondary" fullWidth />
    </a>
  </div>
</div>
        </section>
      )}

      {/* ── Comment partir ── */}
      {howToGoSteps.length > 0 && (
        <section className="section-padding bg-surface">
          <h2 className="section-title text-primary mb-2">Comment partir ?</h2>
          <p className="font-body text-sm text-primary/60 mb-10">
            Les départs sont ouverts toute l'année — vous choisissez vos dates.
          </p>
          <div className="flex items-start gap-2">
            {howToGoSteps.map((step, i) => {
              const Icon = HOW_TO_GO_ICONS[i]
              return (
                <div key={i} className="flex items-start gap-2 flex-1">
                  <div className="flex flex-col items-center gap-3 flex-1">
                    {/* Cercle icône */}
                    <div className="w-14 h-14 rounded-full border-2 border-surface-dark flex items-center justify-center shrink-0">
                      <Icon className="text-primary text-xl" />
                    </div>
                    {/* Numéro + label */}
                    <p className="font-heading font-bold text-primary text-xs text-center">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="font-body text-xs text-primary/70 text-center leading-tight">
                      {step}
                    </p>
                  </div>
                  {/* Flèche entre étapes */}
                  {i < howToGoSteps.length - 1 && (
                    <span className="text-surface-dark text-lg mt-4 shrink-0">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Infos pratiques ── */}
      {(mission.health_info || mission.admin_info) && (
        <section className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-8">Infos pratiques</h2>
          <div className="flex gap-8">
            {mission.health_info && (
              <div className="flex-1 bg-white rounded-xl p-6">
                <h3 className="font-heading font-bold text-primary text-lg mb-3">Santé & vaccins</h3>
                <p className="font-body text-sm text-primary/80 leading-relaxed">{mission.health_info}</p>
              </div>
            )}
            {mission.admin_info && (
              <div className="flex-1 bg-white rounded-xl p-6">
                <h3 className="font-heading font-bold text-primary text-lg mb-3">À savoir avant de partir</h3>
                <p className="font-body text-sm text-primary/80 leading-relaxed">{mission.admin_info}</p>
              </div>
            )}
          </div>
          {/* PDF placeholder */}
          <div className="mt-8 bg-white rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-primary">Conseils pratiques PDF</p>
              <p className="font-body text-sm text-primary/50">Guide complet de préparation à la mission</p>
            </div>
            {/* TODO : remplacer par GET /api/media?entity_type=mission&entity_id=:id&file_type=pdf */}
            <Button label="Télécharger ↓" variant="secondary" />
          </div>
        </section>
      )}

      {/* ── Lieux partenaires ── */}
      {mission.location?.length > 0 && (
        <section className="section-padding bg-surface">
          <h2 className="section-title text-primary mb-8">Nos lieux partenaires</h2>
          <div className="flex gap-8 items-start">
            {/* Liste des lieux — même style que section Groupe jeune */}
            <div className="flex flex-col gap-4 flex-1">
              {mission.location.map((loc) => (
                <div key={loc.slug} className="flex items-center justify-between bg-surface-mid rounded-xl px-6 py-4">
                  <div className="flex items-center gap-4">
                    <IconPin className="text-accent text-lg shrink-0" />
                    <div>
                      <p className="font-body font-semibold text-primary text-sm">{loc.name}</p>
                      <p className="font-body text-xs text-primary/50">{loc.country}</p>
                    </div>
                  </div>
                  <Link to={`/lieux/${loc.slug}`}>
                    <span className="font-body text-sm font-semibold text-accent hover:text-primary transition-colors">
                      En savoir plus →
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            {/* CTA contact */}
            <div className="flex flex-col gap-4 w-1/4 shrink-0 bg-surface-mid rounded-xl p-6">
              <p className="font-heading font-bold text-primary text-lg">Une question ?</p>
              <p className="font-body text-sm text-primary/70">
                Notre équipe est là pour vous accompagner dans votre projet.
              </p>
              <Button label="Nous contacter →" variant="secondary" />
            </div>
          </div>
        </section>
      )}

      {/* ── Actions terrain placeholder ── */}
      {/* TODO : remplacer par GET /api/actions?country=:country&limit=6 */}
      <section className="section-padding bg-surface-mid">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-primary">Actions terrain au {mission.country}</h2>
          <Button label="Voir toutes les actions →" variant="secondary" />
        </div>
        <p className="font-body text-sm text-primary/50 italic">
          Les actions terrain seront affichées ici prochainement.
        </p>
      </section>

      {/* ── Témoignages ── */}
      {mission.testimonials?.length > 0 && (
        <section className="section-padding bg-primary">
          <h2 className="section-title text-surface mb-10">Ils sont partis, ils témoignent</h2>
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

    </div>
  )
}

export default MissionDetail