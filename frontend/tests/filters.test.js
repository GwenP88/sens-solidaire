// filters.test.js
// Vérifie buildCountryOptions (tâche 170) : liste de pays dérivée des données réelles.

import { describe, it, expect } from 'vitest'
import { buildCountryOptions } from '../src/utils/filters'

describe('buildCountryOptions', () => {

  it("supprime les doublons, même avec une casse différente, et ignore les valeurs vides", () => {
    const options = buildCountryOptions(['Kenya', 'kenya', null, '', '  ', 'Pérou', 'Kenya '])
    expect(options).toEqual([
      { value: 'Kenya', label: 'Kenya' },
      { value: 'Pérou', label: 'Pérou' },
    ])
  })

  it("trie par ordre alphabétique français (les accents ne passent pas en fin de liste)", () => {
    const labels = buildCountryOptions(['Sri Lanka', 'Égypte', 'Côte d\'Ivoire', 'Sénégal']).map(o => o.label)
    expect(labels).toEqual(['Côte d\'Ivoire', 'Égypte', 'Sénégal', 'Sri Lanka'])
  })

  it("met la valeur en minuscules si demandé (page Témoignages), sans toucher au libellé", () => {
    expect(buildCountryOptions(['Sénégal'], { lowercaseValue: true }))
      .toEqual([{ value: 'sénégal', label: 'Sénégal' }])
  })

  it("retourne une liste vide si aucune donnée n'est encore chargée", () => {
    expect(buildCountryOptions([])).toEqual([])
  })

})
