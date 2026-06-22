// components/ui/Carousel.jsx
// Carousel réutilisable — basé sur Swiper v12 avec navigation custom
// Navigation via useRef (le module Navigation de Swiper v12 est cassé en React)
// Props :
//   items          : tableau d'éléments à afficher
//   renderSlide    : fonction de rendu pour chaque slide
//   slidesPerView  : nombre de slides visibles (défaut : 3)
//   spaceBetween   : espacement entre slides en px (défaut : 24)
//   showPagination : affiche les dots de pagination (défaut : false)
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

function Carousel({ items, renderSlide, slidesPerView = 3, spaceBetween = 24, showPagination = false, color = 'primary' }) {
  // ── Référence vers l'instance Swiper — permet d'appeler slidePrev/slideNext depuis l'extérieur
  const swiperRef = useRef(null)

  // ── Navigation masquée si le nombre d'items ne dépasse pas slidesPerView
  const hasNavigation = items.length > slidesPerView

  return (
    // ── Conteneur relatif — nécessaire pour positionner les chevrons en absolu
    <div className={`relative px-4 swiper-carousel-${color}`}>

      {/* Chevron gauche — invisible si navigation inutile */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        } ${!hasNavigation ? 'invisible' : ''}`}
      >
        <FaChevronLeft />
      </button>

      {/* Swiper — pagination conditionnelle selon showPagination et hasNavigation */}
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        pagination={showPagination && hasNavigation ? { clickable: true } : false}
        style={{ width: '100%' }}
      >
        {items.map((item, i) => (
          // ── Clé prioritaire : slug > id > index
          <SwiperSlide key={item.slug ?? item.id ?? i}>
            {renderSlide(item, i)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Chevron droit — invisible si navigation inutile */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`absolute -right-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        } ${!hasNavigation ? 'invisible' : ''}`}
      >
        <FaChevronRight />
      </button>

    </div>
  )
}

export default Carousel