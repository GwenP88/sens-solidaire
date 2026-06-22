// Contact.jsx
// Page contact — formulaire + coordonnées référente + photo

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants formulaire
import ContactForm from '../components/forms/ContactForm'

function Contact() {
  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/contact-hero.png"
        title="Parlons de votre projet"
        subtitle="Une équipe à votre écoute pour vous accompagner dans votre projet."
      />

      <section className="section-padding">

        {/* ── Titre de section ── */}
        <h2 className="section-title text-primary pb-4">Une question, un projet ou simplement l'envie d'en savoir plus ?</h2>

        {/* ── Intro + carte référente ── */}
        <div className="flex gap-8 items-start mb-10">

          {/* Texte d'introduction — 2/3 */}
          <p className="font-body text-sm text-primary/80 flex-1">
            <br />
            Notre équipe est à votre écoute. Contactez-nous via le formulaire ci-dessous ou par téléphone : nous prendrons le temps de répondre à vos questions et de vous accompagner dans votre démarche.<br /><br />
            <span className='italic'>Notre équipe s'engage à vous répondre dans les meilleurs délais.</span>
          </p>

          {/* Carte référente — 1/3 */}
          <div className="w-1/3 shrink-0 flex flex-col items-center gap-1 p-6 bg-surface-mid rounded-2xl text-center">
            <p className="font-heading font-bold text-primary text-base">Delphine Thibaut</p>
            <p className="font-body font-bold text-primary/70 text-sm">Fondatrice et Chargée des Programmes</p>
            <a href="mailto:contact@sensolidaire.org" className="font-body text-sm text-primary/60 hover:text-accent transition-colors">
              contact@sensolidaire.org
            </a>
            <a href="tel:+33637766013" className="font-body text-sm text-primary/40">
              +33 6 73 76 60 13
            </a>
          </div>

        </div>

        {/* ── Layout 2 colonnes — photo + formulaire ── */}
        <div className="flex gap-8 items-stretch">

          {/* Photo gauche — 1/3 */}
          <div className="w-1/3 shrink-0">
            <img
              src="/images/contact/contact.jpg"
              alt="Équipe Sens Solidaire"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Formulaire de contact — 2/3 */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-8">
            <ContactForm />
          </div>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Contact