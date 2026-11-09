// tests/pages/MediaPostFormPage.test.jsx
// Formulaire admin Médias : règles de validation et envoi des vidéos YouTube (tâche 123).

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MediaPostFormPage from '../../src/pages/admin/MediaPostFormPage'
import { createMediaPost, updateMediaPostMedia } from '../../src/services/api'

vi.mock('../../src/services/api', () => ({
  fetchAdminMediaPostById: vi.fn(),
  createMediaPost: vi.fn(),
  updateMediaPost: vi.fn(),
  fetchMediaPostThemes: vi.fn(() => Promise.resolve(['Événement'])),
  updateMediaPostMedia: vi.fn(),
  uploadAdminFile: vi.fn(),
}))

const renderForm = () => render(
  <MemoryRouter initialEntries={['/admin/medias/new']}>
    <Routes>
      <Route path="/admin/medias/new" element={<MediaPostFormPage />} />
      <Route path="/admin/medias" element={<p>Liste des publications</p>} />
    </Routes>
  </MemoryRouter>
)

const type = (name, value) => fireEvent.change(document.querySelector(`[name="${name}"]`), { target: { name, value } })

const fillRequired = () => {
  type('title', 'Atelier à Nice')
  type('theme', 'Événement')
  type('content', "Compte rendu de l'atelier.")
}

const addVideo = (url) => {
  fireEvent.click(screen.getByRole('button', { name: '+ Ajouter une vidéo' }))
  const inputs = screen.getAllByLabelText('Lien de la vidéo YouTube')
  fireEvent.change(inputs.at(-1), { target: { value: url } })
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Créer la publication' }))

beforeEach(() => {
  vi.clearAllMocks()
  createMediaPost.mockResolvedValue({ id: 12 })
  updateMediaPostMedia.mockResolvedValue({ success: true })
})

describe('MediaPostFormPage', () => {
  it('champs obligatoires vides → messages par champ, rien n\'est envoyé', async () => {
    renderForm()
    submit()
    expect(await screen.findByText('Le titre est obligatoire.')).toBeInTheDocument()
    expect(screen.getByText('Choisissez ou saisissez un thème.')).toBeInTheDocument()
    expect(createMediaPost).not.toHaveBeenCalled()
  })

  it('lien vidéo qui n\'est pas YouTube → enregistrement bloqué', async () => {
    renderForm()
    fillRequired()
    addVideo('https://vimeo.com/123')
    submit()
    expect(await screen.findByText(/n'est pas une vidéo YouTube/)).toBeInTheDocument()
    expect(createMediaPost).not.toHaveBeenCalled()
  })

  it('vidéo YouTube valide → publication créée puis vidéo rattachée, retour à la liste', async () => {
    renderForm()
    fillRequired()
    addVideo('  https://youtu.be/dQw4w9WgXcQ  ')
    submit()

    expect(await screen.findByText('Liste des publications')).toBeInTheDocument()
    expect(createMediaPost).toHaveBeenCalledWith(expect.objectContaining({ title: 'Atelier à Nice', theme: 'Événement' }))
    expect(updateMediaPostMedia).toHaveBeenCalledWith(12, [], [{ file_url: 'https://youtu.be/dQw4w9WgXcQ', label: '' }])
  })

  it('ligne vidéo laissée vide → ignorée (pas une erreur)', async () => {
    renderForm()
    fillRequired()
    fireEvent.click(screen.getByRole('button', { name: '+ Ajouter une vidéo' }))
    submit()
    await waitFor(() => expect(updateMediaPostMedia).toHaveBeenCalledWith(12, [], []))
  })

  it('avec un lien vers un autre site : les vidéos ne seraient pas visibles → refus', async () => {
    renderForm()
    fillRequired()
    addVideo('https://youtu.be/dQw4w9WgXcQ')
    type('url', 'https://www.francebleu.fr/article')
    submit()
    expect(await screen.findByText(/les vidéos ne seraient pas visibles/)).toBeInTheDocument()
    expect(createMediaPost).not.toHaveBeenCalled()
  })

  it('lien externe sans http(s):// → refus', async () => {
    renderForm()
    fillRequired()
    type('url', 'www.francebleu.fr')
    submit()
    expect(await screen.findByText(/doit commencer par http/)).toBeInTheDocument()
  })
})
