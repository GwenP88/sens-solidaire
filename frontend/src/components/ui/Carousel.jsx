// components/ui/Carousel.jsx
// Carousel réutilisable — basé sur Swiper v12 avec navigation custom
// Navigation via useRef (le module Navigation de Swiper v12 est cassé en React)
// Comportement uniforme sur toutes les pages — non personnalisable, volontairement :
//   - Mobile + 768  : 1 slide visible, dots toujours affichés, pas de chevrons
//   - 1024          : 2 slides visibles, dots + chevrons si items > 2
//   - 1280+         : 3 slides visibles, dots + chevrons si items > 3
// Props :
//   items          : tableau d'éléments à afficher
//   renderSlide    : fonction de rendu pour chaque slide
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

function Carousel({ items, renderSlide, showPagination = false, color = 'primary' }) {
  // ── Référence vers l'instance Swiper — permet d'appeler slidePrev/slideNext depuis l'extérieur
  const swiperRef = useRef(null)

  // ── Chevrons visibles uniquement si assez d'items par rapport aux slides visibles à CE palier précis
  // hasNavigation1024 : palier 1024-1279px — 2 slides visibles
  // hasNavigation1280 : palier 1280px+ — 3 slides visibles
  const hasNavigation1024 = items.length > 2
  const hasNavigation1280 = items.length > 3

  // ── Classe commune des chevrons — calculée une fois, réutilisée gauche/droite
  // hidden par défaut (mobile + 768) → lg:block si nav utile à 1024 → xl:hidden si plus utile à 1280
  // (le xl:hidden est nécessaire : sans lui, un lg:block "fuiterait" et resterait visible à 1280+
  // même quand hasNavigation1280 est false)
  const chevronVisibility = `hidden ${hasNavigation1024 ? 'lg:block' : ''} ${!hasNavigation1280 ? 'xl:hidden' : ''}`

  return (
    // ── Conteneur relatif — nécessaire pour positionner les chevrons en absolu
    <div className={`relative lg:px-4 swiper-carousel-${color}`}>

      {/* ── Chevron gauche ── */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`${chevronVisibility} absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        }`}
      >
        <FaChevronLeft />
      </button>

      {/* ── Swiper — breakpoints fixes, comportement identique partout sur le site ── */}
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        loop={true}
        breakpoints={{
          0:    { slidesPerView: 1, spaceBetween: 16 },
          1024: { slidesPerView: 2, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 24 },
        }}
        pagination={showPagination ? { clickable: true } : false}
        style={{ width: '100%' }}
      >
        {items.map((item, i) => (
          // ── Clé prioritaire : slug > id > index
          <SwiperSlide key={item.slug ?? item.id ?? i}>
            {renderSlide(item, i)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Chevron droit ── */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`${chevronVisibility} absolute -right-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        }`}
      >
        <FaChevronRight />
      </button>

    </div>
  )
}

export default Carousel