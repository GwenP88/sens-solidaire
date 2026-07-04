// Footer.jsx
// Pied de page — 3 zones : CTA immersif, Navigation 4 colonnes, Barre légale
// Factorisé en composants (FooterBrand, FooterLinksColumn, FooterContact, FooterCta) —
// le contenu n'est plus dupliqué, seule la disposition (largeurs, gap, ordre) varie par breakpoint

// ── Composants layout
import FooterCta from './FooterCta'
import FooterBrand from './FooterBrand'
import FooterLinksColumn from './FooterLinksColumn'
import FooterContact from './FooterContact'

// ── Données
import { DECOUVRIR_LINKS, ENGAGER_LINKS } from '../../utils/footerData'

function Footer({ hideCta = false }) {
  return (
    <footer>

      {/* Zone 1 — CTA immersif */}
      <FooterCta hideCta={hideCta} />

      {/* Zone 2 — Navigation
          Mobile (<768)      : empilé col1 / col2+col3 / col4
          Tablette (768-1279): 2 lignes — ligne1: col1(2/3)+col2(1/3) / ligne2: col3(1/3)+col4(2/3)
          Desktop (1280+)    : 4 colonnes côte à côte
      */}

      {/* ── Mobile uniquement (<768) ── */}
      <div className="bg-primary padding-x py-8 flex flex-col gap-lg md:hidden">
        <FooterBrand logoSize="h-10" />
        <div className="h-px bg-surface/20" />
        <div className="flex flex-row gap-0">
          <div className="flex-1">
            <FooterLinksColumn title="Découvrir" links={DECOUVRIR_LINKS} />
          </div>
          <div className="w-px bg-surface/20 mx-4" />
          <div className="flex-1">
            <FooterLinksColumn title="S'engager" links={ENGAGER_LINKS} />
          </div>
        </div>
        <div className="h-px bg-surface/20" />
        <FooterContact />
      </div>

      {/* ── Tablette (768-1279) ── */}
      <div className="bg-primary padding-x py-8 hidden md:block xl:hidden">
        <div className="flex flex-row gap-lg">
          <div className="w-2/3">
            <FooterBrand logoSize="h-12" />
          </div>
          <div className="w-px bg-surface/20 self-stretch" />
          <div className="w-1/3">
            <FooterLinksColumn title="Découvrir" links={DECOUVRIR_LINKS} />
          </div>
        </div>
        <div className="h-px bg-surface/20 my-8" />
        <div className="flex flex-row gap-lg">
          <div className="w-1/3">
            <FooterLinksColumn title="S'engager" links={ENGAGER_LINKS} />
          </div>
          <div className="w-px bg-surface/20 self-stretch" />
          <div className="w-2/3">
            <FooterContact />
          </div>
        </div>
      </div>

      {/* ── Desktop (1280+) ── */}
      <div className="bg-primary padding-x py-8 hidden xl:flex flex-row gap-0 justify-between">
        <div className="w-84">
          <FooterBrand logoSize="h-14" />
        </div>
        <div className="w-px bg-surface/20 mx-8 self-center h-64" />
        <div className="w-40">
          <FooterLinksColumn title="Découvrir" links={DECOUVRIR_LINKS} />
        </div>
        <div className="w-px bg-surface/20 mx-8 self-center h-64" />
        <div className="w-40">
          <FooterLinksColumn title="S'engager" links={ENGAGER_LINKS} />
        </div>
        <div className="w-px bg-surface/20 mx-8 self-center h-64" />
        <div className="w-84">
          <FooterContact />
        </div>
      </div>

      {/* Zone 3 — Barre légale */}
      <div className="bg-dark padding-x py-4 flex flex-col md:flex-row gap-xs md:gap-0 justify-between items-center border-t border-surface/15">
        <p className="text-caption text-surface/50 italic">
          © 2026 Sens Solidaires. Tous droits réservés.
        </p>
        <div className="flex gap-md">
          <a href="/mentions-legales" className="link-footer text-surface/50 hover:text-surface">Mentions légales</a>
          <a href="/confidentialite" className="link-footer text-surface/50 hover:text-surface">Confidentialité</a>
          <a href="/cookies" className="link-footer text-surface/50 hover:text-surface">Cookies</a>
        </div>
      </div>

    </footer>
  )
}

export default Footer