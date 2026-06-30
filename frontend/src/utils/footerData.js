// footerData.js
// Données du Footer — liens, réseaux sociaux, contacts
// Centralisé ici pour éviter la duplication entre les 3 versions responsive du Footer

import { IconYoutube, IconLinkedin, IconInstagram, IconFacebook, IconTikTok } from './icons'

// ── Colonne "Découvrir" ──
export const DECOUVRIR_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos missions', href: '/missions' },
  { label: 'Notre impact', href: '/notre-impact' },
  { label: 'Actions éducatives', href: '/actions-educatives' },
  { label: 'Médias & actualités', href: '/medias-et-actualites' },
  { label: 'À propos', href: '/a-propos' },
]

// ── Colonne "S'engager" ──
export const ENGAGER_LINKS = [
  { label: 'Partir en mission', href: '/missions' },
  { label: 'Faire un don', href: '/don' },
  { label: "Adhérer à l'association", href: '/adhesion' },
]

// ── Réseaux sociaux ──
export const SOCIAL_LINKS = [
  { icon: IconYoutube, href: 'https://www.youtube.com/channel/UC4lhQB-8zXiZJvD-kQS-q4A/featured' },
  { icon: IconLinkedin, href: 'https://www.linkedin.com/company/sens-solidaires/' },
  { icon: IconInstagram, href: 'https://www.instagram.com/sens_solidaires/' },
  { icon: IconFacebook, href: 'https://www.facebook.com/Sensolidaires' },
  { icon: IconTikTok, href: 'https://www.tiktok.com/@sensolidaires?lang=fr&is_copy_url=1&is_from_webapp=v1' },
]

// ── Contacts — 3 adresses (lien Google Maps) + email ──
export const CONTACTS = [
  {
    type: 'address',
    href: 'https://maps.google.com/?q=3bis+rue+de+Guigonis+06300+Nice',
    label: 'Antenne en France - Maison des associations',
    detail: '3bis rue de Guigonis, 06300 Nice',
  },
  {
    type: 'address',
    href: 'https://maps.google.com/?q=Cite+Solidarite+Internationale+74100+Annemasse',
    label: 'Annexe Française',
    detail: 'Cité de la Solidarité Internationale, 74100 Annemasse',
  },
  {
    type: 'address',
    href: 'https://maps.google.com/?q=15+rue+des+Savoises+1205+Geneve',
    label: 'Antenne Suisse - Maison Internationale des associations',
    detail: '15 rue des Savoises, 1205 Genève',
  },
  {
    type: 'email',
    href: 'mailto:contact@sensolidaire.org',
    label: 'contact@sensolidaire.org',
  },
]