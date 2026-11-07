// tests/unit/odds.test.js
// Tests unitaires de la déduction des thèmes (tags) d'une action terrain à partir de ses ODD.

import { describe, it, expect } from "@jest/globals"
import { ODD_TO_CATEGORY, deriveTagsFromOdds } from "../../src/utils/odds.js"

describe("ODD_TO_CATEGORY", () => {
  it("couvre les 17 ODD", () => {
    for (let n = 1; n <= 17; n++) expect(ODD_TO_CATEGORY[n]).toBeDefined()
  })
})

describe("deriveTagsFromOdds", () => {
  it("transforme les ODD en thèmes", () => {
    expect(deriveTagsFromOdds([14, 4])).toEqual(["Biodiversité", "Éducation"])
  })

  it("dédoublonne les thèmes (ODD 8, 9, 11 → un seul « Développement »)", () => {
    expect(deriveTagsFromOdds([8, 9, 11])).toEqual(["Développement"])
  })

  it("ignore les numéros inconnus et accepte une liste absente", () => {
    expect(deriveTagsFromOdds([0, 18, 99])).toEqual([])
    expect(deriveTagsFromOdds()).toEqual([])
  })
})
