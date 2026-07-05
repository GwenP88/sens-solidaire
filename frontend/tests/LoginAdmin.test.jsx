// LoginAdmin.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginAdmin from '../src/pages/admin/LoginAdmin'

// Mock de useNavigate — on vérifie juste QU'IL est appelé, pas la vraie navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('LoginAdmin', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    global.fetch = vi.fn()  // remplace fetch par une fonction contrôlée
  })

  it('redirige vers /admin après une connexion réussie', async () => {
    // On dit à "fetch" : la prochaine fois qu'on t'appelle, réponds ceci
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'fake-token' }),
    })

    render(<LoginAdmin />)

    fireEvent.change(screen.getByPlaceholderText('votre.email@exemple.com'), {
      target: { value: 'admin@sensolidaire.org' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'Admin1234!' },
    })
    fireEvent.click(screen.getByText('Je me connecte →'))

    // waitFor : attend que l'état asynchrone (await fetch) se termine
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  it("affiche un message d'erreur si les identifiants sont incorrects", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email ou mot de passe incorrect.' }),
    })

    render(<LoginAdmin />)
    fireEvent.click(screen.getByText('Je me connecte →'))

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect.')).toBeInTheDocument()
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})