// Confidentialite.jsx
// Page politique de confidentialité — obligatoire RGPD

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'

function Confidentialite() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header — fond primary pour la navbar */}
      <div className="bg-primary h-20" />

      <section className="section-padding max-w-3xl mx-auto flex flex-col gap-8">

        {/* Titre — hors cadre */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading font-bold text-primary text-4xl">Politique de confidentialité</h1>
          <p className="font-body text-sm text-primary/60">Dernière mise à jour : juin 2026</p>
        </div>

        {/* Contenu encadré */}
        <div className="border border-primary/20 rounded-2xl p-8 flex flex-col gap-10">

          {/* Responsable */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Responsable du traitement</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              <strong>Sens Solidaire</strong><br />
              3bis rue de Guigonis, 06300 Nice<br />
              Email : contact@sensolidaire.org<br />
              Directeur de publication : Delphine Thibaut
            </p>
          </div>

          {/* Données collectées */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Données collectées</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Dans le cadre de l'utilisation de ce site, nous collectons les données suivantes :
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'Formulaire de contact : prénom, nom, email, sujet, message',
                'Formulaire de témoignage : prénom, nom, type de mission, témoignage, photo (optionnelle)',
                'Cookies techniques strictement nécessaires au fonctionnement du site',
              ].map(item => (
                <li key={item} className="font-body text-sm text-primary/80 leading-relaxed">— {item}</li>
              ))}
            </ul>
          </div>

          {/* Finalités */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Finalités du traitement</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'Répondre à vos demandes de contact',
                'Publier votre témoignage sur le site après validation',
                'Assurer le bon fonctionnement technique du site',
              ].map(item => (
                <li key={item} className="font-body text-sm text-primary/80 leading-relaxed">— {item}</li>
              ))}
            </ul>
          </div>

          {/* Conservation */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Durée de conservation</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Les données de contact sont conservées le temps nécessaire au traitement de votre demande, puis supprimées. Les témoignages publiés sont conservés jusqu'à demande de suppression de votre part.
            </p>
          </div>

          {/* Droits */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Vos droits</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
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
                <li key={item} className="font-body text-sm text-primary/80 leading-relaxed">— {item}</li>
              ))}
            </ul>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@sensolidaire.org" className="text-accent hover:underline">contact@sensolidaire.org</a>
            </p>
          </div>

          {/* Cookies */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Cookies</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie publicitaire, analytique ou de tracking tiers n'est utilisé. Vous pouvez refuser ces cookies via la bannière affichée lors de votre première visite.
            </p>
          </div>

          {/* Contact DPO */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-primary text-xl">Contact & réclamation</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Pour toute question relative à la protection de vos données ou pour exercer vos droits, contactez-nous à : <a href="mailto:contact@sensolidaire.org" className="text-accent hover:underline">contact@sensolidaire.org</a><br /><br />
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">www.cnil.fr</a>
            </p>
          </div>

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Confidentialite