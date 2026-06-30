// Confidentialite.jsx
// Page politique de confidentialité — obligatoire RGPD

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function Confidentialite() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header — fond primary pour la navbar */}
      <div className="bg-primary h-20" />

      <section className="padding-y padding-x max-w-3xl mx-auto flex flex-col gap-8">

        {/* Titre */}
        <div className="flex flex-col gap-2">
          <h1 className="h1-style text-primary">Politique de confidentialité</h1>
          <p className="text-caption text-primary/50">Dernière mise à jour : juin 2026</p>
        </div>

        {/* Contenu encadré */}
        <div className="border border-primary/20 rounded-2xl p-8 flex flex-col gap-10">

          {/* Responsable */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Responsable du traitement</h2>
            <p className="text-body text-primary/80">
              <strong>Sens Solidaire</strong><br />
              3bis rue de Guigonis, 06300 Nice<br />
              Email : contact@sensolidaire.org<br />
              Directeur de publication : Delphine Thibaut
            </p>
          </div>

          {/* Données collectées */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Données collectées</h2>
            <p className="text-body text-primary/80">
              Dans le cadre de l'utilisation de ce site, nous collectons les données suivantes :
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'Formulaire de contact : prénom, nom, email, sujet, message',
                'Formulaire de témoignage : prénom, nom, type de mission, témoignage, photo (optionnelle)',
                'Cookies techniques strictement nécessaires au fonctionnement du site',
              ].map(item => (
                <li key={item} className="text-body text-primary/80">— {item}</li>
              ))}
            </ul>
          </div>

          {/* Finalités */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Finalités du traitement</h2>
            <p className="text-body text-primary/80">
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'Répondre à vos demandes de contact',
                'Publier votre témoignage sur le site après validation',
                'Assurer le bon fonctionnement technique du site',
              ].map(item => (
                <li key={item} className="text-body text-primary/80">— {item}</li>
              ))}
            </ul>
          </div>

          {/* Conservation */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Durée de conservation</h2>
            <p className="text-body text-primary/80">
              Les données de contact sont conservées le temps nécessaire au traitement de votre demande, puis supprimées. Les témoignages publiés sont conservés jusqu'à demande de suppression de votre part.
            </p>
          </div>

          {/* Droits */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Vos droits</h2>
            <p className="text-body text-primary/80">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'Droit d\'accès à vos données',
                'Droit de rectification',
                'Droit à l\'effacement (droit à l\'oubli)',
                'Droit à la limitation du traitement',
                'Droit d\'opposition',
              ].map(item => (
                <li key={item} className="text-body text-primary/80">— {item}</li>
              ))}
            </ul>
            <p className="text-body text-primary/80">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href="mailto:contact@sensolidaire.org" className="link-inline text-accent">
                contact@sensolidaire.org
              </a>
            </p>
          </div>

          {/* Cookies */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Cookies</h2>
            <p className="text-body text-primary/80">
              Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie publicitaire, analytique ou de tracking tiers n'est utilisé. Vous pouvez refuser ces cookies via la bannière affichée lors de votre première visite.
            </p>
          </div>

          {/* Contact DPO */}
          <div className="flex flex-col gap-3">
            <h2 className="h2-style text-primary">Contact & réclamation</h2>
            <p className="text-body text-primary/80">
              Pour toute question relative à la protection de vos données ou pour exercer vos droits, contactez-nous à :{' '}
              <a href="mailto:contact@sensolidaire.org" className="link-inline text-accent">
                contact@sensolidaire.org
              </a><br /><br />
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL :{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="link-inline text-accent">
                www.cnil.fr
              </a>
            </p>
          </div>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Confidentialite