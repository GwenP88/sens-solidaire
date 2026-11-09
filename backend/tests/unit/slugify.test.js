// tests/unit/slugify.test.js
// Tests unitaires de la génération d'adresse de page (slug) à partir d'un titre.

import { describe, it, expect } from "@jest/globals"
import { slugify } from "../../src/utils/slugify.js"
import { isValidSlug } from "../../src/utils/validation.js"

describe("slugify", () => {
  it("retire accents, apostrophes et ponctuation", () => {
    expect(slugify("Forum partir à l'étranger — Thonon")).toBe("forum-partir-a-l-etranger-thonon")
  })

  it("gère les majuscules et caractères spéciaux français", () => {
    expect(slugify("ÉCOLE Côte d'Ivoire : 2025 !")).toBe("ecole-cote-d-ivoire-2025")
  })

  it("ne laisse jamais de tiret au début ou à la fin", () => {
    expect(slugify("  --- Titre ---  ")).toBe("titre")
  })

  it("limite la longueur à 80 caractères sans tiret final", () => {
    const slug = slugify("mot ".repeat(40))
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith("-")).toBe(false)
  })

  it("renvoie une valeur de secours pour un titre sans lettre ni chiffre", () => {
    expect(slugify("!!! ???")).toBe("article")
    expect(slugify(null)).toBe("article")
  })

  it.each(["Mission au Kenya", "Été 2025 : éco-école", "Ça marche ? Oui !", "x".repeat(200)])(
    "produit toujours une adresse acceptée par isValidSlug (%p)",
    (title) => {
      expect(isValidSlug(slugify(title))).toBe(true)
    }
  )
})
