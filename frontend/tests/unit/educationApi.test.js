// tests/unit/educationApi.test.js
// Appels API de la page Éducation (tâche 172A) : envoi JSON, extraction de la réponse, message d'erreur du serveur transmis à la cliente.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createEducationSection, fetchAdminEducationSections, reorderEducationSections, hardDeleteEducationItem,
} from '../../src/services/api'

// Réponse simulée du serveur
const reply = (status, body) => Promise.resolve({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
})

describe('API Éducation (dashboard)', () => {
  beforeEach(() => {
    localStorage.setItem('admin_token', 'jeton-de-test')
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('création : envoie le JSON avec le jeton et renvoie la section créée', async () => {
    fetch.mockReturnValue(reply(201, { section: { id: 7, title: 'Label Éco-École' } }))

    const section = await createEducationSection({ title: 'Label Éco-École', content: 'Texte' })

    expect(section).toEqual({ id: 7, title: 'Label Éco-École' })
    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('/api/admin/education-sections')
    expect(options.method).toBe('POST')
    expect(options.headers.Authorization).toBe('Bearer jeton-de-test')
    expect(JSON.parse(options.body)).toEqual({ title: 'Label Éco-École', content: 'Texte' })
  })

  it('liste : renvoie directement le tableau des sections', async () => {
    fetch.mockReturnValue(reply(200, { sections: [{ id: 1 }, { id: 2 }] }))
    expect(await fetchAdminEducationSections()).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('refus du serveur : son message (écrit pour la cliente) est transmis tel quel', async () => {
    fetch.mockReturnValue(reply(400, { message: 'Ajoutez au maximum 3 boutons.' }))
    await expect(reorderEducationSections([1])).rejects.toThrow('Ajoutez au maximum 3 boutons.')
  })

  it("refus sans message lisible : message de secours", async () => {
    fetch.mockReturnValue(Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error('pas du JSON')) }))
    await expect(hardDeleteEducationItem(3)).rejects.toThrow('Échec de la suppression.')
  })
})
