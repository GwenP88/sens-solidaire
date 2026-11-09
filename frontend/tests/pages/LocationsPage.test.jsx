// tests/pages/LocationsPage.test.jsx
// Liste admin des lieux : erreur de chargement, confirmation, et modale d'erreur au lieu d'un alert() (tâche 127).

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LocationsPage from '../../src/pages/admin/LocationsPage'
import { fetchAdminLocations, toggleLocationActive, hardDeleteLocation } from '../../src/services/api'
import { ADMIN_ERRORS } from '../../src/utils/adminErrors'

vi.mock('../../src/services/api', () => ({
  fetchAdminLocations: vi.fn(),
  toggleLocationActive: vi.fn(),
  hardDeleteLocation: vi.fn(),
}))

const LOCATION = { id: 1, name: 'Centre Naivasha', country: 'Kenya', is_active: true, delegation: null }

const renderPage = () => render(<MemoryRouter><LocationsPage /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  fetchAdminLocations.mockResolvedValue([LOCATION])
})

describe('LocationsPage', () => {
  it('affiche les lieux chargés', async () => {
    renderPage()
    expect(await screen.findByText('Centre Naivasha')).toBeInTheDocument()
  })

  it('chargement impossible → message vouvoyé', async () => {
    fetchAdminLocations.mockRejectedValue(new Error('réseau'))
    renderPage()
    expect(await screen.findByText(/Impossible de charger les lieux/)).toBeInTheDocument()
  })

  it('mise en pause : confirmation demandée avant tout appel au serveur', async () => {
    renderPage()
    fireEvent.click(await screen.findByRole('button', { name: 'Mettre en pause 1' }))
    expect(screen.getByText(/deviendra invisible sur le site/)).toBeInTheDocument()
    expect(toggleLocationActive).not.toHaveBeenCalled()
  })

  it('échec de la mise en pause → modale d\'erreur (plus d\'alert du navigateur)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    toggleLocationActive.mockRejectedValue(new Error('réseau'))
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Mettre en pause 1' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Mettre en pause' }).at(-1))

    expect(await screen.findByText(ADMIN_ERRORS.toggle)).toBeInTheDocument()
    expect(alertSpy).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(screen.queryByText(ADMIN_ERRORS.toggle)).not.toBeInTheDocument()
    alertSpy.mockRestore()
  })

  it('suppression définitive confirmée → appel au serveur puis rechargement de la liste', async () => {
    hardDeleteLocation.mockResolvedValue({ success: true })
    renderPage()
    fireEvent.click(await screen.findByRole('button', { name: 'Supprimer définitivement 1' }))
    fetchAdminLocations.mockResolvedValue([])
    fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer définitivement' }).at(-1))

    expect(await screen.findByText('Aucune donnée à afficher pour le moment.')).toBeInTheDocument()
    expect(hardDeleteLocation).toHaveBeenCalledWith(1)
  })
})
