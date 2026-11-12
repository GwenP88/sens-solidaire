// tests/pages/Education.test.jsx
// Page publique /education-sensibilisation : sections venues du dashboard, menu d'ancres généré, encadré « Informations pratiques » (tâche 172).

import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Education from '../../src/pages/Education'

const section = (id, title, extra = {}) => ({
  id, slug: `section-${id}`, title, eyebrow: null,
  content: 'Texte de présentation.', audience: null, price_eur: null, price_chf: null, price_detail: null,
  items: [], images: [], buttons: [],
  ...extra,
})

vi.mock('../../src/services/api', () => ({
  fetchEducationSections: vi.fn(() => Promise.resolve([
    section(1, 'Label Éco-École', {
      content: 'Premier paragraphe.\n\nApports :\n- Expression écrite\n- Anglais',
      audience: 'college,lycee',
      price_eur: '500 €',
      price_chf: '480 CHF',
      buttons: [
        { id: 10, label: "S'inscrire", file_url: 'https://www.eco-ecole.org/' },
        { id: 11, label: 'Nous contacter', file_url: '/contact' },
      ],
    }),
    section(2, 'Ateliers scolaires', { price_eur: 'Gratuit', price_chf: 'gratuit' }),
  ])),
}))

const renderPage = () => render(<MemoryRouter><Education /></MemoryRouter>)

describe('Page Éducation & sensibilisation', () => {
  it('affiche les sections du dashboard, dans leur ordre', async () => {
    renderPage()
    await screen.findByRole('heading', { level: 2, name: 'Ateliers scolaires' }) // attend la réponse de l'API
    const texts = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(texts.indexOf('Label Éco-École')).toBeLessThan(texts.indexOf('Ateliers scolaires'))
  })

  it("menu d'ancres généré à partir des sections", async () => {
    renderPage()
    await screen.findAllByText('Label Éco-École')
    // Chaque titre apparaît deux fois : dans le menu d'ancres et comme titre de section
    expect(screen.getAllByText('Label Éco-École')).toHaveLength(2)
    expect(screen.getAllByText('Ateliers scolaires')).toHaveLength(2)
  })

  it('mise en forme du texte : « - » devient une puce', async () => {
    renderPage()
    expect(await screen.findByText('Expression écrite')).toBeInTheDocument()
    expect(screen.getByText('Expression écrite').closest('li')).not.toBeNull()
  })

  it('informations pratiques : public en clair, tarif en euros et en francs suisses', async () => {
    renderPage()
    const aside = (await screen.findAllByRole('complementary'))[0]
    expect(within(aside).getByText('Collège, Lycée')).toBeInTheDocument()
    expect(within(aside).getByText('500 € · 480 CHF')).toBeInTheDocument()
  })

  it('tarif identique dans les deux devises (« Gratuit ») : affiché une seule fois', async () => {
    renderPage()
    expect(await screen.findByText('Gratuit')).toBeInTheDocument()
  })

  it('boutons : autre site en nouvel onglet, page du site en lien interne', async () => {
    renderPage()
    const external = await screen.findByRole('link', { name: "S'inscrire" })
    expect(external).toHaveAttribute('target', '_blank')
    const internal = screen.getByRole('link', { name: 'Nous contacter' })
    expect(internal).toHaveAttribute('href', '/contact')
    expect(internal).not.toHaveAttribute('target')
  })
})
