// components/ui/Carousel.jsx
// Carousel réutilisable — basé sur Swiper v12 avec navigation custom
// Navigation via useRef (le module Navigation de Swiper v12 est cassé en React)
// Comportement uniforme sur toutes les pages :
//   - Mobile + 768  : 1 slide visible, dots toujours affichés
//   - 1024          : 2 slides visibles, dots + chevrons si items > 2
//   - 1280+         : slidesPerView slides, dots + chevrons si items > slidesPerView
// Props :
//   items          : tableau d'éléments à afficher
//   renderSlide    : fonction de rendu pour chaque slide
//   slidesPerView  : nombre de slides visibles sur desktop (défaut : 3)
//   spaceBetween   : espacement entre slides en px (défaut : 24)
//   showPagination : affiche les dots (défaut : false)
//   color          : "primary" (défaut) | "surface" — couleur des chevrons et dots

// ── React
import { useRef } from 'react'

// ── Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

// ── Icônes
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function Carousel({ items, renderSlide, slidesPerView = 3, spaceBetween = 24, showPagination = false, color = 'primary', customBreakpoints = null }) {
  // ── Référence vers l'instance Swiper
  const swiperRef = useRef(null)

  // ── Chevrons visibles si assez d'items par rapport aux slides visibles
  const hasNavigationDesktop = items.length > slidesPerView  // 1280+
  const hasNavigationTablet  = items.length > 2              // 1024

  return (
    <div className={`relative px-4 swiper-carousel-${color}`}>

      {/* ── Chevron gauche — 1024+ uniquement ── */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`hidden lg:block absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        } ${!hasNavigationTablet ? 'invisible' : ''}`}
      >
        <FaChevronLeft />
      </button>

      {/* ── Swiper ── */}
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        loop={true}
        breakpoints={{
          0:    { slidesPerView: 1,            spaceBetween: 16 },
          1024: { slidesPerView: 2,            spaceBetween: 20 },
          1280: { slidesPerView: slidesPerView, spaceBetween: spaceBetween },
        }}
        breakpoints={customBreakpoints ?? {
          0:    { slidesPerView: 1, spaceBetween: 16 },
          1024: { slidesPerView: 2, spaceBetween: 20 },
          1280: { slidesPerView: slidesPerView, spaceBetween: spaceBetween },
        }}
        pagination={showPagination ? { clickable: true } : false}
        style={{ width: '100%' }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={item.slug ?? item.id ?? i}>
            {renderSlide(item, i)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Chevron droit — 1024+ uniquement ── */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`hidden lg:block absolute -right-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        } ${!hasNavigationTablet ? 'invisible' : ''}`}
      >
        <FaChevronRight />
      </button>

    </div>
  )
}

export default Carousel