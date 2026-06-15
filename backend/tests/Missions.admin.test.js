// tests/missions.admin.test.js
// ============================================================
// Tests automatisés du CRUD admin missions (Jest + Supertest)
// ------------------------------------------------------------
// Ce que ça vérifie, sans Postman, en une commande :
//   - santé de l'API
//   - login admin (récupération du token)
//   - POST   /api/admin/missions        (create)
//   - PATCH  /api/admin/missions/:id     (update partiel)
//   - DELETE /api/admin/missions/:id     (soft delete)
//   - les cas d'erreur attendus (401 / 400 / 404 / 409)
//
// Supertest envoie de vraies requêtes HTTP sur l'app Express
// SANS démarrer un serveur réel (il utilise `export default app`).
//
// ⚠️ PRÉREQUIS pour lancer :
//   - la base Postgres doit tourner (conteneur Docker up + seedée)
//   - lancer DANS le conteneur backend (sinon "postgres" n'est pas résolu) :
//       docker exec sensolidaire_backend npm test
// ============================================================

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

// Identifiants de l'admin du seed
const ADMIN = { email: "admin@sensolidaire.org", password: "Admin1234!" }

// Slug dédié aux tests — on le nettoie avant ET après pour repartir propre
const TEST_SLUG = "mission-test-jest"

let token       // token admin récupéré au login
let createdId   // id de la mission créée pendant les tests

// ── AVANT TOUS LES TESTS ──────────────────────────────────────────────────────
beforeAll(async () => {
  // Nettoyage défensif : si un run précédent a laissé la mission de test
  // (même soft-deleted), on la supprime VRAIMENT pour éviter un faux 409.
  await prisma.mission.deleteMany({ where: { slug: TEST_SLUG } })

  // Login pour obtenir un token admin valide
  const res = await request(app).post("/api/auth/login").send(ADMIN)
  // Le nom du champ peut être accessToken ou token selon ton login
  token = res.body.accessToken || res.body.token
})

// ── APRÈS TOUS LES TESTS ──────────────────────────────────────────────────────
afterAll(async () => {
  // On efface pour de bon la mission de test (hard delete) → base propre
  await prisma.mission.deleteMany({ where: { slug: TEST_SLUG } })
  // On ferme la connexion Prisma, sinon Jest "pend" à la fin
  await prisma.$disconnect()
})

// ============================================================
// SANTÉ + AUTH
// ============================================================
describe("Santé & authentification", () => {
  it("GET /api/health → 200", async () => {
    const res = await request(app).get("/api/health")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
  })

  it("login admin → renvoie un token", () => {
    // token a été récupéré dans beforeAll
    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
  })
})

// ============================================================
// CREATE — POST /api/admin/missions
// ============================================================
describe("POST /api/admin/missions (create)", () => {

  it("sans token → 401", async () => {
    const res = await request(app)
      .post("/api/admin/missions")
      .send({ title: "X", country: "Kenya", slug: TEST_SLUG, short_description: "x" })
    expect(res.status).toBe(401)
  })

  it("champ obligatoire manquant → 400", async () => {
    const res = await request(app)
      .post("/api/admin/missions")
      .set("Authorization", `Bearer ${token}`)
      .send({ country: "Kenya", slug: TEST_SLUG, short_description: "x" }) // pas de title
    expect(res.status).toBe(400)
  })

  it("type invalide → 400", async () => {
    const res = await request(app)
      .post("/api/admin/missions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "X", country: "Kenya", slug: TEST_SLUG,
        short_description: "x", type: "licorne",
      })
    expect(res.status).toBe(400)
  })

  it("données valides → 201 + mission créée", async () => {
    const res = await request(app)
      .post("/api/admin/missions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mission test Jest",
        country: "Kenya",
        slug: TEST_SLUG,
        short_description: "Mission creee par les tests automatises",
        type: "volontariat_individuel",
      })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.mission.slug).toBe(TEST_SLUG)
    // On mémorise l'id pour les tests PATCH et DELETE
    createdId = res.body.mission.id
  })

  it("slug déjà pris → 409 + code SLUG_TAKEN", async () => {
    const res = await request(app)
      .post("/api/admin/missions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Doublon",
        country: "Kenya",
        slug: TEST_SLUG, // déjà créé juste avant
        short_description: "doublon",
        type: "volontariat_individuel",
      })
    expect(res.status).toBe(409)
    expect(res.body.code).toBe("SLUG_TAKEN")
  })
})

// ============================================================
// UPDATE — PATCH /api/admin/missions/:id
// ============================================================
describe("PATCH /api/admin/missions/:id (update partiel)", () => {

  it("modification valide → 200 + champ mis à jour", async () => {
    const res = await request(app)
      .patch(`/api/admin/missions/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Titre modifie par Jest" })
    expect(res.status).toBe(200)
    expect(res.body.mission.title).toBe("Titre modifie par Jest")
  })

  it("id inexistant → 404 + code MISSION_NOT_FOUND", async () => {
    const res = await request(app)
      .patch("/api/admin/missions/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "peu importe" })
    expect(res.status).toBe(404)
    expect(res.body.code).toBe("MISSION_NOT_FOUND")
  })
})

// ============================================================
// DELETE (soft) — DELETE /api/admin/missions/:id
// ============================================================
describe("DELETE /api/admin/missions/:id (soft delete)", () => {

  it("suppression → 200 + is_active = false", async () => {
    const res = await request(app)
      .delete(`/api/admin/missions/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.mission.is_active).toBe(false)
  })

  it("la mission soft-deletée disparaît du public → 404", async () => {
    // Route publique par slug : ne doit plus la trouver (filtre is_active)
    const res = await request(app).get(`/api/missions/${TEST_SLUG}`)
    expect(res.status).toBe(404)
  })

  it("id inexistant → 404", async () => {
    const res = await request(app)
      .delete("/api/admin/missions/99999")
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
