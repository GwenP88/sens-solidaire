// PageLoader.jsx
// Affiché pendant le téléchargement d'une page chargée à la demande (lazy loading, tâche 130).

// role="status" : les lecteurs d'écran annoncent le chargement sans déplacer le focus.
// min-h : réserve la place de la page pour que le pied de page ne « saute » pas.
function PageLoader() {
  return (
    <div role="status" className="min-h-[60vh] flex items-center justify-center">
      <p className="text-body text-primary/50 italic">Chargement...</p>
    </div>
  )
}

export default PageLoader
