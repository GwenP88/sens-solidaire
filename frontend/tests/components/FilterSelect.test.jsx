// tests/components/FilterSelect.test.jsx
// Menus déroulants de filtres du site : options, valeur active, retour à « tous », affichage conditionnel.

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FilterSelect from '../../src/components/navigation/FilterSelect'
import { buildCountryOptions, getFilterConfigCountry } from '../../src/utils/filters'

const FILTERS = getFilterConfigCountry(buildCountryOptions(['Pérou', 'Kenya']))

describe('FilterSelect', () => {
  it('propose « Tous les pays » puis les pays triés', () => {
    render(<FilterSelect filters={FILTERS} values={{}} onChange={vi.fn()} />)
    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['Tous les pays', 'Kenya', 'Pérou'])
  })

  it('transmet (clé, valeur) au changement, et null pour revenir à « tous »', () => {
    const onChange = vi.fn()
    render(<FilterSelect filters={FILTERS} values={{ country: 'Kenya' }} onChange={onChange} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('Kenya')

    fireEvent.change(select, { target: { value: 'Pérou' } })
    expect(onChange).toHaveBeenLastCalledWith('country', 'Pérou')

    fireEvent.change(select, { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith('country', null)
  })

  it('un filtre avec condition non remplie est masqué', () => {
    const filters = [{ key: 'annee', placeholder: 'Année', options: [], condition: (values) => values.vue === 'rapports' }]
    render(<FilterSelect filters={filters} values={{ vue: 'temoignages' }} onChange={vi.fn()} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })
})
