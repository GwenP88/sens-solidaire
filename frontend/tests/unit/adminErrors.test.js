// tests/unit/adminErrors.test.js
// Vérifie la charte des messages du dashboard : vouvoiement, phrase complète, consigne claire pour la cliente.

import { describe, it, expect } from 'vitest'
import { ADMIN_ERRORS } from '../../src/utils/adminErrors'

describe('ADMIN_ERRORS', () => {
  it.each(Object.entries(ADMIN_ERRORS))('« %s » est vouvoyé et dit quoi faire', (_, message) => {
    expect(message).toMatch(/Vérifiez|réessayez/)
    expect(message).not.toMatch(/Réessaie\b|\btu\b|\bton\b|\bta\b/i) // pas de tutoiement
    expect(message.endsWith('.')).toBe(true)
  })

  it('ne contient aucun vocabulaire technique', () => {
    Object.values(ADMIN_ERRORS).forEach(message => {
      expect(message).not.toMatch(/\b(API|HTTP|500|404|serveur Express|payload|slug|token)\b/i)
    })
  })
})
