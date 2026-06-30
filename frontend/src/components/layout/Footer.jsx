// Footer.jsx
// Pied de page — 3 zones : CTA immersif, Navigation 4 colonnes, Barre légale

// ── Composants UI
import { IconPin, IconMail, IconYoutube, IconLinkedin, IconInstagram, IconFacebook, IconTikTok } from '../../utils/icons'
import Button from '../ui/Button'

function Footer({ hideCta = false }) {
  return (
    <footer>

      {/* Zone 1 — CTA immersif — masqué si hideCta */}
      {!hideCta && (
        <div className="relative w-full h-auto min-h-64 md:h-96 flex items-end p-6 md:p-16" style={{ backgroundImage: `url(/images/hero/hero-footer.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative flex flex-col gap-4">
            <h2 className="h2-style text-surface">
              Chaque action peut changer une vie.
            </h2>
            <p className="text-lead text-surface">
              Rejoignez-nous sur le terrain ou soutenez nos projets. <br /> Ensemble, construisons un avenir plus solidaire.
            </p>
            <div className="flex flex-row gap-4 mt-2">
              <a href="/missions">
                <Button label="Je pars en mission →" variant="primary" />
              </a>
              <a href="/soutenir">
                <Button label="Je fais un don →" variant="secondary" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Zone 2 — Navigation
          Mobile (<768)      : empilé col1 / col2+col3 / col4
          Tablette (768-1279): 2 lignes — ligne1: col1(2/3)+col2(1/3) / ligne2: col3(1/3)+col4(2/3)
          Desktop (1280+)    : 4 colonnes côte à côte
      */}

      {/* ── Mobile uniquement (<768) ── */}
      <div className="bg-primary px-6 py-8 flex flex-col gap-8 md:hidden">

        {/* Col 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-6">
            <div className="bg-white/50 rounded-full p-1 w-fit">
              <img src="/logo.png" alt="Sens Solidaire" className="h-10" />
            </div>
            <span className="text-brand text-surface">Sens Solidaires</span>
          </div>
          <p className="text-body text-surface">Une association engagée pour un monde plus solidaire et durable.</p>
          <p className="text-body text-surface/80">Sur le terrain, nous agissons aux côtés des communautés locales pour un impact positif et durable.</p>
          <div className="flex gap-6">
            <a href="https://www.youtube.com/channel/UC4lhQB-8zXiZJvD-kQS-q4A/featured"><IconYoutube className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.linkedin.com/company/sens-solidaires/"><IconLinkedin className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.instagram.com/sens_solidaires/"><IconInstagram className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.facebook.com/Sensolidaires"><IconFacebook className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.tiktok.com/@sensolidaires?lang=fr&is_copy_url=1&is_from_webapp=v1"><IconTikTok className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
          </div>
        </div>

        <div className="h-px bg-surface/20" />

        {/* Col 2 + Col 3 côte à côte */}
        <div className="flex flex-row gap-0">
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-label text-surface mb-6">Découvrir</h3>
            <a href="/" className="link-footer text-surface/70 hover:text-surface pt-4">Accueil</a>
            <a href="/missions" className="link-footer text-surface/70 hover:text-surface">Nos missions</a>
            <a href="/notre-impact" className="link-footer text-surface/70 hover:text-surface">Notre impact</a>
            <a href="/actions-educatives" className="link-footer text-surface/70 hover:text-surface">Actions éducatives</a>
            <a href="/medias-et-actualites" className="link-footer text-surface/70 hover:text-surface">Médias & actualités</a>
            <a href="/a-propos" className="link-footer text-surface/70 hover:text-surface">À propos</a>
          </div>
          <div className="w-px bg-surface/20 mx-4" />
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-label text-surface mb-6">S'engager</h3>
            <a href="/missions" className="link-footer text-surface/70 hover:text-surface pt-4">Partir en mission</a>
            <a href="/don" className="link-footer text-surface/70 hover:text-surface">Faire un don</a>
            <a href="/adhesion" className="link-footer text-surface/70 hover:text-surface">Adhérer à l'association</a>
          </div>
        </div>

        <div className="h-px bg-surface/20" />

        {/* Col 4 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-label text-surface mb-6">Nous contacter</h3>
          <div className="flex gap-3">
            <IconPin className="text-surface text-lg mt-1 shrink-0" />
            <a href="https://maps.google.com/?q=3bis+rue+de+Guigonis+06300+Nice" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
              Antenne en France - Maison des associations<br />3bis rue de Guigonis, 06300 Nice
            </a>
          </div>
          <div className="flex gap-3">
            <IconPin className="text-surface text-lg mt-1 shrink-0" />
            <a href="https://maps.google.com/?q=Cite+Solidarite+Internationale+74100+Annemasse" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
              Annexe Française<br />Cité de la Solidarité Internationale, 74100 Annemasse
            </a>
          </div>
          <div className="flex gap-3">
            <IconPin className="text-surface text-lg mt-1 shrink-0" />
            <a href="https://maps.google.com/?q=15+rue+des+Savoises+1205+Geneve" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
              Antenne Suisse - Maison Internationale des associations<br />15 rue des Savoises, 1205 Genève
            </a>
          </div>
          <div className="flex gap-3">
            <IconMail className="text-surface text-lg mt-1 shrink-0" />
            <a href="mailto:contact@sensolidaire.org" className="link-inline text-surface/70 hover:text-surface">contact@sensolidaire.org</a>
          </div>
        </div>

      </div>

      {/* ── Tablette (768-1279) ── */}
      <div className="bg-primary px-8 py-8 hidden md:block xl:hidden">

        {/* Ligne 1 — Col1 (2/3) + Col2 (1/3) */}
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-4 w-2/3">
            <div className="flex items-start gap-6">
              <div className="bg-white/50 rounded-full p-1 w-fit">
                <img src="/logo.png" alt="Sens Solidaire" className="h-12" />
              </div>
              <span className="text-brand text-surface">Sens Solidaires</span>
            </div>
            <p className="text-body text-surface">Une association engagée pour un monde plus solidaire et durable.</p>
            <p className="text-body text-surface/80">Sur le terrain, nous agissons aux côtés des communautés locales pour un impact positif et durable.</p>
            <div className="flex gap-6">
              <a href="https://www.youtube.com/channel/UC4lhQB-8zXiZJvD-kQS-q4A/featured"><IconYoutube className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
              <a href="https://www.linkedin.com/company/sens-solidaires/"><IconLinkedin className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
              <a href="https://www.instagram.com/sens_solidaires/"><IconInstagram className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
              <a href="https://www.facebook.com/Sensolidaires"><IconFacebook className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
              <a href="https://www.tiktok.com/@sensolidaires?lang=fr&is_copy_url=1&is_from_webapp=v1"><IconTikTok className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            </div>
          </div>
          <div className="w-px bg-surface/20 self-stretch" />
          <div className="flex flex-col gap-2 w-1/3">
            <h3 className="text-label text-surface mb-6">Découvrir</h3>
            <a href="/" className="link-footer text-surface/70 hover:text-surface pt-4">Accueil</a>
            <a href="/missions" className="link-footer text-surface/70 hover:text-surface">Nos missions</a>
            <a href="/notre-impact" className="link-footer text-surface/70 hover:text-surface">Notre impact</a>
            <a href="/actions-educatives" className="link-footer text-surface/70 hover:text-surface">Actions éducatives</a>
            <a href="/medias-et-actualites" className="link-footer text-surface/70 hover:text-surface">Médias & actualités</a>
            <a href="/a-propos" className="link-footer text-surface/70 hover:text-surface">À propos</a>
          </div>
        </div>

        {/* Séparateur entre ligne 1 et ligne 2 */}
        <div className="h-px bg-surface/20 my-8" />

        {/* Ligne 2 — Col3 (1/3) + Col4 (2/3) */}
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-2 w-1/3">
            <h3 className="text-label text-surface mb-6">S'engager</h3>
            <a href="/missions" className="link-footer text-surface/70 hover:text-surface pt-4">Partir en mission</a>
            <a href="/don" className="link-footer text-surface/70 hover:text-surface">Faire un don</a>
            <a href="/adhesion" className="link-footer text-surface/70 hover:text-surface">Adhérer à l'association</a>
          </div>
          <div className="w-px bg-surface/20 self-stretch" />
          <div className="flex flex-col gap-4 w-2/3">
            <h3 className="text-label text-surface mb-6">Nous contacter</h3>
            <div className="flex gap-3">
              <IconPin className="text-surface text-lg mt-1 shrink-0" />
              <a href="https://maps.google.com/?q=3bis+rue+de+Guigonis+06300+Nice" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
                Antenne en France - Maison des associations<br />3bis rue de Guigonis, 06300 Nice
              </a>
            </div>
            <div className="flex gap-3">
              <IconPin className="text-surface text-lg mt-1 shrink-0" />
              <a href="https://maps.google.com/?q=Cite+Solidarite+Internationale+74100+Annemasse" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
                Annexe Française<br />Cité de la Solidarité Internationale, 74100 Annemasse
              </a>
            </div>
            <div className="flex gap-3">
              <IconPin className="text-surface text-lg mt-1 shrink-0" />
              <a href="https://maps.google.com/?q=15+rue+des+Savoises+1205+Geneve" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
                Antenne Suisse - Maison Internationale des associations<br />15 rue des Savoises, 1205 Genève
              </a>
            </div>
            <div className="flex gap-3">
              <IconMail className="text-surface text-lg mt-1 shrink-0" />
              <a href="mailto:contact@sensolidaire.org" className="link-inline text-surface/70 hover:text-surface">contact@sensolidaire.org</a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Desktop (1280+) ── */}
      <div className="bg-primary px-20 py-8 hidden xl:flex flex-row gap-0 justify-between">

        {/* Col 1 */}
        <div className="flex flex-col gap-4 w-84 justify-between">
          <div className="flex items-start gap-6">
            <div className="bg-white/50 rounded-full p-1 w-fit">
              <img src="/logo.png" alt="Sens Solidaire" className="h-14" />
            </div>
            <span className="text-brand text-surface">Sens Solidaires</span>
          </div>
          <p className="text-body text-surface">Une association engagée pour un monde plus solidaire et durable.</p>
          <p className="text-body text-surface/80">Sur le terrain, nous agissons aux côtés des communautés locales pour un impact positif et durable.</p>
          <div className="flex gap-6">
            <a href="https://www.youtube.com/channel/UC4lhQB-8zXiZJvD-kQS-q4A/featured"><IconYoutube className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.linkedin.com/company/sens-solidaires/"><IconLinkedin className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.instagram.com/sens_solidaires/"><IconInstagram className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.facebook.com/Sensolidaires"><IconFacebook className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
            <a href="https://www.tiktok.com/@sensolidaires?lang=fr&is_copy_url=1&is_from_webapp=v1"><IconTikTok className="text-surface text-2xl hover:text-accent-green cursor-pointer transition-colors" /></a>
          </div>
        </div>

        <div className="w-px bg-surface/20 mx-8 self-center h-64" />

        {/* Col 2 */}
        <div className="flex flex-col gap-2 w-40">
          <h3 className="text-label text-surface mb-6">Découvrir</h3>
          <a href="/" className="link-footer text-surface/70 hover:text-surface pt-4">Accueil</a>
          <a href="/missions" className="link-footer text-surface/70 hover:text-surface">Nos missions</a>
          <a href="/notre-impact" className="link-footer text-surface/70 hover:text-surface">Notre impact</a>
          <a href="/actions-educatives" className="link-footer text-surface/70 hover:text-surface">Actions éducatives</a>
          <a href="/medias-et-actualites" className="link-footer text-surface/70 hover:text-surface">Médias & actualités</a>
          <a href="/a-propos" className="link-footer text-surface/70 hover:text-surface">À propos</a>
        </div>

        <div className="w-px bg-surface/20 mx-8 self-center h-64" />

        {/* Col 3 */}
        <div className="flex flex-col gap-2 w-40">
          <h3 className="text-label text-surface mb-6">S'engager</h3>
          <a href="/missions" className="link-footer text-surface/70 hover:text-surface pt-4">Partir en mission</a>
          <a href="/don" className="link-footer text-surface/70 hover:text-surface">Faire un don</a>
          <a href="/adhesion" className="link-footer text-surface/70 hover:text-surface">Adhérer à l'association</a>
        </div>

        <div className="w-px bg-surface/20 mx-8 self-center h-64" />

        {/* Col 4 */}
        <div className="flex flex-col gap-4 w-84">
          <h3 className="text-label text-surface mb-6">Nous contacter</h3>
          <div className="flex gap-3">
            <IconPin className="text-surface text-lg mt-1 shrink-0" />
            <a href="https://maps.google.com/?q=3bis+rue+de+Guigonis+06300+Nice" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
              Antenne en France - Maison des associations<br />3bis rue de Guigonis, 06300 Nice
            </a>
          </div>
          <div className="flex gap-3">
            <IconPin className="text-surface text-lg mt-1 shrink-0" />
            <a href="https://maps.google.com/?q=Cite+Solidarite+Internationale+74100+Annemasse" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
              Annexe Française<br />Cité de la Solidarité Internationale, 74100 Annemasse
            </a>
          </div>
          <div className="flex gap-3">
            <IconPin className="text-surface text-lg mt-1 shrink-0" />
            <a href="https://maps.google.com/?q=15+rue+des+Savoises+1205+Geneve" target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
              Antenne Suisse - Maison Internationale des associations<br />15 rue des Savoises, 1205 Genève
            </a>
          </div>
          <div className="flex gap-3">
            <IconMail className="text-surface text-lg mt-1 shrink-0" />
            <a href="mailto:contact@sensolidaire.org" className="link-inline text-surface/70 hover:text-surface">contact@sensolidaire.org</a>
          </div>
        </div>

      </div>

      {/* Zone 3 — Barre légale */}
      <div className="bg-dark px-6 md:px-20 py-4 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center border-t border-surface/15">
        <p className="text-caption text-surface/50 italic">
          © 2026 Sens Solidaire. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          <a href="/mentions-legales" className="link-footer text-surface/50 hover:text-surface">Mentions légales</a>
          <a href="/confidentialite" className="link-footer text-surface/50 hover:text-surface">Confidentialité</a>
          <a href="/cookies" className="link-footer text-surface/50 hover:text-surface">Cookies</a>
        </div>
      </div>

    </footer>
  )
}

export default Footer