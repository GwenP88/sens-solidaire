// tests/components/DashboardNavigation.test.jsx
// Navigation du dashboard : barre mobile (tâche 125), avertissement des pages prévues pour ordinateur, garde de route.

import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DashboardMobileNav from '../../src/components/admin/DashboardMobileNav'
import DashboardLayout from '../../src/components/admin/DashboardLayout'
import ProtectedRoute from '../../src/components/navigation/ProtectedRoute'
import { navItems, mobileNavItems } from '../../src/components/admin/dashboardNav'

const WARNING = /Cette page est prévue pour un ordinateur/

const renderLayoutAt = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/admin/login" element={<p>Page de connexion</p>} />
      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="*" element={<p>Contenu de la page</p>} />
      </Route>
    </Routes>
  </MemoryRouter>
)

beforeEach(() => {
  localStorage.clear()
})

describe('dashboardNav', () => {
  it('sur téléphone : uniquement Témoignages et Articles', () => {
    expect(mobileNavItems.map(i => i.path)).toEqual(['/admin/medias', '/admin/temoignages-rapports'])
  })

  it('chaque lien a un libellé, une adresse et une icône', () => {
    navItems.forEach(item => {
      expect(item.label).toBeTruthy()
      expect(item.path.startsWith('/admin')).toBe(true)
      expect(item.icon).toBeDefined()
    })
  })
})

describe('DashboardMobileNav', () => {
  it('affiche les 2 liens mobiles et le bouton Déconnexion', () => {
    const onLogout = vi.fn()
    render(<MemoryRouter><DashboardMobileNav onLogout={onLogout} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /Articles/ })).toHaveAttribute('href', '/admin/medias')
    expect(screen.getByRole('link', { name: /Témoignages/ })).toHaveAttribute('href', '/admin/temoignages-rapports')
    fireEvent.click(screen.getByRole('button', { name: 'Déconnexion' }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})

describe('DashboardLayout', () => {
  it.each(['/admin/medias', '/admin/medias/new', '/admin/temoignages-rapports'])(
    '%s : page prévue sur téléphone, pas d\'avertissement',
    (path) => {
      renderLayoutAt(path)
      expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
    }
  )

  it.each(['/admin/missions', '/admin/galerie'])('%s : avertissement affiché sur téléphone', (path) => {
    renderLayoutAt(path)
    expect(screen.getByText(WARNING).className).toContain('md:hidden') // masqué dès 768 px
  })

})

describe('DashboardLayout — déconnexion', () => {
  // 2 boutons Déconnexion (barre latérale + barre mobile) : le premier suffit
  const clickLogout = () => fireEvent.click(screen.getAllByRole('button', { name: /Déconnexion/ })[0])

  beforeEach(() => {
    localStorage.setItem('admin_token', 'jeton')
    vi.spyOn(console, 'error').mockImplementation(() => {}) // erreurs attendues dans les cas d'échec
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('appelle POST /api/auth/logout avec le jeton, puis supprime le jeton et renvoie vers la connexion', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    renderLayoutAt('/admin/medias')

    clickLogout()

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument()
    expect(localStorage.getItem('admin_token')).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/auth/logout')
    expect(options.method).toBe('POST')
    expect(options.credentials).toBe('include') // indispensable pour que le cookie soit supprimé
    expect(options.headers.Authorization).toBe('Bearer jeton')
  })

  it('serveur en erreur (500) : déconnexion locale quand même', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })))
    renderLayoutAt('/admin/medias')

    clickLogout()

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument()
    expect(localStorage.getItem('admin_token')).toBeNull()
  })

  it('serveur injoignable (erreur réseau) : déconnexion locale quand même', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    renderLayoutAt('/admin/medias')

    clickLogout()

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument()
    expect(localStorage.getItem('admin_token')).toBeNull()
  })

  it('serveur qui ne répond pas : déconnexion locale au bout de 5 secondes', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))) // réponse qui n'arrive jamais
    renderLayoutAt('/admin/medias')

    clickLogout()

    await act(async () => { await vi.advanceTimersByTimeAsync(4900) })
    expect(screen.queryByText('Page de connexion')).not.toBeInTheDocument()

    await act(async () => { await vi.advanceTimersByTimeAsync(100) })
    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
    expect(localStorage.getItem('admin_token')).toBeNull()
  })
})

describe('ProtectedRoute', () => {
  const renderProtected = () => render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<p>Page de connexion</p>} />
        <Route path="/admin" element={<ProtectedRoute><p>Dashboard</p></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>
  )

  it('sans jeton → redirection vers la connexion', () => {
    renderProtected()
    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('avec jeton → page affichée', () => {
    localStorage.setItem('admin_token', 'jeton')
    renderProtected()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
