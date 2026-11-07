// tests/pages/Impact.test.jsx
// Page publique /notre-impact : filtre pays construit à partir des actions publiées (tâche 170).

import { render, screen, within, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Impact from '../../src/pages/Impact'

const action = (id, title, countries) => ({
  id, slug: `action-${id}`, title, description: 'Résumé', image_url: null,
  tags: [{ tag: 'Biodiversité' }], odds: [{ odd_number: 15 }], countries: countries.map(country => ({ country })),
})

vi.mock('../../src/services/api', () => ({
  fetchFieldActions: vi.fn(() => Promise.resolve([
    action(1, 'Puits au Sénégal', ['Sénégal']),
    action(2, 'Reboisement', ['Kenya', 'Pérou']),
  ])),
}))

const countrySelect = () => screen.getAllByRole('combobox').find(s => within(s).queryByText('Tous les pays'))

describe('Page Notre Impact', () => {
  it('propose uniquement les pays des actions publiées, sans doublon et triés', async () => {
    render(<MemoryRouter><Impact /></MemoryRouter>)
    await screen.findByText('Puits au Sénégal')
    const options = within(countrySelect()).getAllByRole('option').map(o => o.textContent)
    expect(options).toEqual(['Tous les pays', 'Kenya', 'Pérou', 'Sénégal'])
  })

  it('choisir un pays n\'affiche que ses actions (une action peut avoir plusieurs pays)', async () => {
    render(<MemoryRouter><Impact /></MemoryRouter>)
    await screen.findByText('Puits au Sénégal')
    fireEvent.change(countrySelect(), { target: { value: 'Pérou' } })
    expect(screen.getByText('Reboisement')).toBeInTheDocument()
    expect(screen.queryByText('Puits au Sénégal')).not.toBeInTheDocument()
  })

  it('lien partagé ?pays=Sénégal : filtre appliqué dès l\'arrivée', async () => {
    render(<MemoryRouter initialEntries={['/notre-impact?pays=Sénégal']}><Impact /></MemoryRouter>)
    expect(await screen.findByText('Puits au Sénégal')).toBeInTheDocument()
    expect(screen.queryByText('Reboisement')).not.toBeInTheDocument()
  })
})
