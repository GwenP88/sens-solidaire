// Cookies.jsx
// Page politique de cookies — CNIL

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function Cookies() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header */}
      <div className="bg-primary h-20" />

      <section className="section-padding max-w-4xl mx-auto flex flex-col gap-8">

        <div className="flex flex-col gap-2">
          <h1 className="font-heading font-bold text-primary text-2xl md:text-4xl">Politique de cookies</h1>
          <p className="font-body text-sm text-primary/60">Dernière mise à jour : juin 2026</p>
        </div>

        <div className="flex flex-col gap-6 font-body text-sm text-primary/80 leading-relaxed">

          <section className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Qu'est-ce qu'un cookie ?</h2>
            <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Les cookies utilisés sur ce site</h2>
            <p>Le site <strong>sensolidaire.org</strong> utilise uniquement des cookies strictement nécessaires au bon fonctionnement du site :</p>
            <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-bold text-primary">Cookies de préférences</p>
                <p className="text-primary/60">Mémorisent vos choix de consentement aux cookies. Durée : 12 mois.</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-primary">Cookies de session</p>
                <p className="text-primary/60">Nécessaires au fonctionnement du site. Supprimés à la fermeture du navigateur.</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Cookies tiers</h2>
            <p>Ce site n'utilise pas de cookies publicitaires, de tracking ou d'analyse comportementale. Aucune donnée personnelle n'est transmise à des tiers à des fins commerciales.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Gérer vos préférences</h2>
            <p>Vous pouvez à tout moment modifier vos préférences en matière de cookies en cliquant sur le bouton ci-dessous ou en effaçant les cookies de votre navigateur via ses paramètres.</p>
            <button
              onClick={() => {
                localStorage.removeItem('cookieConsent')
                window.location.reload()
              }}
              className="font-body font-bold text-sm text-accent-2 underline underline-offset-4 text-left"
            >
              Réinitialiser mes préférences de cookies
            </button>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Contact</h2>
            <p>Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à <a href="mailto:contact@sensolidaire.org" className="text-accent-2 underline">contact@sensolidaire.org</a>.</p>
          </section>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Cookies