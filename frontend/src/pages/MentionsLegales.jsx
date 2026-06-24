// MentionsLegales.jsx
// Page mentions légales — obligatoire LCEN 2004

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function MentionsLegales() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header — fond primary pour la navbar */}
      <div className="bg-primary h-20" />

      <section className="section-padding max-w-4xl mx-auto flex flex-col gap-8">

        {/* Titre */}
        <div className="flex flex-col gap-2">
          <h1 className="h1-style text-primary">Mentions légales</h1>
          <p className="text-caption text-primary/50">Informations juridiques relatives au site sensolidaire.org</p>
        </div>

        {/* Contenu encadré */}
        <div className="border border-primary/30 rounded-2xl p-8 flex flex-col gap-10">

          {/* Éditeur + Hébergeur — 2 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3 bg-surface-mid rounded-xl p-6">
              <h2 className="h2-style text-primary">Éditeur du site</h2>
              <p className="text-body text-primary/80">
                <strong>Sens Solidaire</strong><br />
                Association loi 1901<br />
                Siège social : 3bis rue de Guigonis, 06300 Nice<br />
                SIRET : <span className="text-mention text-primary/40">[À compléter]</span><br />
                Email : contact@sensolidaire.org<br />
                Directeur de publication : Delphine Thibaut
              </p>
            </div>
            <div className="flex flex-col gap-3 bg-surface-mid rounded-xl p-6">
              <h2 className="h2-style text-primary">Hébergeur</h2>
              <p className="text-body text-primary/80">
                <span className="text-mention text-primary/40">[Nom de l'hébergeur à compléter]</span><br />
                <span className="text-mention text-primary/40">[Adresse à compléter]</span>
              </p>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Propriété intellectuelle</h2>
            <p className="text-body text-primary/80">
              L'ensemble des contenus présents sur ce site (textes, images, vidéos, logos) sont la propriété exclusive de l'association Sens Solidaire ou de leurs auteurs respectifs. Toute reproduction, représentation ou diffusion, intégrale ou partielle, est interdite sans autorisation préalable.
            </p>
          </div>

          {/* Données personnelles */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Données personnelles</h2>
            <p className="text-body text-primary/80">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à :{' '}
              <a href="mailto:contact@sensolidaire.org" className="link-inline text-accent">contact@sensolidaire.org</a>
            </p>
          </div>

          {/* Cookies */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Cookies</h2>
            <p className="text-body text-primary/80">
              Ce site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé. En continuant à naviguer sur ce site, vous acceptez l'utilisation de ces cookies.
            </p>
          </div>

          {/* Crédits */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Crédits</h2>
            <p className="text-body text-primary/80">
              Site développé par Gwen Pichot & Alison Amblard — Holberton School Thonon-les-Bains — 2026.
            </p>
          </div>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default MentionsLegales