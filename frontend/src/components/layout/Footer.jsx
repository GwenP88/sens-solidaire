// Footer.jsx
// Pied de page — 3 zones : CTA immersif, Navigation 4 colonnes, Barre légale

import { FaYoutube, FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import Button from '../ui/Button'

function Footer() {
  return (
    <footer>

      {/* Zone 1 — CTA immersif */}
      <div className="relative w-full h-72 bg-gray-400 flex items-end p-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-bold text-surface text-3xl max-w-lg">
            Chaque action peut changer une vie.
          </h2>
          <p className="font-body text-surface text-sm max-w-xl">
            Rejoignez-nous sur le terrain ou soutenez nos projets. Ensemble, construisons un avenir plus solidaire.
          </p>
          <div className="flex gap-4 mt-2">
            <Button label="Je pars en mission →" variant="primary" />
            <Button label="Je fais un don →" variant="secondary" />
          </div>
        </div>
      </div>

      {/* Zone 2 — Navigation 4 colonnes */}
      <div className="bg-primary px-20 py-8 flex justify-between">

        {/* Col 1 — Logo + Tagline + Réseaux */}
        <div className="flex flex-col gap-4 w-72">
          <div className="bg-white/40 rounded-full p-1 w-fit">
            <img src="/Logo.png" alt="Sens Solidaire" className="h-12" />
          </div>
          <p className="font-body text-surface text-sm">
            Une association engagée pour un monde plus solidaire et durable.
          </p>
          <p className="font-body text-surface text-sm">
            Sur le terrain, nous agissons aux côtés des communautés locales pour un impact positif et durable.
          </p>
          <div className="flex gap-4">
            <FaYoutube className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" />
            <FaLinkedin className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" />
            <FaInstagram className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" />
            <FaFacebook className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Col 2 — Découvrir */}
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-bold text-surface text-sm uppercase tracking-widest mb-3">
            Découvrir
          </h3>
          <a href="/" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Accueil</a>
          <a href="/missions" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Nos missions</a>
          <a href="/notre-impact" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Notre impact</a>
          <a href="/actions-educatives" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Actions éducatives</a>
          <a href="/medias-et-actualites" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Médias & actualités</a>
          <a href="/a-propos" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">À propos</a>
        </div>

        {/* Col 3 — S'engager */}
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-bold text-surface text-sm uppercase tracking-widest mb-3">
            S'engager
          </h3>
          <a href="/missions" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Partir en mission</a>
          <a href="/don" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Faire un don</a>
          <a href="/adhesion" className="font-body text-surface/70 text-sm hover:text-surface transition-colors">Adhérer à l'association</a>
        </div>

        {/* Col 4 — Nous contacter */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading font-bold text-surface text-sm uppercase tracking-widest mb-3">
            Nous contacter
          </h3>
          <div className="flex gap-3">
            <FaMapMarkerAlt className="text-surface text-lg mt-1 shrink-0" />
            <p className="font-body text-surface/70 text-sm">
              Maison des associations<br />3bis rue de Guigonis, 06300 Nice
            </p>
          </div>
          <div className="flex gap-3">
            <FaMapMarkerAlt className="text-surface text-lg mt-1 shrink-0" />
            <p className="font-body text-surface/70 text-sm">
              Annexe<br />Cité de la Solidarité Internationale, 74100 Annemasse
            </p>
          </div>
          <div className="flex gap-3">
            <FaMapMarkerAlt className="text-surface text-lg mt-1 shrink-0" />
            <p className="font-body text-surface/70 text-sm">
              Antenne Suisse<br />14 Chemin de la Rochette, 1202 Genève
            </p>
          </div>
          <div className="flex gap-3">
            <FaEnvelope className="text-surface text-lg mt-1 shrink-0" />
            <a href="mailto:contact@sensolidaire.org" className="font-body text-surface/70 text-sm hover:text-surface transition-colors underline">
              contact@sensolidaire.org
            </a>
          </div>
        </div>

      </div>

      {/* Zone 3 — Barre légale */}
      <div style={{ backgroundColor: '#0F2108' }} className="px-20 py-4 flex justify-between items-center border-t border-surface/15">
        <p className="font-body text-surface/50 text-sm">
          © 2026 Sens Solidaire. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          <a href="/mentions-legales" className="font-body text-surface/50 text-sm hover:text-surface transition-colors">Mentions légales</a>
          <a href="/confidentialite" className="font-body text-surface/50 text-sm hover:text-surface transition-colors">Confidentialité</a>
          <a href="/cookies" className="font-body text-surface/50 text-sm hover:text-surface transition-colors">Cookies</a>
        </div>
      </div>

    </footer>
  )
}

export default Footer