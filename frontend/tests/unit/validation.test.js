// tests/unit/validation.test.js
// Tests unitaires des règles de validation des formulaires du dashboard.

import { describe, it, expect } from 'vitest'
import { isValidYear, isValidSlug } from '../../src/utils/validation'

describe('isValidYear', () => {
  const nextYear = new Date().getFullYear() + 1

  it.each([2000, 2026, '2025', nextYear])('accepte %p', (value) => {
    expect(isValidYear(value)).toBe(true)
  })

  it.each([1999, nextYear + 1, '26', 'abcd', ''])('refuse %p', (value) => {
    expect(isValidYear(value)).toBe(false)
  })
})

describe('isValidSlug', () => {
  it.each(['kenya', 'mission-kenya-2025'])('accepte %p', (value) => {
    expect(isValidSlug(value)).toBe(true)
  })

  it.each(['Kenya', 'pérou', 'a--b', '-a', 'a-', 'a b', ''])('refuse %p', (value) => {
    expect(isValidSlug(value)).toBe(false)
  })
})
