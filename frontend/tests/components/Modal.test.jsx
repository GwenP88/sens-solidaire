// tests/components/Modal.test.jsx
// Modale du site public : ouverture, fermeture (bouton, Échap, clic à l'extérieur), blocage du défilement.

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Modal from '../../src/components/ui/Modal'

const renderModal = (props = {}) => {
  const onClose = vi.fn()
  render(<Modal isOpen onClose={onClose} title="Partager votre témoignage" {...props}><p>Contenu</p></Modal>)
  return onClose
}

describe('Modal', () => {
  it("n'affiche rien quand elle est fermée", () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Titre"><p>Contenu</p></Modal>)
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument()
  })

  it('affiche le titre et le contenu', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: 'Partager votre témoignage' })).toBeInTheDocument()
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('se ferme avec le bouton « Fermer »', () => {
    const onClose = renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('se ferme avec la touche Échap', () => {
    const onClose = renderModal()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("un clic DANS la modale ne la ferme pas (formulaire en cours de saisie)", () => {
    const onClose = renderModal()
    fireEvent.click(screen.getByText('Contenu'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('bloque le défilement de la page pendant son ouverture, puis le rétablit', () => {
    const { unmount } = render(<Modal isOpen onClose={vi.fn()} title="T"><p>x</p></Modal>)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
