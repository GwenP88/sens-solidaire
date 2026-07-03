// Confidentialite.jsx
// Page politique de confidentialité — RGPD

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function Confidentialite() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header — fond primary pour la navbar */}
      <div className="bg-primary h-20" />

      <section className="padding-y padding-x max-w-4xl mx-auto flex flex-col gap-lg">

        {/* Titre */}
        <div className="flex flex-col gap-xs">
          <h1 className="h1-style text-primary">Politique de confidentialité</h1>
          <p className="text-caption text-primary/50">Dernière mise à jour : juin 2026</p>
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-md">

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Responsable du traitement</h2>
            <p className="text-body text-primary/80">L'association <strong>Sens Solidaires</strong>, dont le siège est situé au 3bis rue de Guigonis, 06300 Nice, est responsable du traitement de vos données personnelles.</p>
            <p className="text-body text-primary/80">
              Pour toute question relative au traitement de vos données personnelles, vous pouvez nous contacter à{' '}
              <a
                href="mailto:contact@sensolidaire.org"
                className="link-inline text-accent-2"
              >
                contact@sensolidaire.org
              </a>.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Données collectées</h2>
            <p className="text-body text-primary/80">Nous collectons uniquement les données que vous nous fournissez volontairement :</p>
            <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
              <div className="flex flex-col gap-xs">
                <h3 className="h3-style text-primary mb-0">Formulaire de contact</h3>
                <p className="text-body text-primary/60">Nom, prénom, email, message. Utilisés uniquement pour répondre à votre demande.</p>
              </div>
              <div className="flex flex-col gap-xs">
                <h3 className="h3-style text-primary mb-0">Formulaire de témoignage</h3>
                <p className="text-body text-primary/60">Nom, prénom, témoignage, photo optionnelle. Publiés sur le site après validation, avec votre consentement explicite.</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Bases légales du traitement</h2>
            <p className="text-body text-primary/80">
              Les données transmises via le formulaire de contact sont traitées sur la base de l'intérêt légitime de l'association à répondre aux demandes reçues.
            </p>
            <p className="text-body text-primary/80">
              Les témoignages et photos transmis sont traités uniquement sur la base de votre consentement explicite.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Durée de conservation</h2>
            <p className="text-body text-primary/80">
              Les données transmises via le formulaire de contact sont conservées pendant la durée nécessaire au traitement de votre demande, puis supprimées ou archivées au plus tard trois ans après le dernier contact.
            </p>
            <p className="text-body text-primary/80">
              Les témoignages, rapports de mission et photographies publiés sur le site sont conservés jusqu'à leur suppression par l'association ou jusqu'au retrait de votre consentement, sur simple demande de votre part.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Destinataires des données</h2>
            <p className="text-body text-primary/80">
              Les données personnelles collectées sont accessibles uniquement aux personnes habilitées au sein de l'association Sens Solidaires, dans la limite de leurs missions.
            </p>
            <p className="text-body text-primary/80">
              Elles peuvent également être traitées par nos prestataires techniques (hébergement, maintenance du site) uniquement lorsque cela est nécessaire au fonctionnement du service et dans le respect de la réglementation applicable.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Vos droits</h2>
            <p className="text-body text-primary/80">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="flex flex-col gap-xs text-body text-primary/80 list-disc list-inside">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="text-body text-primary/80">
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:contact@sensolidaire.org" className="link-inline text-accent-2">
                contact@sensolidaire.org
              </a>.
            </p>
            <p className="text-body text-primary/80">
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) sur son site :{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="link-inline text-accent-2"
              >
                www.cnil.fr
              </a>.
            </p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">Transmission à des tiers</h2>
            <p className="text-body text-primary/80">Vos données personnelles ne sont jamais vendues, louées ou transmises à des tiers à des fins commerciales. Elles peuvent être transmises aux autorités compétentes lorsque la loi l'impose.</p>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="h2-style text-primary mb-0">
              Contact relatif à la protection des données
            </h2>

            <p className="text-body text-primary/80">
              Pour toute question concernant le traitement de vos données personnelles ou pour exercer vos droits, vous pouvez nous contacter à{' '}
              <a
                href="mailto:contact@sensolidaire.org"
                className="link-inline text-accent-2"
              >
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

export default Confidentialite