// PageLoader.jsx
// Affiché pendant le téléchargement d'une page chargée à la demande (lazy loading, tâche 130).

// role="status" : les lecteurs d'écran annoncent le chargement sans déplacer le focus.
// min-h-screen : occupe tout l'écran pour que le pied de page reste hors de vue pendant le chargement.
// Sinon il s'affiche puis « saute » vers le bas à l'arrivée de la page : décalage pénalisé par Google
// (CLS 0,4 mesuré par Lighthouse sur /contact).
function PageLoader() {
  return (
    <div role="status" className="min-h-screen flex items-center justify-center">
      <p className="text-body text-primary/90 italic">Chargement...</p>
    </div>
  )
}

export default PageLoader
