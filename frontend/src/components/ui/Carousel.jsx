// components/ui/Carousel.jsx
// Carousel réutilisable — basé sur Swiper v12 avec navigation custom
// Navigation via useRef (le module Navigation de Swiper v12 est cassé en React)
// Sur mobile : autoplay sans chevrons + dots uniquement
// Sur desktop : chevrons + dots selon props

// ── React
import { useRef } from 'react'

// ── Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

// ── Icônes
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function Carousel({ items, renderSlide, slidesPerView = 3, spaceBetween = 24, showPagination = false, color = 'primary' }) {
  // ── Référence vers l'instance Swiper
  const swiperRef = useRef(null)

  // ── Navigation masquée si le nombre d'items ne dépasse pas slidesPerView
  const hasNavigation = items.length > slidesPerView

  return (
    <div className={`relative px-4 swiper-carousel-${color}`}>

      {/* Chevrons — desktop uniquement */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`hidden md:block absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        } ${!hasNavigation ? 'invisible' : ''}`}
      >
        <FaChevronLeft />
      </button>

      {/* Swiper */}
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        loop={true}
        breakpoints={{
          0:    { slidesPerView: 1, spaceBetween: 16 },
          640:  { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: slidesPerView, spaceBetween: spaceBetween },
        }}
        pagination={showPagination && hasNavigation ? { clickable: true } : false}
        style={{ width: '100%' }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={item.slug ?? item.id ?? i}>
            {renderSlide(item, i)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Chevron droit — desktop uniquement */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`hidden md:block absolute -right-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        } ${!hasNavigation ? 'invisible' : ''}`}
      >
        <FaChevronRight />
      </button>

    </div>
  )
}

export default Carousel