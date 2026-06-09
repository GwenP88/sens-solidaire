// TestimonialCarousel.jsx
// Carousel de témoignages — Swiper v12 avec flèches custom via useRef (les flèches natives Swiper ne fonctionnent pas en React)

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/pagination'
import TestimonialCard from './TestimonialCard'

function TestimonialCarousel({ testimonials }) {
  // Référence vers l'instance Swiper pour contrôler la navigation manuellement
  const swiperRef = useRef(null)

  return (
    <div className="relative px-12">
      {/* Flèche gauche — positionnée en absolute par rapport au conteneur relative */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-surface/50 text-4xl hover:text-surface transition-colors"
      >
        <FaChevronLeft />
      </button>

      {/* Swiper — 3 slides visibles, pagination dots cliquables */}
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        slidesPerView={3}
        spaceBetween={24}
        pagination={{ clickable: true }}
      >
        {/* Génération dynamique des slides depuis le tableau testimonials */}
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <TestimonialCard {...t} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Flèche droite — positionnée en absolute par rapport au conteneur relative */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute -right-8 top-[45%] -translate-y-1/2 z-10 text-surface/50 text-4xl hover:text-surface transition-colors"
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default TestimonialCarousel