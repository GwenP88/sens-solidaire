// tests/unit/shortDescription.test.js
// Tests unitaires du résumé de carte calculé à partir du texte long (repère --- ou coupe automatique).

import { describe, it, expect } from "@jest/globals"
import { deriveShortDescription } from "../../src/utils/shortDescription.js"

describe("deriveShortDescription", () => {
  it("texte vide → résumé vide", () => {
    expect(deriveShortDescription("").shortDescription).toBe("")
    expect(deriveShortDescription(null).shortDescription).toBe("")
  })

  it("texte court → repris tel quel", () => {
    const { shortDescription, cleanedFullText } = deriveShortDescription("Une phrase courte.")
    expect(shortDescription).toBe("Une phrase courte.")
    expect(cleanedFullText).toBe("Une phrase courte.")
  })

  it("repère --- : le résumé s'arrête au repère, qui est retiré du texte complet", () => {
    const { shortDescription, cleanedFullText } = deriveShortDescription("Introduction.---Suite du texte.")
    expect(shortDescription).toBe("Introduction.")
    expect(cleanedFullText).toBe("Introduction.Suite du texte.")
    expect(cleanedFullText).not.toContain("---")
  })

  it("sans repère et trop long → coupe après la dernière phrase complète", () => {
    const text = "Première phrase. Deuxième phrase. " + "mot ".repeat(50)
    expect(deriveShortDescription(text, 40).shortDescription).toBe("Première phrase. Deuxième phrase.")
  })

  it("aucune phrase complète → coupe au dernier espace et ajoute « … »", () => {
    const { shortDescription } = deriveShortDescription("mot ".repeat(50), 22)
    expect(shortDescription.endsWith("…")).toBe(true)
    expect(shortDescription).not.toMatch(/mo…$/) // jamais en plein mot
  })

  it("respecte la limite demandée", () => {
    const { shortDescription } = deriveShortDescription("a ".repeat(300), 150)
    expect(shortDescription.length).toBeLessThanOrEqual(151) // 150 + « … »
  })
})
