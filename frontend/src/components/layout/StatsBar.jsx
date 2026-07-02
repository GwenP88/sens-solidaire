// StatsBar.jsx
// Barre de statistiques d'impact — carousel horizontal sur mobile, ligne sur desktop
// Animation count-up sur desktop uniquement (1024+), déclenchée une seule fois au scroll

// ── React
import React, { useRef } from 'react'

// ── Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

// ── Hook
import useCountUp from '../../hooks/useCountUp'

// ── Données statiques — chiffres clés (mis à jour manuellement)
// value : valeur numérique cible pour l'animation
// suffix : texte affiché après le chiffre animé
const STATS = [
  { value: 120, suffix: '+', label: "Actions réalisées" },
  { value: 10000, suffix: '+', label: "Bénéficiaires" },
  { value: 20, suffix: '+', label: "Ans d'expérience" },
  { value: 12000, suffix: '+', label: "Jeunes sensibilisés" },
  { value: 1800, suffix: '+', label: "Arbres plantés" },
]

// ── Composant individuel pour chaque stat — gère son propre ref et animation
function StatItem({ stat, animate }) {
  const ref = useRef(null)
  const count = useCountUp(stat.value, 2200, animate ? ref : null)

  // ── Format avec séparateur de milliers
  const formatted = animate
    ? count.toLocaleString('fr-FR') + stat.suffix
    : stat.value.toLocaleString('fr-FR') + stat.suffix

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <p className="text-stat text-surface">{formatted}</p>
      <p className="text-label text-surface-dark">{stat.label}</p>
    </div>
  )
}

function StatsBar() {
  return (
    <div className="bg-primary py-6 padding-x">

      {/* ── Mobile + 768 — carousel autoplay, pas d'animation count-up ── */}
      <div className="lg:hidden flex items-center justify-center">
        <Swiper
          className="stats-swiper"
          modules={[Autoplay]}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
          }}
          spaceBetween={16}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          speed={800}
          loop={true}
          style={{ height: 'auto' }}
        >
          {STATS.map(stat => (
            <SwiperSlide key={stat.label}>
              <StatItem stat={stat} animate={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── Desktop 1024+ — ligne horizontale avec animation count-up ── */}
      <div className="hidden lg:flex justify-around items-center">
        {STATS.map((stat, i) => (
          <React.Fragment key={stat.label}>
            <StatItem stat={stat} animate={true} />
            {i < STATS.length - 1 && (
              <div className="w-px h-12 bg-surface/20" />
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
  )
}

export default StatsBar