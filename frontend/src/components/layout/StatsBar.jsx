// StatsBar.jsx
// Barre de statistiques d'impact — carousel horizontal sur mobile, ligne sur desktop

// ── React
import React from 'react'

// ── Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

// ── Données statiques — chiffres clés (contenu fixe, mis à jour manuellement)
const STATS = [
  { number: '120+', label: "Actions réalisées" },
  { number: '10 000+', label: "Bénéficiaires" },
  { number: '20+', label: "Ans d'expérience" },
  { number: '12 000+', label: "Jeunes sensibilisés" },
  { number: '1 800+', label: "Arbres plantés" },
]

function StatsBar() {
  return (
    <div className="bg-primary py-6 padding-x">

      {/* ── Mobile — carousel autoplay ── */}
      <div className="lg:hidden flex items-center justify-center">
        <Swiper
          className="stats-swiper"
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={16}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          speed={800}
          loop={true}
          style={{ height: 'auto' }}
        >
          {STATS.map(stat => (
            <SwiperSlide key={stat.number}>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-stat text-surface">{stat.number}</p>
                <p className="text-label text-surface-dark">{stat.label}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── Desktop — ligne horizontale avec séparateurs ── */}
      <div className="hidden lg:flex justify-around items-center">
        {STATS.map((stat, i) => (
          <React.Fragment key={stat.number}>
            <div className="flex flex-col items-center text-center">
              <p className="text-stat text-surface">{stat.number}</p>
              <p className="text-label text-surface-dark">{stat.label}</p>
            </div>
            {i < STATS.length - 1 && (
              <div key={`sep-${i}`} className="w-px h-12 bg-surface/20" />
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
  )
}

export default StatsBar