// tests/unit/texteMisEnForme.test.js
// Mise en forme du texte des sections Éducation (tâche 172A) : ligne vide = paragraphe, « - » = puce, retour à la ligne conservé.

import { describe, it, expect } from 'vitest'
import { parseTexteMisEnForme } from '../../src/utils/texteMisEnForme'

describe('parseTexteMisEnForme', () => {
  it('texte vide → aucun bloc', () => {
    expect(parseTexteMisEnForme('')).toEqual([])
    expect(parseTexteMisEnForme(null)).toEqual([])
  })

  it('ligne vide → deux paragraphes', () => {
    expect(parseTexteMisEnForme('Premier.\n\nSecond.')).toEqual([
      { type: 'paragraph', lines: ['Premier.'] },
      { type: 'paragraph', lines: ['Second.'] },
    ])
  })

  it('simple retour à la ligne → même paragraphe, deux lignes', () => {
    expect(parseTexteMisEnForme('Ligne 1\nLigne 2')).toEqual([
      { type: 'paragraph', lines: ['Ligne 1', 'Ligne 2'] },
    ])
  })

  it('lignes commençant par « - » → liste à puces, même collée au texte', () => {
    expect(parseTexteMisEnForme('Apports éducatifs :\n- Expression écrite\n- Anglais\n\nSuite.')).toEqual([
      { type: 'paragraph', lines: ['Apports éducatifs :'] },
      { type: 'list', items: ['Expression écrite', 'Anglais'] },
      { type: 'paragraph', lines: ['Suite.'] },
    ])
  })

  it('puce « • » collée depuis Word acceptée ; un tiret dans une phrase reste du texte', () => {
    expect(parseTexteMisEnForme('• Biodiversité\nUn texte - avec tiret')).toEqual([
      { type: 'list', items: ['Biodiversité'] },
      { type: 'paragraph', lines: ['Un texte - avec tiret'] },
    ])
  })

  it('plusieurs lignes vides et retours Windows (\\r\\n) → pas de bloc vide', () => {
    expect(parseTexteMisEnForme('A\r\n\r\n\r\n\r\nB')).toEqual([
      { type: 'paragraph', lines: ['A'] },
      { type: 'paragraph', lines: ['B'] },
    ])
  })
})
