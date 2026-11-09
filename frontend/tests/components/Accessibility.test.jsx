// tests/components/Accessibility.test.jsx
// Accessibilité de base (tâche 173) : boutons-liens valides, modale annoncée comme dialogue, icônes nommées.

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import Button from '../../src/components/ui/Button'
import Modal from '../../src/components/ui/Modal'
import FooterBrand from '../../src/components/layout/FooterBrand'

describe('Button — lien qui ressemble à un bouton', () => {
  it('avec `to` : un seul lien interne, sans <button> imbriqué', () => {
    render(<MemoryRouter><Button to="/contact" label="Nous contacter" /></MemoryRouter>)
    const link = screen.getByRole('link', { name: 'Nous contacter' })
    expect(link).toHaveAttribute('href', '/contact')
    expect(link.querySelector('button')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('avec `href` : lien externe ouvert dans un nouvel onglet, protégé (noopener)', () => {
    render(<Button href="https://example.org" label="Faire un don" />)
    const link = screen.getByRole('link', { name: 'Faire un don' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('sans lien : reste un vrai bouton', () => {
    const onClick = vi.fn()
    render(<Button label="Envoyer" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Modal — fenêtre de dialogue', () => {
  // Petite page de test : un bouton qui ouvre la modale
  function Page() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Ouvrir</button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Détails">contenu</Modal>
      </>
    )
  }

  it('annoncée comme dialogue, nommée par son titre', () => {
    render(<Page />)
    fireEvent.click(screen.getByText('Ouvrir'))
    const dialog = screen.getByRole('dialog', { name: 'Détails' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it("le focus entre dans la modale, puis revient au bouton d'origine à la fermeture", () => {
    render(<Page />)
    const opener = screen.getByText('Ouvrir')
    opener.focus()
    fireEvent.click(opener)
    expect(screen.getByRole('dialog')).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(opener).toHaveFocus()
  })
})

describe('Pied de page — réseaux sociaux', () => {
  it('chaque icône a un nom lisible et ouvre un nouvel onglet', () => {
    render(<FooterBrand />)
    for (const name of ['YouTube', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok']) {
      const link = screen.getByRole('link', { name: `${name} (nouvel onglet)` })
      expect(link).toHaveAttribute('target', '_blank')
    }
  })
})
