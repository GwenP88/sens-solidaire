// tests/unit/duplicatedRules.test.js
// Les règles DUPLIQUÉES volontairement entre front et back (ils ne partagent pas de code) doivent rester identiques.
//
// Ce test a besoin des deux dossiers : il s'exécute sur le poste de développement
// et se met automatiquement de côté dans le conteneur frontend (qui ne voit que ./frontend).

import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import * as frontValidation from '../../src/utils/validation'
import * as frontYouTube from '../../src/utils/youtube'
import { ODD_TO_CATEGORY as FRONT_ODD } from '../../src/utils/odds'
import { previewShortDescription } from '../../src/utils/shortDescription'

// Vitest est lancé depuis frontend/ : le backend est le dossier voisin
const backendUtils = resolve(process.cwd(), '../backend/src/utils') + '/'
const hasBackend = existsSync(backendUtils)
// Chemins relatifs écrits en entier : Vite sait les résoudre (un chemin calculé, non)
const BACKEND = {
  'validation.js': () => import('../../../backend/src/utils/validation.js'),
  'odds.js': () => import('../../../backend/src/utils/odds.js'),
  'youtube.js': () => import('../../../backend/src/utils/youtube.js'),
  'shortDescription.js': () => import('../../../backend/src/utils/shortDescription.js'),
}
const load = (file) => BACKEND[file]()

const SAMPLES = {
  slugs: ['kenya', 'Kenya', 'a--b', 'mission-2025', '', 'é'],
  years: [1999, 2000, '2025', 'abcd', new Date().getFullYear() + 2],
  urls: ['https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://vimeo.com/1', 'javascript:alert(1)'],
  texts: ['', 'Court.', 'Intro.---Suite', 'Phrase un. Phrase deux. ' + 'mot '.repeat(60), 'mot '.repeat(80)],
}

describe.skipIf(!hasBackend)('Règles identiques front / back', () => {
  it('isValidSlug et isValidYear', async () => {
    const back = await load('validation.js')
    SAMPLES.slugs.forEach(s => expect(frontValidation.isValidSlug(s)).toBe(back.isValidSlug(s)))
    SAMPLES.years.forEach(y => expect(frontValidation.isValidYear(y)).toBe(back.isValidYear(y)))
  })

  it('correspondance ODD → catégorie', async () => {
    const back = await load('odds.js')
    expect(FRONT_ODD).toEqual(back.ODD_TO_CATEGORY)
  })

  it('reconnaissance des liens YouTube', async () => {
    const back = await load('youtube.js')
    SAMPLES.urls.forEach(u => {
      expect(frontYouTube.getYouTubeId(u)).toBe(back.getYouTubeId(u))
      expect(frontYouTube.isYouTubeShort(u)).toBe(back.isYouTubeShort(u))
    })
  })

  it("l'aperçu du résumé (front) annonce exactement le résumé enregistré (back)", async () => {
    const back = await load('shortDescription.js')
    SAMPLES.texts.forEach(t => {
      expect(previewShortDescription(t, 150)).toBe(back.deriveShortDescription(t, 150).shortDescription)
    })
  })
})
