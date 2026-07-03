// footerCta.js
// Configuration des boutons du FooterCta selon la route active

export const FOOTER_CTA_BUTTONS = {
  default: [
    { label: 'Je pars en mission →', href: '/missions', variant: 'primary' },
    { label: 'Je fais un don →', href: '/soutenir', variant: 'secondary' },
  ],
  '/soutenir': [
    { label: 'Je pars en mission →', href: '/missions', variant: 'primary' },
    { label: 'Nous contacter →', href: '/contact', variant: 'secondary' },
  ],
  '/missions': [
    { label: 'Je fais un don →', href: '/soutenir', variant: 'primary' },
    { label: 'Nous contacter →', href: '/contact', variant: 'secondary' },
  ],
  '/education-sensibilisation': [
    { label: 'Je fais un don →', href: '/soutenir', variant: 'primary' },
    { label: 'Nous contacter →', href: '/contact', variant: 'secondary' },
  ],
}

// Routes qui partagent la même config que leur parent
export const FOOTER_CTA_ALIASES = {
  '/education-sensibilisation/': '/education-sensibilisation',
}

// Routes dynamiques — on vérifie si la route commence par un préfixe
export const FOOTER_CTA_PREFIXES = [
  { prefix: '/missions/', config: '/missions' },
  { prefix: '/education-sensibilisation/', config: '/education-sensibilisation' },
]