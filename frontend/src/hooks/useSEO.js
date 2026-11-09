// useSEO.js
// Titre d'onglet, description Google et aperçu réseaux sociaux (Open Graph) propres à chaque page (tâche 174).
// Hook plutôt que composant : une ligne en haut de la page, appelée avant les « return » de chargement,
// et mise à jour automatique quand les données d'une page détail arrivent.

// ── React
import { useEffect } from 'react'

// ── Utils
import { previewShortDescription } from '../utils/shortDescription'

// ── Valeurs par défaut — reprises de index.html (ce que voient les robots qui n'exécutent pas JavaScript)
const SITE_NAME = 'Sens Solidaires'
const DEFAULT_DESCRIPTION = "Sens Solidaires, association de volontariat international : missions humanitaires et environnementales, actions éducatives et solidaires en France et à l'étranger."
const DEFAULT_IMAGE = '/images/design/hero/hero-home.jpg'

// ── Crée la balise <meta> si elle n'existe pas encore, puis met à jour son contenu
// attr : 'name' (description, robots, twitter:…) ou 'property' (og:…)
const setMeta = (attr, key, content) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// ── Adresse de référence de la page (évite que Google voie /missions et /missions?type=x comme deux pages)
const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

// Les réseaux sociaux exigent une adresse d'image complète (https://…), pas un chemin relatif
const toAbsoluteUrl = (url) => (url?.startsWith('/') ? `${window.location.origin}${url}` : url)

// Paramètres :
//   title       : titre de la page (« | Sens Solidaires » est ajouté automatiquement) — absent = accueil
//   description : texte affiché par Google sous le titre — nettoyé et coupé à ~160 caractères
//   image       : photo de l'aperçu partagé sur les réseaux sociaux
//   noindex     : true pour les pages à ne pas référencer (dashboard, connexion)
export default function useSEO({ title, description, image, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Volontariat et solidarité internationale`
    // Le repère « --- » de la description courte et les retours à la ligne n'ont pas leur place dans Google
    const cleanDescription = previewShortDescription((description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' '), 160)
    const url = `${window.location.origin}${window.location.pathname}`

    document.title = fullTitle
    setMeta('name', 'description', cleanDescription)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonical(url)

    // Open Graph : aperçu (titre, texte, photo) quand le lien est partagé sur Facebook, LinkedIn, WhatsApp…
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', cleanDescription)
    setMeta('property', 'og:image', toAbsoluteUrl(image || DEFAULT_IMAGE))
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:card', 'summary_large_image')
  }, [title, description, image, noindex])
}
