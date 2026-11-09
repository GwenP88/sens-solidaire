// tests/unit/useSEO.test.jsx
// Référencement (tâche 174) : titre d'onglet, description Google, robots et aperçu réseaux sociaux.

import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useSEO from '../../src/hooks/useSEO'

const meta = (selector) => document.head.querySelector(selector)?.getAttribute('content')

describe('useSEO', () => {
  it('titre de page suivi du nom du site', () => {
    renderHook(() => useSEO({ title: 'Nos missions', description: 'Les missions.' }))
    expect(document.title).toBe('Nos missions | Sens Solidaires')
    expect(meta('meta[name="description"]')).toBe('Les missions.')
    expect(meta('meta[property="og:title"]')).toBe('Nos missions | Sens Solidaires')
  })

  it('sans titre (accueil) : nom du site et description par défaut', () => {
    renderHook(() => useSEO({}))
    expect(document.title).toMatch(/^Sens Solidaires/)
    expect(meta('meta[name="description"]')).toMatch(/volontariat international/)
  })

  it('description nettoyée : coupée au repère « --- », sans retours à la ligne', () => {
    renderHook(() => useSEO({ title: 'Kenya', description: 'Premier paragraphe.\n\nSuite du résumé.\n---\nTexte long.' }))
    expect(meta('meta[name="description"]')).toBe('Premier paragraphe. Suite du résumé.')
  })

  it('description trop longue : environ 160 caractères maximum', () => {
    renderHook(() => useSEO({ title: 'Long', description: 'mot '.repeat(100) }))
    expect(meta('meta[name="description"]').length).toBeLessThanOrEqual(161)
  })

  it('image de partage convertie en adresse complète', () => {
    renderHook(() => useSEO({ title: 'Photo', image: '/uploads/images/photo.webp' }))
    expect(meta('meta[property="og:image"]')).toBe(`${window.location.origin}/uploads/images/photo.webp`)
  })

  it('page du dashboard : exclue des moteurs de recherche', () => {
    renderHook(() => useSEO({ title: 'Tableau de bord', noindex: true }))
    expect(meta('meta[name="robots"]')).toBe('noindex, nofollow')
  })

  it("titre mis à jour quand les données d'une page détail arrivent", () => {
    const { rerender } = renderHook(({ title }) => useSEO({ title }), { initialProps: { title: undefined } })
    rerender({ title: 'Volontariat au Pérou' })
    expect(document.title).toBe('Volontariat au Pérou | Sens Solidaires')
  })

  it("une seule balise par information, même après plusieurs pages (pas de doublon)", () => {
    renderHook(() => useSEO({ title: 'A' }))
    renderHook(() => useSEO({ title: 'B' }))
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
  })
})
