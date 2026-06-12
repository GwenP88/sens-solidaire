// components/ui/SwiperCarousel.jsx
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/pagination'

function Carousel({ items, renderSlide, slidesPerView = 3, spaceBetween = 24, showPagination = false, color = 'primary'  }) {
  const swiperRef = useRef(null)

  return (
    <div className={`relative px-12 swiper-carousel-${color}`}>
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`absolute -left-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        }`}
      >
        <FaChevronLeft />
      </button>

      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        modules={[Pagination]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        pagination={showPagination ? { clickable: true } : false}
        style={{ width: '100%' }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={item.slug ?? item.id ?? i}>
            {renderSlide(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`absolute -right-8 top-[45%] -translate-y-1/2 z-10 text-4xl transition-colors ${
          color === 'surface' ? 'text-surface/50 hover:text-surface' : 'text-primary/50 hover:text-primary'
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default Carousel