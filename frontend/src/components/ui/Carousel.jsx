// components/ui/Carousel.jsx
// Carousel réutilisable — basé sur Swiper v12
// Navigation via useRef + appel direct slidePrev()/slideNext() (le module Navigation
// officiel de Swiper entre en conflit avec des boutons externes personnalisés en React)
// observer/observeParents forcent Swiper à recalculer ses positions si le DOM
// change après le montage initial (images qui finissent de charger, etc.)
// loop désactivé si pas assez de slides (sinon navigation cassée dans un sens)
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
  const swiperRef = useRef(null)

  const hasNavigation1024 = items.length > 2
  const hasNavigation1280 = items.length > 3

  // ── Boucle infinie nécessite au moins le double du nombre max de slides
  // visibles (3 à 1280px) pour un calcul de position fiable dans les 2 sens
  const canLoop = items.length >= 6

  const chevronVisibility = `hidden ${hasNavigation1024 ? 'lg:block' : ''} ${!hasNavigation1280 ? 'xl:hidden' : ''}`

  return (
    <div className={`relative lg:px-4 swiper-carousel-${color}`}>

      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        className={`${chevronVisibility} absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        }`}
      >
        <FaChevronLeft />
      </button>

      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        loop={canLoop}
        observer={true}
        observeParents={true}
        breakpoints={{
          0:    { slidesPerView: 1, spaceBetween: 16 },
          1024: { slidesPerView: 2, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 24 },
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

      <button
        type="button"
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