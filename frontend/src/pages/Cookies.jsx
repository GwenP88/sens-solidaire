// Cookies.jsx
// Page politique de cookies — CNIL

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function Cookies() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header — fond primary pour la navbar */}
      <div className="bg-primary h-20" />

      <section className="padding-y padding-x max-w-4xl mx-auto flex flex-col gap-lg">

        {/* Titre + date */}
        <div className="flex flex-col gap-xs">
          <h1 className="h1-style text-primary">Politique de cookies</h1>
          <p className="text-caption text-primary/50">Dernière mise à jour : juin 2026</p>
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-md">

          <section className="flex flex-col gap-sm">
            {/* h2-style mb-0 : dans flex flex-col gap-sm, marge redondante avec gap */}
            <h2 className="h2-style text-primary mb-0">Qu'est-ce qu'un cookie ?</h2>
            <p className="text-body text-primary/80">Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres.</p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Les cookies utilisés sur ce site</h2>
            <p className="text-body text-primary/80">Le site <strong>sensolidaire.org</strong> utilise uniquement des cookies strictement nécessaires au bon fonctionnement du site :</p>
            <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
              <div className="flex flex-col gap-xs">
                {/* h3-style mb-0 : dans flex flex-col gap-xs, marge redondante avec gap */}
                <h3 className="h3-style text-primary mb-0">Cookies de préférences</h3>
                <p className="text-body text-primary/60">Mémorisent vos choix de consentement aux cookies. Durée : 12 mois.</p>
              </div>
              <div className="flex flex-col gap-xs">
                <h3 className="h3-style text-primary mb-0">Cookies de session</h3>
                <p className="text-body text-primary/60">Nécessaires au fonctionnement du site. Supprimés à la fermeture du navigateur.</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Cookies tiers</h2>
            <p className="text-body text-primary/80">Ce site n'utilise pas de cookies publicitaires, de tracking ou d'analyse comportementale. Aucune donnée personnelle n'est transmise à des tiers à des fins commerciales.</p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Gérer vos préférences</h2>
            <p className="text-body text-primary/80">Vous pouvez à tout moment modifier vos préférences en matière de cookies en cliquant sur le bouton ci-dessous ou en effaçant les cookies de votre navigateur via ses paramètres.</p>
            <button
              onClick={() => {
                localStorage.removeItem('cookieConsent')
                window.location.reload()
              }}
              className="link-cta text-accent-2 underline underline-offset-4 text-left"
            >
              Réinitialiser mes préférences de cookies
            </button>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Contact</h2>
            <p className="text-body text-primary/80">
              Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à{' '}
              <a href="mailto:contact@sensolidaire.org" className="link-inline text-accent-2">
                contact@sensolidaire.org
              </a>.
            </p>
          </section>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Cookies