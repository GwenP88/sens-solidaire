// tests/pages/Testimonials.test.jsx
// Page publique /temoignages : filtres pays dérivés des données (tâche 170) et filtre destination des rapports (bug corrigé).

import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Testimonials from '../../src/pages/Testimonials'

vi.mock('../../src/services/api', () => ({
  fetchTestimonials: vi.fn(() => Promise.resolve([
    { id: 1, content: 'Une expérience au Kenya.', author_name: 'Léa', annee: 2025, mission: { title: 'Mission Kenya', country: 'Kenya', type: 'individuel' } },
    { id: 2, content: 'Une expérience au Pérou.', author_name: 'Hugo', annee: 2025, mission: { title: 'Mission Pérou', country: 'Pérou', type: 'individuel' } },
  ])),
  // Le dashboard enregistre la destination avec sa majuscule ("Kenya")
  fetchMissionReports: vi.fn(() => Promise.resolve([
    { id: 9, auteur: 'Rapport de Tom', destination: 'Kenya', type: 'individuel', annee: 2025, pdf_url: '/r.pdf' },
  ])),
  fetchMissions: vi.fn(() => Promise.resolve([])),
  submitTestimonial: vi.fn(),
  uploadFile: vi.fn(),
}))

const renderAt = (url) => render(<MemoryRouter initialEntries={[url]}><Testimonials /></MemoryRouter>)

const destinationSelect = () =>
  screen.getAllByRole('combobox').find(s => within(s).queryByText('Toutes les destinations'))

describe('Page Témoignages', () => {
  it('les destinations proposées sont celles des contenus publiés (pas une liste figée)', async () => {
    renderAt('/temoignages')
    await screen.findByText('Léa')
    const options = within(destinationSelect()).getAllByRole('option').map(o => o.textContent)
    expect(options).toEqual(['Toutes les destinations', 'Kenya', 'Pérou'])
  })

  it('filtre ?destination=kenya : garde le témoignage ET le rapport du Kenya (régression : le rapport disparaissait)', async () => {
    renderAt('/temoignages?destination=kenya')
    expect(await screen.findByText('Léa')).toBeInTheDocument()
    expect(await screen.findByText('Rapport de Tom')).toBeInTheDocument()
    expect(screen.queryByText('Hugo')).not.toBeInTheDocument()
  })
})
