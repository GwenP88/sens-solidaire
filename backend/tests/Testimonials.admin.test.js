// tests/Testimonials.admin.test.js
// ============================================================
// Tests automatisés de la modération des témoignages
// Jest + Supertest
// ------------------------------------------------------------
// Vérifie :
//   - l'approbation d'un témoignage
//   - le refus sans authentification
//   - le rejet d'un JWT altéré
//   - la protection contre le mass assignment
//   - l'état réel des données en base
//
// Prérequis :
//   - PostgreSQL doit être démarré et seedé
//   - lancer les tests dans le conteneur backend :
//     docker exec sensolidaire_backend npm test
// ============================================================

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

// Compte administrateur créé par le seed
const ADMIN = { email: "admin@sensolidaire.org", password: "Admin1234!" }

// Préfixe utilisé pour identifier les témoignages de test
const NAME_PREFIX = "Jest Testimonial"

// Alphabet utilisé pour modifier la signature du JWT
const BASE64URL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

let token // Jeton administrateur récupéré à la connexion

// Crée un témoignage via la route publique et retourne son id
const submitTestimonial = async (label) => {
  const res = await request(app)
    .post("/api/testimonials")
    .send({
      author_name: `${NAME_PREFIX} ${label}`,
      content: "Temoignage cree par les tests automatises.",
      consent_given: true,
    })
  return res.body.id
}

// ── AVANT TOUS LES TESTS ──────────────────────────────────────────────────────
beforeAll(async () => {
  // Supprime les éventuelles données laissées par un test précédent
  await prisma.testimonial.deleteMany({ where: { author_name: { startsWith: NAME_PREFIX } } })

  const res = await request(app).post("/api/auth/login").send(ADMIN)
  token = res.body.accessToken || res.body.token
})

// ── APRÈS TOUS LES TESTS ──────────────────────────────────────────────────────
afterAll(async () => {
  await prisma.testimonial.deleteMany({ where: { author_name: { startsWith: NAME_PREFIX } } })
  await prisma.$disconnect()
})

// ============================================================
// APPROBATION — PATCH /api/admin/testimonials/:id/approve
// ============================================================
describe("PATCH /api/admin/testimonials/:id/approve", () => {

  it("A1 — jeton valide → 200 et statut réellement mis à jour en base", async () => {
    const id = await submitTestimonial("A1")

    const res = await request(app)
      .patch(`/api/admin/testimonials/${id}/approve`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)

    const row = await prisma.testimonial.findUnique({ where: { id } })
    expect(row.status).toBe("approved")
  })

  it("A2 — id inexistant (999999) → 404 + code TESTIMONIAL_NOT_FOUND", async () => {
    const res = await request(app)
      .patch("/api/admin/testimonials/999999/approve")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.code).toBe("TESTIMONIAL_NOT_FOUND")
  })
})

// ============================================================
// REFUS — PATCH /api/admin/testimonials/:id/reject
// ============================================================
describe("PATCH /api/admin/testimonials/:id/reject", () => {

  it("A3 — refuse la modification sans authentification et préserve les données", async () => {
    const id = await submitTestimonial("A3")

    const res = await request(app).patch(`/api/admin/testimonials/${id}/reject`)

    expect(res.status).toBe(401)

    const row = await prisma.testimonial.findUnique({ where: { id } })
    expect(row.status).toBe("pending")
  })
})

// ============================================================
// INTÉGRITÉ DU JETON
// ============================================================
describe("Signature JWT altérée", () => {

  it("B1 — seule la signature est modifiée (header/payload intacts) → 401 et statut inchangé", async () => {
    const id = await submitTestimonial("B1")

    // Modifie uniquement le dernier caractère de la signature
    const [header, payload, signature] = token.split(".")
    const lastChar = signature.at(-1)
    const replacement = BASE64URL_CHARS[(BASE64URL_CHARS.indexOf(lastChar) + 1) % BASE64URL_CHARS.length]
    const tamperedToken = `${header}.${payload}.${signature.slice(0, -1)}${replacement}`

    const res = await request(app)
      .patch(`/api/admin/testimonials/${id}/approve`)
      .set("Authorization", `Bearer ${tamperedToken}`)

    expect(res.status).toBe(401)

    const row = await prisma.testimonial.findUnique({ where: { id } })
    expect(row.status).toBe("pending")
  })
})

// ============================================================
// PROTECTION CONTRE LA MODIFICATION DE CHAMPS NON AUTORISÉS
// ============================================================
describe("Mass assignment via le corps de la requête", () => {

  it("B2 — { status: 'rejected' } envoyé dans le corps de /approve → statut forcé à 'approved'", async () => {
    const id = await submitTestimonial("B2")

    const res = await request(app)
      .patch(`/api/admin/testimonials/${id}/approve`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "rejected" })

    expect(res.status).toBe(200)

    // Le statut est imposé côté serveur et ignore celui envoyé par le client
    const row = await prisma.testimonial.findUnique({ where: { id } })
    expect(row.status).toBe("approved")
  })
})