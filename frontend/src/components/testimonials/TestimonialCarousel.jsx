// TestimonialCarousel.jsx
// Carrousel de témoignages — utilise le composant Carousel générique

// ── Composants layout
import Carousel from '../ui/Carousel'
import TestimonialCard from './TestimonialCard'

function TestimonialCarousel({ testimonials }) {
  return (
    // showPagination active les dots cliquables en bas du carrousel
    <Carousel
      color="surface"
      items={testimonials}
      renderSlide={(t) => <TestimonialCard {...t} />}
      slidesPerView={3}
      spaceBetween={24}
      showPagination={true}
    />
  )
}

export default TestimonialCarousel