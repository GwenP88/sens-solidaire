// tests/unit/validation.test.js
// Tests unitaires des règles de validation partagées par les controllers (sans base de données).

import { describe, it, expect } from "@jest/globals"
import { isFilled, isValidYear, isValidSlug } from "../../src/utils/validation.js"

describe("isFilled", () => {
  it.each(["texte", "  a  ", 0, 2025])("accepte %p", (value) => {
    expect(isFilled(value)).toBe(true)
  })

  it.each(["", "   ", null, undefined])("refuse %p", (value) => {
    expect(isFilled(value)).toBe(false)
  })
})

describe("isValidYear", () => {
  const nextYear = new Date().getFullYear() + 1

  it.each([2000, 2025, "2024", nextYear])("accepte %p", (value) => {
    expect(isValidYear(value)).toBe(true)
  })

  it.each([1999, nextYear + 1, "25", "20255", "deux mille", "", null])("refuse %p", (value) => {
    expect(isValidYear(value)).toBe(false)
  })
})

describe("isValidSlug", () => {
  it.each(["kenya", "volontariat-kenya-2025", "a1-b2"])("accepte %p", (value) => {
    expect(isValidSlug(value)).toBe(true)
  })

  it.each(["Kenya", "sénégal", "double--tiret", "-debut", "fin-", "avec espace", "a_b", "", null])("refuse %p", (value) => {
    expect(isValidSlug(value)).toBe(false)
  })
})
