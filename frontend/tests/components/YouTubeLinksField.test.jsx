// tests/components/YouTubeLinksField.test.jsx
// Saisie des vidéos YouTube dans le formulaire Médias (tâche 123) : ajout, aperçu, lien refusé, retrait, limite.

import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import YouTubeLinksField from '../../src/components/admin/YouTubeLinksField'

// Composant de test qui garde l'état, comme le fait le formulaire réel
function Harness({ initial = [], max = 5, disabled = false }) {
  const [value, setValue] = useState(initial)
  return <YouTubeLinksField value={value} onChange={setValue} max={max} disabled={disabled} />
}

const URL_OK = 'https://youtu.be/dQw4w9WgXcQ'

describe('YouTubeLinksField', () => {
  it('« + Ajouter une vidéo » crée une ligne de saisie', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '+ Ajouter une vidéo' }))
    expect(screen.getByLabelText('Lien de la vidéo YouTube')).toBeInTheDocument()
  })

  it('lien reconnu → miniature affichée, aucun message d\'erreur', () => {
    const { container } = render(<Harness initial={[{ file_url: URL_OK, label: '' }]} />)
    expect(container.querySelector('img').getAttribute('src')).toContain('dQw4w9WgXcQ')
    expect(screen.queryByText(/n'est pas reconnu/)).not.toBeInTheDocument()
  })

  it('lien non YouTube → message qui explique quoi faire', () => {
    render(<Harness initial={[{ file_url: '', label: '' }]} />)
    fireEvent.change(screen.getByLabelText('Lien de la vidéo YouTube'), { target: { value: 'https://vimeo.com/1' } })
    expect(screen.getByText(/cliquez sur « Partager »/)).toBeInTheDocument()
  })

  it('le bouton corbeille retire la vidéo', () => {
    render(<Harness initial={[{ file_url: URL_OK, label: 'Reportage' }]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Retirer cette vidéo' }))
    expect(screen.queryByLabelText('Lien de la vidéo YouTube')).not.toBeInTheDocument()
  })

  it('limite atteinte → plus de bouton d\'ajout', () => {
    render(<Harness initial={[{ file_url: URL_OK, label: '' }, { file_url: URL_OK, label: '' }]} max={2} />)
    expect(screen.queryByRole('button', { name: '+ Ajouter une vidéo' })).not.toBeInTheDocument()
  })

  it('désactivé (la carte ouvre un lien) → ajout impossible', () => {
    render(<Harness disabled />)
    expect(screen.queryByRole('button', { name: '+ Ajouter une vidéo' })).not.toBeInTheDocument()
  })
})
