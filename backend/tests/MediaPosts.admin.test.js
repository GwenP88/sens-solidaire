// tests/MediaPosts.admin.test.js
// Tests d'intégration du CRUD admin Médias & actualités (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test

import { it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"
import { describeAdminCrud, TEST_MARKER } from "./helpers/adminCrud.js"

const TITLE = `Article ${TEST_MARKER}`
const THEME = `Thème ${TEST_MARKER}` // thème dédié : n'apparaît dans les suggestions que le temps du test

// Supprime uniquement les publications de test (et leurs médias liés, table polymorphe sans FK)
const cleanup = async () => {
  const posts = await prisma.mediaPost.findMany({ where: { title: { contains: TEST_MARKER } }, select: { id: true } })
  const ids = posts.map(p => p.id)
  if (ids.length === 0) return
  await prisma.media.deleteMany({ where: { entity_type: "media_post", entity_id: { in: ids } } })
  await prisma.mediaPost.deleteMany({ where: { id: { in: ids } } })
}

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Médias & actualités",
  adminPath: "/api/admin/media-posts",
  key: "post",
  validBody: () => ({ title: TITLE, theme: THEME, date: "2026-01-15", content: "Texte de l'article de test." }),
  // Ni texte ni lien : la carte ne mènerait nulle part → refus
  invalidBody: () => ({ title: TITLE, theme: THEME, date: "2026-01-15" }),
  updateBody: () => ({ title: `${TITLE} modifié`, author: "Équipe test" }),
  checkUpdated: (post) => {
    expect(post.title).toBe(`${TITLE} modifié`)
    expect(post.author).toBe("Équipe test")
  },
  publicList: { path: "/api/media-posts", extract: (body) => body },
  cleanup,
  extraTests: ({ token, created }) => {
    it("article en pause → sa page publique répond 404", async () => {
      const res = await request(app).get(`/api/media-posts/${created().slug}`)
      expect(res.status).toBe(404)
    })

    // ── Vidéos YouTube du carrousel (tâche 123) ──
    it("vidéo qui n'est pas un lien YouTube → 400", async () => {
      const res = await request(app)
        .put(`/api/admin/media-posts/${created().id}/media`)
        .set("Authorization", `Bearer ${token()}`)
        .send({ images: [], videos: [{ file_url: "https://vimeo.com/123456" }] })
      expect(res.status).toBe(400)
    })

    it("vidéo YouTube valide → enregistrée et renvoyée au formulaire", async () => {
      const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      const res = await request(app)
        .put(`/api/admin/media-posts/${created().id}/media`)
        .set("Authorization", `Bearer ${token()}`)
        .send({ images: [], videos: [{ file_url: url, label: "Vidéo de test" }] })
      expect(res.status).toBe(200)

      const check = await request(app).get(`/api/admin/media-posts/${created().id}`).set("Authorization", `Bearer ${token()}`)
      expect(check.body.post.videos.map(v => v.file_url)).toEqual([url])
    })
  },
})
