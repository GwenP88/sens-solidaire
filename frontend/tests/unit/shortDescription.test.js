// tests/unit/shortDescription.test.js
// Tests unitaires de l'aperçu du résumé de carte affiché en direct dans les formulaires.

import { describe, it, expect } from 'vitest'
import { previewShortDescription, CUT_MARKER } from '../../src/utils/shortDescription'

describe('previewShortDescription', () => {
  it('texte vide → aperçu vide', () => {
    expect(previewShortDescription('')).toBe('')
  })

  it("s'arrête au repère ---", () => {
    expect(previewShortDescription(`Résumé.${CUT_MARKER}Suite`)).toBe('Résumé.')
  })

  it('coupe après la dernière phrase complète quand le texte est trop long', () => {
    expect(previewShortDescription('Phrase un. Phrase deux. ' + 'mot '.repeat(40), 30)).toBe('Phrase un. Phrase deux.')
  })

  it('sans phrase complète : coupe au dernier espace et ajoute « … »', () => {
    const preview = previewShortDescription('mot '.repeat(40), 21)
    expect(preview.endsWith('…')).toBe(true)
    expect(preview).not.toMatch(/mo…$/)
  })
})
