// Filters.jsx
// Composant chapeau — orchestre FilterSelect et FilterChips selon le contenu reçu
// Gère la mise en page responsive commune à toutes les barres de filtres du site
//
// Props :
//   selects : config FILTER_CONFIG_* (optionnel) — voir FilterSelect
//   selectValues : objet des valeurs actives des selects (optionnel, requis si selects fourni)
//   onSelectChange : fonction (key, value) appelée au changement d'un select (optionnel, requis si selects fourni)
//   chips : { filters, active, onChange, variant? } (optionnel) — voir FilterChips
//
// Comportement responsive :
//   - selects seuls   → empilés pleine largeur en mobile, en ligne à partir de 768px
//   - chips seules     → FilterChips gère son propre scroll horizontal (scrollable=true par défaut)
//   - selects + chips  → mobile : selects empilés + chips transformées en select empilé
//                         768px+ : selects en ligne (taille fixe) + chips en puces à la suite
//                         Le scroll horizontal est géré ICI, pas dans FilterChips (scrollable=false)
//                         pour éviter un double scroll imbriqué (scroll parent + scroll enfant)

import FilterSelect from './FilterSelect'
import FilterChips from './FilterChips'

function Filters({ selects, selectValues, onSelectChange, chips }) {
  const hasSelects = Boolean(selects?.length)
  const hasChips = Boolean(chips?.filters?.length)

  // ── Cas 1 — chips seules : comportement inchangé, FilterChips gère son propre scroll
  if (hasChips && !hasSelects) {
    return (
      <FilterChips
        filters={chips.filters}
        active={chips.active}
        onChange={chips.onChange}
        variant={chips.variant}
        nowrap={chips.nowrap}
      />
    )
  }

  // ── Cas 2 — selects seuls : comportement inchangé, géré entièrement par FilterSelect
  if (hasSelects && !hasChips) {
    return (
      <FilterSelect
        filters={selects}
        values={selectValues}
        onChange={onSelectChange}
      />
    )
  }

  // ── Cas 3 — selects + chips combinés
  // Config select dérivée des chips — réutilisée uniquement pour le rendu mobile
  const chipsAsSelectConfig = [
    {
      key: '__chips_as_select',
      placeholder: 'Tous',
      options: chips.filters
        .filter(f => f.value !== null)
        .map(f => ({ value: f.value, label: f.label })),
    },
  ]

  // ── Valeur + onChange adaptés pour la version select des chips
  const chipsAsSelectValues = { __chips_as_select: chips.active }
  const handleChipsAsSelectChange = (_key, value) => chips.onChange(value)

  // ── Fond du conteneur scrollable — doit matcher le fond de la page autour des chips
  // variant "dark" = fond bg-primary (cas actuel sur fond vert) / "light" = pas de fond forcé (page sur fond clair)
  const scrollBg = chips.variant === 'dark' ? 'bg-primary' : ''

  return (
    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6 min-w-0">

      {/* ── Selects — shrink-0 pour garder leur taille fixe à côté des chips ── */}
      <div className="shrink-0">
        <FilterSelect
          filters={selects}
          values={selectValues}
          onChange={onSelectChange}
        />
      </div>

      {/* ── Chips version mobile — transformées en select, cachées dès 768px ── */}
      <div className="md:hidden">
        <FilterSelect
          filters={chipsAsSelectConfig}
          values={chipsAsSelectValues}
          onChange={handleChipsAsSelectChange}
        />
      </div>

      {/* ── Chips version desktop — scroll géré ici (scrollBg + overflow-x-auto) ── */}
      {/* scrollable=false sur FilterChips : évite le double scroll imbriqué (parent + enfant) */}
      <div className={`hidden md:block flex-1 w-full min-w-0 overflow-x-auto scroll-pb ${scrollBg}`}>
        <div className="inline-flex">
          <FilterChips
            filters={chips.filters}
            active={chips.active}
            onChange={chips.onChange}
            variant={chips.variant}
            scrollable={false}
          />
        </div>
      </div>

    </div>
  )
}

export default Filters