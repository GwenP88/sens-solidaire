// MentionsLegales.jsx
// Page mentions légales

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function MentionsLegales() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header — fond primary pour la navbar */}
      <div className="bg-primary h-20" />

      <section className="padding-y padding-x max-w-4xl mx-auto flex flex-col gap-lg">

        {/* Titre */}
        <div className="flex flex-col gap-xs">
          <h1 className="h1-style text-primary">Mentions légales</h1>
          <p className="text-caption text-primary/50">Dernière mise à jour : juin 2026</p>
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-md">

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Éditeur du site</h2>
            <p className="text-body text-primary/80">
              Le site <strong>senssolidaire.org</strong> est édité par l'association <strong>Sens Solidaires</strong>, association régie par la loi du 1er juillet 1901.
            </p>
            <div className="flex flex-col gap-xs text-body text-primary/80">
              <p>Siège social : 3bis rue de Guigonis, 06300 Nice</p>
              <p>RNA : WXXXXXXXXX</p>
              <p>SIREN : 479943086</p>
              <p>Email : <a>contact@sensolidaire.org</a></p>
              <p>Directrice de la publication : Delphine Thibaut</p>
            </div>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Hébergement</h2>
            <p className="text-body text-primary/80">Le site est hébergé par :</p>
            <div className="flex flex-col gap-xs text-body text-primary/80">
              <p><strong>OVHcloud</strong></p>
              <p>2 rue Kellermann, 59100 Roubaix, France</p>
              <p>Site : <a href="https://www.ovhcloud.com" className="link-inline text-accent-2" target="_blank" rel="noopener noreferrer">www.ovhcloud.com</a></p>
              <p>Téléphone : 1007</p>
            </div>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Propriété intellectuelle</h2>
            <p className="text-body text-primary/80">L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété de l'association Sens Solidaires ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Données personnelles</h2>
            <p className="text-body text-primary/80">
              Pour en savoir plus sur le traitement de vos données personnelles, consultez notre{' '}
              <a href="/confidentialite" className="link-inline text-accent-2">politique de confidentialité</a>.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Cookies</h2>
            <p className="text-body text-primary/80">
              Pour en savoir plus sur les cookies utilisés sur ce site, consultez notre{' '}
              <a href="/cookies" className="link-inline text-accent-2">politique de cookies</a>.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Contact</h2>
            <p className="text-body text-primary/80">
              Pour toute question, contactez-nous à{' '}
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

export default MentionsLegales