// tests/unit/youtube.test.js
// Tests unitaires de la reconnaissance des liens YouTube acceptés pour les vidéos d'articles (tâche 123).

import { describe, it, expect } from "@jest/globals"
import { getYouTubeId, isYouTubeUrl, isYouTubeShort } from "../../src/utils/youtube.js"

const ID = "dQw4w9WgXcQ"

describe("getYouTubeId / isYouTubeUrl", () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s`,
    `https://m.youtube.com/watch?feature=share&v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=partage`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `  https://youtu.be/${ID}  `,
  ])("reconnaît %s", (url) => {
    expect(getYouTubeId(url)).toBe(ID)
    expect(isYouTubeUrl(url)).toBe(true)
  })

  it.each([
    "https://vimeo.com/123456",
    "https://www.youtube.com/watch?v=trop-court",
    `https://faux-youtube.com/watch?v=${ID}`,
    `https://site.com/youtube.com/watch?v=${ID}`,
    "javascript:alert(1)",
    "",
    null,
  ])("refuse %p", (url) => {
    expect(isYouTubeUrl(url)).toBe(false)
  })
})

describe("isYouTubeShort", () => {
  it("Shorts → portrait ; autres liens → paysage", () => {
    expect(isYouTubeShort(`https://www.youtube.com/shorts/${ID}`)).toBe(true)
    expect(isYouTubeShort(`https://www.youtube.com/watch?v=${ID}`)).toBe(false)
  })
})
