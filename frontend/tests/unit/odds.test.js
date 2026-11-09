// tests/unit/odds.test.js
// Tests unitaires des données ODD (libellés, liste ordonnée, correspondance avec les filtres de Notre Impact).

import { describe, it, expect } from 'vitest'
import { ODDS, ODDS_LABELS, ODD_TO_CATEGORY } from '../../src/utils/odds'
import { FILTERS_ACTION_TAGS } from '../../src/utils/filters'

describe('ODD', () => {
  it('les 17 ODD ont un libellé, dans l\'ordre de 1 à 17', () => {
    expect(ODDS).toHaveLength(17)
    expect(ODDS.map(o => o.n)).toEqual(Array.from({ length: 17 }, (_, i) => i + 1))
    ODDS.forEach(o => expect(o.label).toBe(ODDS_LABELS[o.n]))
  })

  it('chaque ODD est rattaché à une catégorie', () => {
    for (let n = 1; n <= 17; n++) expect(ODD_TO_CATEGORY[n]).toBeDefined()
  })

  it('chaque catégorie correspond EXACTEMENT à un filtre de la page Notre Impact (sinon le filtre ne trouve rien)', () => {
    const filterValues = FILTERS_ACTION_TAGS.map(f => f.value).filter(Boolean)
    new Set(Object.values(ODD_TO_CATEGORY)).forEach(category => expect(filterValues).toContain(category))
  })
})
