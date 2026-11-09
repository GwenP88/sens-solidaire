// tests/unit/countries.test.js
// Tests unitaires de la liste des pays (datalist du dashboard) et du code drapeau déduit automatiquement.

import { describe, it, expect } from "@jest/globals"
import { getAllCountryNames, getCountryCode } from "../../src/utils/countries.js"

describe("getCountryCode", () => {
  it.each([["Kenya", "ke"], ["Sénégal", "sn"], ["Pérou", "pe"], ["France", "fr"], ["Suisse", "ch"]])(
    "%s → %s",
    (name, code) => {
      expect(getCountryCode(name)).toBe(code)
    }
  )

  it("Sumatra (île, pas un pays) est rattachée au drapeau de l'Indonésie", () => {
    expect(getCountryCode("Sumatra")).toBe("id")
  })

  it("nom inconnu → null (aucun drapeau inventé)", () => {
    expect(getCountryCode("Atlantide")).toBeNull()
    expect(getCountryCode("")).toBeNull()
  })
})

describe("getAllCountryNames", () => {
  const names = getAllCountryNames()

  it("contient les pays des missions et l'entrée personnalisée Sumatra", () => {
    expect(names).toEqual(expect.arrayContaining(["Kenya", "Sénégal", "Sri Lanka", "Pérou", "Sumatra"]))
  })

  it("est triée à la française (les pays accentués ne sont pas relégués en fin de liste)", () => {
    expect(names.indexOf("Égypte")).toBeLessThan(names.indexOf("Zimbabwe"))
    expect(names.indexOf("Égypte")).toBeGreaterThan(names.indexOf("Danemark"))
  })
})
