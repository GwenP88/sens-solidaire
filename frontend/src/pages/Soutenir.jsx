// Soutenir.jsx
// Page don & adhésion — redirections HelloAsso

import HeroPage from '../components/layout/HeroPage'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import { IconHeart, IconPeople, IconGuide, IconGlobe, IconLeaf } from '../utils/icons'
import AnchorNav from '../components/navigation/AnchorNav'

// Rapports d'activité
const RAPPORTS = [
  { annee: 2024, url: "https://www.sensolidaire.org/wp-content/uploads/2025/06/Rapport-dactivites-2024-1.pdf" },
  { annee: 2023, url: "https://www.sensolidaire.org/wp-content/uploads/2024/07/Rapport-des-activites-2023.pdf" },
  { annee: 2022, url: "https://www.sensolidaire.org/wp-content/uploads/2023/11/Rapport-dactivites-2022.pdf" },
  { annee: 2021, url: "https://www.sensolidaire.org/wp-content/uploads/2023/04/rapport-annuel-2021.pdf" },
  { annee: 2020, url: "https://www.sensolidaire.org/wp-content/uploads/2021/05/rapportmoral-2020.pdf" },
  { annee: 2019, url: "https://www.sensolidaire.org/wp-content/uploads/2020/05/rapportannuel19-compress%C3%A9-1.pdf" },
  { annee: 2018, url: "https://www.sensolidaire.org/wp-content/uploads/2020/02/rapportactivit%C3%A9s18.pdf" },
  { annee: 2017, url: "https://www.sensolidaire.org/wp-content/uploads/2019/10/rapportactivit%C3%A9s17.pdf" },
  { annee: 2016, url: "https://www.sensolidaire.org/wp-content/uploads/2025/01/rapportannuel16.pdf" },
  { annee: 2015, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportdactivit%C3%A92015.pdf" },
  { annee: 2014, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportactivit%C3%A914.pdf" },
  { annee: 2013, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportannuel13.pdf" },
  { annee: 2012, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportmoral2012.pdf" },
]

// Raisons de soutenir
const RAISONS = [
  { icon: IconLeaf, titre: "Protéger la nature", description: "Nous agissons pour la préservation de la biodiversité et des écosystèmes." },
  { icon: IconPeople, titre: "Soutenir les populations", description: "Nous travaillons main dans la main avec les communautés locales." },
  { icon: IconGuide, titre: "Éduquer et sensibiliser", description: "Nous formons et encourageons les nouvelles générations à agir." },
  { icon: IconGlobe, titre: "Favoriser les échanges", description: "Nous créons des ponts entre les cultures et encourageons la solidarité internationale." },
  { icon: IconHeart, titre: "Agir avec éthique", description: "Nos actions sont guidées par la transparence, le respect et la durabilité." },
]

function Soutenir() {
  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/hero_missions.jpg"
        title="Soutenir Sens Solidaire"
        subtitle="Chaque geste compte pour construire un monde plus juste et plus durable."
      />

      <AnchorNav
      variant="dark"
      sections={[
        { label: "Faire un don", id: "don" },
        { label: "Adhérer", id: "adhesion" },
        { label: "Pourquoi nous soutenir", id: "pourquoi" },
        { label: "Rapports d'activité", id: "rapports" },
      ]}
    />

      {/* ── Section Don ── */}
      <section id="don" className="section-padding bg-surface">
        <div className="flex gap-12 items-center">

          {/* Photo */}
          <div className="w-2/5 shrink-0">
            <img
              src="/images/jardin_potager_kenya.jpg"
              alt="Faire un don"
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>

          {/* Contenu */}
          <div className="flex flex-col gap-6 flex-1">
            <p className="font-body text-xs font-bold text-accent-2 uppercase tracking-widest">Faire un don</p>
            <h2 className="section-title text-primary">Soutenez nos actions sur le terrain</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              Votre don permet de financer nos projets de solidarité internationale, nos actions éducatives et environnementales, et d'accompagner les populations locales dans la durée.
            </p>

            {/* 3 arguments */}
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

            <div className="flex flex-col gap-2">
              <a href="https://www.helloasso.com/associations/sens-solidaires/formulaires/1/widget" target="_blank" rel="noopener noreferrer">
                <Button label="Je fais un don →" variant="primary" />
              </a>
              <p className="font-body text-xs text-primary/40 italic">Paiement 100% sécurisé via HelloAsso</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section Adhésion ── */}
      <section id="adhesion" className="section-padding bg-surface-mid">
        <div className="flex gap-12 items-center">

          {/* Contenu */}
          <div className="flex flex-col gap-6 flex-1">
            <p className="font-body text-xs font-bold text-accent-2 uppercase tracking-widest">Adhérer à l'association</p>
            <h2 className="section-title text-primary">Devenez membre de Sens Solidaire</h2>
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              En adhérant à l'association, vous rejoignez une communauté engagée et vous soutenez nos actions tout au long de l'année. Votre voix compte dans la vie de l'association !
            </p>

            {/* 4 bénéfices */}
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

            {/* Tarifs */}
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

            <div className="flex flex-col gap-2">
              <a href="https://www.helloasso.com/associations/sens-solidaires/adhesions/adhesion-a-l-association-sens-solidaires" target="_blank" rel="noopener noreferrer">
                <Button label="J'adhère à l'association →" variant="secondary" />
              </a>
              <p className="font-body text-xs text-primary/40 italic">Adhésion en ligne via HelloAsso</p>
            </div>
          </div>

          {/* Photo */}
          <div className="w-2/5 shrink-0">
            <img
              src="/images/groupe-jeune-2.jpg"
              alt="Adhérer à l'association"
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>

        </div>
      </section>

      {/* ── Pourquoi nous soutenir ── */}
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

      {/* ── Transparence + Rapports ── */}
      <section id="rapports" className="section-padding bg-surface-mid">
        <div className="flex gap-12 items-center">

          {/* Texte */}
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

          {/* Image */}
          <div className="w-2/5 shrink-0">
            <img
              src="/images/rapport-placeholder.jpg"
              alt="Rapport d'activité"
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>

        </div>
      </section>

      {/* ── CTA Contact ── */}
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