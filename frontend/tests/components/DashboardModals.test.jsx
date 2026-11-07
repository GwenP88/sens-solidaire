// tests/components/DashboardModals.test.jsx
// Modales du dashboard : confirmation (ConfirmModal) et message d'erreur (ErrorModal, remplace les alert()).

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ConfirmModal from '../../src/components/admin/ConfirmModal'
import ErrorModal from '../../src/components/admin/ErrorModal'

describe('ConfirmModal', () => {
  it('affiche le message et le libellé du bouton de confirmation', () => {
    render(<ConfirmModal title="Supprimer" message="Voulez-vous supprimer ce lieu ?" confirmLabel="Supprimer définitivement" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Voulez-vous supprimer ce lieu ?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Supprimer définitivement' })).toBeInTheDocument()
  })

  it('Confirmer appelle onConfirm, Annuler appelle onCancel', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmModal title="T" message="M" confirmLabel="Oui" onConfirm={onConfirm} onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Oui' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('variante danger par défaut : titre en rouge', () => {
    render(<ConfirmModal title="Supprimer" message="M" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Supprimer' }).className).toContain('text-dash-danger')
  })
})

describe('ErrorModal', () => {
  it('affiche le message et un titre par défaut', () => {
    render(<ErrorModal message="La suppression n'a pas abouti." onClose={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Une erreur est survenue' })).toBeInTheDocument()
    expect(screen.getByText("La suppression n'a pas abouti.")).toBeInTheDocument()
  })

  it('un seul bouton, « Fermer », qui reçoit le focus (fermeture immédiate au clavier)', () => {
    const onClose = vi.fn()
    render(<ErrorModal message="Erreur" onClose={onClose} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveFocus()
    fireEvent.click(buttons[0])
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
