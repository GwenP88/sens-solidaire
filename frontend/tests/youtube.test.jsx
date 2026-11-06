// youtube.test.jsx
// Vidéos YouTube (tâche 123) : lecture des liens collés dans le dashboard + lecteur chargé seulement au clic.

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { getYouTubeId, isYouTubeShort } from '../src/utils/youtube'
import YouTubeSlide from '../src/components/media/YouTubeSlide'
import YouTubeModal from '../src/components/media/YouTubeModal'

const ID = 'dQw4w9WgXcQ'

describe('getYouTubeId', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://m.youtube.com/watch?feature=share&v=${ID}`,
  ])("reconnaît %s", (url) => {
    expect(getYouTubeId(url)).toBe(ID)
  })

  it.each([
    'https://vimeo.com/123456',
    `https://autre-site.com/youtube.com/watch?v=${ID}`,
    'javascript:alert(1)',
    '',
  ])("refuse %s", (url) => {
    expect(getYouTubeId(url)).toBeNull()
  })

  it("repère le format portrait des Shorts", () => {
    expect(isYouTubeShort(`https://www.youtube.com/shorts/${ID}`)).toBe(true)
    expect(isYouTubeShort(`https://youtu.be/${ID}`)).toBe(false)
  })
})

describe('YouTubeSlide / YouTubeModal', () => {
  it("affiche la miniature sans charger le lecteur YouTube avant le clic", () => {
    const onPlay = vi.fn()
    const { container } = render(<YouTubeSlide url={`https://youtu.be/${ID}`} label="Reportage" onPlay={onPlay} />)

    expect(container.querySelector('iframe')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Lire la vidéo : Reportage' }))
    expect(onPlay).toHaveBeenCalledTimes(1)
  })

  it("ouvre le lecteur youtube-nocookie dans la modale", () => {
    render(<YouTubeModal video={{ file_url: `https://youtu.be/${ID}`, label: 'Reportage' }} onClose={vi.fn()} />)
    expect(screen.getByTitle('Reportage').getAttribute('src')).toContain(`youtube-nocookie.com/embed/${ID}`)
  })

  it("ne rend rien quand aucune vidéo n'est sélectionnée", () => {
    const { container } = render(<YouTubeModal video={null} onClose={vi.fn()} />)
    expect(container.querySelector('iframe')).toBeNull()
  })
})
