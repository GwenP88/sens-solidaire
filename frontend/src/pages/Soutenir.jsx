// Soutenir.jsx
// Page don & adhésion — redirections HelloAsso

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import AnchorNav from '../components/navigation/AnchorNav'

// ── Utils
import { IconHeart, IconPeople, IconGuide, IconGlobe, IconLeaf } from '../utils/icons'

// ── Données statiques — raisons de soutenir (contenu fixe)
const RAISONS = [
  { icon: IconLeaf, titre: "Protéger la nature", description: "Nous agissons pour la préservation de la biodiversité et des écosystèmes." },
  { icon: IconPeople, titre: "Soutenir les populations", description: "Nous travaillons main dans la main avec les communautés locales." },
  { icon: IconGuide, titre: "Éduquer et sensibiliser", description: "Nous formons et encourageons les nouvelles générations à agir." },
  { icon: IconGlobe, titre: "Favoriser les échanges", description: "Nous créons des ponts entre les cultures et encourageons la solidarité internationale." },
  { icon: IconHeart, titre: "Agir avec éthique", description: "Nos actions sont guidées par la transparence, le respect et la durabilité." },
]

// ── Données statiques — sections de l'AnchorNav
const ANCHOR_SECTIONS = [
  { label: "Faire un don", id: "don" },
  { label: "Adhérer", id: "adhesion" },
  { label: "Pourquoi nous soutenir", id: "pourquoi" },
  { label: "Rapports d'activité", id: "rapports" },
]

function Soutenir() {
  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero_missions.jpg"
        title="Soutenir Sens Solidaire"
        subtitle="Chaque geste compte pour construire un monde plus juste et plus durable."
      />

      {/* ── Navigation ancres ── */}
      <AnchorNav variant="dark" sections={ANCHOR_SECTIONS} />

      {/* ── Section Don — photo + texte + CTA HelloAsso ── */}
      <section id="don" className="section-padding bg-surface">
        <div className="flex gap-12 items-center">

          {/* Photo illustration don */}
          <div className="w-2/5 shrink-0">
            <img
              src="/images/jardin_potager_kenya.jpg"
              alt="Faire un don"
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>

          {/* Contenu texte + arguments + CTA */}
          <div className="flex flex-col gap-6 flex-1">
            <p className="font-body text-xs font-bold text-accent-2 uppercase tracking-widest">Faire un don</p>
            <h2 className="section-title text-primary">Soutenez nos actions sur le terrain</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Votre don permet de financer nos projets de solidarité internationale, nos actions éducatives et environnementales, et d'accompagner les populations locales dans la durée.
            </p>

            {/* 3 arguments clés */}
            <div className="flex gap-6">
              {[
                { titre: "Action concrète", desc: "Des projets utiles et durables" },
                { titre: "Impact humain", desc: "Auprès des populations et des écosystèmes" },
                { titre: "Déduction fiscale", desc: "66% de votre don déductible d'impôts" },
              ].map(a => (
                <div key={a.titre} className="flex flex-col gap-1 flex-1">
                  <p className="font-body font-bold text-primary text-sm">{a.titre}</p>
                  <p className="font-body text-xs text-primary/60">{a.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA don via HelloAsso */}
            <div className="flex flex-col gap-2">
              <a href="https://www.helloasso.com/associations/sens-solidaires/formulaires/1/widget" target="_blank" rel="noopener noreferrer">
                <Button label="Je fais un don →" variant="primary" />
              </a>
              <p className="font-body text-xs text-primary/40 italic">Paiement 100% sécurisé via HelloAsso</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section Adhésion — texte + tarifs + CTA + photo ── */}
      <section id="adhesion" className="section-padding bg-surface-mid">
        <div className="flex gap-12 items-center">

          {/* Contenu texte + bénéfices + tarifs + CTA */}
          <div className="flex flex-col gap-6 flex-1">
            <p className="font-body text-xs font-bold text-accent-2 uppercase tracking-widest">Adhérer à l'association</p>
            <h2 className="section-title text-primary">Devenez membre de Sens Solidaire</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              En adhérant à l'association, vous rejoignez une communauté engagée et vous soutenez nos actions tout au long de l'année. Votre voix compte dans la vie de l'association !
            </p>

            {/* 4 bénéfices de l'adhésion */}
            <div className="flex gap-6">
              {[
                "Participez à la vie associative",
                "Recevez nos informations",
                "Soutenez nos projets",
                "Faites partie d'un réseau engagé",
              ].map(b => (
                <p key={b} className="font-body text-xs text-primary/70 text-center flex-1">{b}</p>
              ))}
            </div>

            {/* Grille des tarifs d'adhésion */}
            <div className="bg-surface rounded-xl p-4 flex gap-6">
              {[
                { type: "Particulier", prix: "25 €" },
                { type: "Association / Collectivité", prix: "50 €" },
                { type: "Entreprise", prix: "250 €" },
              ].map(t => (
                <div key={t.type} className="flex flex-col gap-1 flex-1 text-center">
                  <p className="font-heading font-bold text-primary text-xl">{t.prix}</p>
                  <p className="font-body text-xs text-primary/60">{t.type}</p>
                </div>
              ))}
            </div>

            {/* CTA adhésion via HelloAsso */}
            <div className="flex flex-col gap-2">
              <a href="https://www.helloasso.com/associations/sens-solidaires/adhesions/adhesion-a-l-association-sens-solidaires" target="_blank" rel="noopener noreferrer">
                <Button label="J'adhère à l'association →" variant="secondary" />
              </a>
              <p className="font-body text-xs text-primary/40 italic">Adhésion en ligne via HelloAsso</p>
            </div>
          </div>

          {/* Photo illustration adhésion */}
          <div className="w-2/5 shrink-0">
            <img
              src="/images/groupe-jeune-2.jpg"
              alt="Adhérer à l'association"
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>

        </div>
      </section>

      {/* ── Pourquoi nous soutenir — grille 5 colonnes avec icônes ── */}
      <section id="pourquoi" className="section-padding bg-surface">
        <p className="font-body text-xs font-bold text-accent-2 uppercase tracking-widest text-center mb-2">Pourquoi nous soutenir ?</p>
        <h2 className="section-title text-primary text-center mb-10">Ensemble, agissons pour un impact durable</h2>
        <div className="grid grid-cols-5 gap-6">
          {RAISONS.map(r => (
            <div key={r.titre} className="flex flex-col items-center gap-3 text-center">
              <r.icon className="text-accent-2 text-3xl" />
              <p className="font-heading font-bold text-primary text-sm">{r.titre}</p>
              <p className="font-body text-xs text-primary/60 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Transparence + lien rapports d'activité ── */}
      <section id="rapports" className="section-padding bg-surface-mid">
        <div className="flex gap-12 items-center">

          {/* Texte engagement transparence */}
          <div className="flex flex-col gap-4 flex-1">
            <p className="font-body text-xs font-bold text-accent-2 uppercase tracking-widest">Notre engagement</p>
            <h2 className="section-title text-primary">Transparence et confiance</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Sens Solidaire agit en toute transparence. Nos comptes sont contrôlés et nos rapports d'activité sont publiés chaque année.
            </p>
            <a href="/rapports-activite">
              <Button label="Consulter nos rapports d'activité →" variant="secondary" />
            </a>
          </div>

          {/* Image rapport */}
          <div className="w-2/5 shrink-0">
            <img
              src="/images/rapport-activite.png"
              alt="Rapport d'activité"
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>

        </div>
      </section>

      {/* ── CTA contact ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-surface mb-2">Une question ? Envie de vous engager autrement ?</h2>
            <p className="font-body text-surface/80 text-sm">Notre équipe est à votre écoute pour vous accompagner dans votre engagement.</p>
          </div>
          <a href="/contact">
            <Button label="Nous contacter →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Soutenir