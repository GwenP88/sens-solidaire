// tests/Public.integration.test.js
// Tests d'intégration des routes publiques du site (lecture seule) : formats de réponse, filtres, contenus en pause masqués.
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test
// Ces tests ne créent ni ne modifient AUCUNE donnée.

import { describe, it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

afterAll(async () => {
  await prisma.$disconnect()
})

describe("Infrastructure", () => {
  it("GET /api/health → 200", async () => {
    const res = await request(app).get("/api/health")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
  })

  it("route inexistante → 404 au format JSON commun", async () => {
    const res = await request(app).get("/api/route-qui-n-existe-pas")
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ error: true, status: 404 })
  })
})

describe("Missions", () => {
  it("GET /api/missions → 200, uniquement des missions actives", async () => {
    const res = await request(app).get("/api/missions")
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.missions)).toBe(true)
    res.body.missions.forEach(m => expect(m.is_active).not.toBe(false))
  })

  it("filtre type invalide → 400", async () => {
    const res = await request(app).get("/api/missions?type=type-invente")
    expect(res.status).toBe(400)
  })

  it("filtre pays avec caractères dangereux → 400", async () => {
    const res = await request(app).get(`/api/missions?country=${encodeURIComponent("<script>")}`)
    expect(res.status).toBe(400)
  })

  it("filtre pays trop long → 400", async () => {
    const res = await request(app).get(`/api/missions?country=${"a".repeat(101)}`)
    expect(res.status).toBe(400)
  })

  it("mission inexistante → 404", async () => {
    const res = await request(app).get("/api/missions/mission-inexistante-jest-test")
    expect(res.status).toBe(404)
  })
})

describe("Autres listes publiques", () => {
  it.each([
    ["/api/field-actions"],
    ["/api/media-posts"],
    ["/api/team-members"],
    ["/api/partners"],
    ["/api/activity-reports"],
    ["/api/mission-reports"],
  ])("GET %s → 200, tableau sans contenu en pause", async (path) => {
    const res = await request(app).get(path)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    res.body.forEach(item => expect(item.is_active).not.toBe(false))
  })

  it("GET /api/testimonials → seuls les témoignages approuvés sont publics", async () => {
    const res = await request(app).get("/api/testimonials")
    expect(res.status).toBe(200)
    res.body.forEach(t => expect(t.status).toBe("approved"))
  })

  it("GET /api/team-members?limit=2 → au plus 2 membres", async () => {
    const res = await request(app).get("/api/team-members?limit=2")
    expect(res.status).toBe(200)
    expect(res.body.length).toBeLessThanOrEqual(2)
  })

  it("GET /api/media-posts/themes → liste de thèmes (texte)", async () => {
    const res = await request(app).get("/api/media-posts/themes")
    expect(res.status).toBe(200)
    res.body.forEach(theme => expect(typeof theme).toBe("string"))
  })

  it("GET /api/media-posts → chaque article a un résumé calculé (non stocké en base)", async () => {
    const res = await request(app).get("/api/media-posts")
    res.body.forEach(post => expect(typeof post.short_description).toBe("string"))
  })

  it("GET /api/locations sans paramètre country → 400", async () => {
    const res = await request(app).get("/api/locations")
    expect(res.status).toBe(400)
  })

  it.each([
    ["/api/field-actions/action-inexistante-jest-test"],
    ["/api/media-posts/article-inexistant-jest-test"],
    ["/api/locations/lieu-inexistant-jest-test"],
  ])("page détail inexistante %s → 404", async (path) => {
    const res = await request(app).get(path)
    expect(res.status).toBe(404)
  })
})
