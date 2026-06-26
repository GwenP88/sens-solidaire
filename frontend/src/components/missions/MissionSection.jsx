// MissionSection.jsx
// Section complète d'un type de mission — structure identique pour les 4 types

// ── Composants UI
import SectionHero from '../ui/SectionHero'
import Carousel from '../ui/Carousel'
import MissionInfoBar from './MissionInfoBar'
import MissionCTA from './MissionCTA'
import MissionSteps from './MissionSteps'

function MissionSection({
  // ── Identité de la section
  id,
  bg = 'bg-surface',

  // ── SectionHero
  title,
  audience,
  description,
  decorImage,

  // ── Bloc intro — contenu riche + image + infobar + CTA
  introSlot,
  image,
  imageAlt,
  infoBarItems,
  primaryAction,
  testimonialsUrl,

  // ── Steps
  stepsTitle,
  steps,
  bgCard = 'bg-white',

  // ── Carousel
  carouselItems,
  carouselTitle,
  carouselSubtitle,
  carouselSlidesPerView = 3,
  renderSlide,

  // ── Bloc additionnel optionnel
  children,
}) {
  return (
    <section id={id} className={`section-padding ${bg}`}>

      {/* ── En-tête de section ── */}
      <SectionHero
        title={title}
        audience={audience}
        description={description}
        image={decorImage}
      />

      {/* Image mobile+768+1024 — pleine largeur ── */}
      {image && (
        <div className="block xl:hidden w-full mb-6">
          <img src={image} alt={imageAlt} className="w-full h-72 object-cover rounded-xl" />
        </div>
      )}

      {/* ── Bloc intro — contenu riche + infobar + CTA + image — empilés sur mobile ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center mb-10 lg:mb-16">
        <div className="flex flex-col gap-6 flex-1">

          {/* Contenu riche — texte, listes, paragraphes... */}
          {introSlot}

          {/* Barre d'infos clés */}
          {infoBarItems && <MissionInfoBar items={infoBarItems} />}

          {/* CTAs */}
          <MissionCTA
            primaryAction={primaryAction}
            testimonialsUrl={testimonialsUrl}
          />
        </div>

        {/* Image — visible uniquement sur desktop ── */}
        {image && (
          <div className="hidden xl:block xl:w-2/5 shrink-0">
            <img src={image} alt={imageAlt} className="w-full h-72 object-cover rounded-xl" />
          </div>
        )}
      </div>

      {/* ── Steps ── */}
      {steps && (
        <MissionSteps
          title={stepsTitle}
          bgCard={bgCard}
          steps={steps}
        />
      )}

      {/* ── Carousel ── */}
      {carouselItems && (
        <div className="mt-16">
          {carouselTitle && (
            <h3 className="h3-style text-primary mb-2">{carouselTitle}</h3>
          )}
          {carouselSubtitle && (
            <p className="text-body text-primary/60 mb-8">{carouselSubtitle}</p>
          )}
          <Carousel
            items={carouselItems}
            slidesPerView={carouselSlidesPerView}
            spaceBetween={24}
            showPagination={carouselItems.length > carouselSlidesPerView}
            color="primary"
            renderSlide={renderSlide}
          />
        </div>
      )}

      {/* ── Bloc additionnel — PDFs, témoignages, contact... ── */}
      {children && (
        <div className="mt-16">
          {children}
        </div>
      )}

    </section>
  )
}

export default MissionSection