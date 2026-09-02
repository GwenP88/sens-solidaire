// tests/Testimonials.admin.test.js
// ============================================================
// Automated tests for testimonial moderation (Jest + Supertest)
// ------------------------------------------------------------
// Covers:
//   - PATCH /api/admin/testimonials/:id/approve (valid token, unknown id)
//   - PATCH /api/admin/testimonials/:id/reject  (no token)
//   - a token whose signature alone is tampered with (header/payload intact)
//   - a mass-assignment attempt via the request body
//
// Test testimonials are created through the PUBLIC submission route
// (POST /api/testimonials), not via prisma.create — this exercises the
// public submission path as a side effect of setting up each moderation
// test. Every test also checks the database state, not just the response
// body: a 200 doesn't prove a row actually changed.
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

// Every test testimonial's author_name starts with this — used both to
// scope defensive cleanup and to identify what afterAll must remove.
const NAME_PREFIX = "Jest Testimonial"

// Base64url alphabet, used to reliably mutate one signature character.
const BASE64URL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

let token // token admin récupéré au login

// Submits a testimonial through the PUBLIC route and returns its DB id.
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
  // Nettoyage défensif : si un run précédent a laissé des témoignages de
  // test, on les supprime pour repartir propre.
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
// APPROVE — PATCH /api/admin/testimonials/:id/approve
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
// REJECT — PATCH /api/admin/testimonials/:id/reject
// ============================================================
describe("PATCH /api/admin/testimonials/:id/reject", () => {

  it("A3 — sans jeton → 401 et statut resté 'pending' en base", async () => {
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

    // On ne touche qu'au dernier caractère de la signature : header et
    // payload restent du base64url valide, donc une vérification naïve qui
    // ne décoderait que le payload manquerait cette altération.
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
// MASS ASSIGNMENT
// ============================================================
describe("Mass assignment via le corps de la requête", () => {

  it("B2 — { status: 'rejected' } envoyé dans le corps de /approve → statut forcé à 'approved'", async () => {
    const id = await submitTestimonial("B2")

    const res = await request(app)
      .patch(`/api/admin/testimonials/${id}/approve`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "rejected" })

    expect(res.status).toBe(200)

    // The route hardcodes the status server-side and never reads it from
    // req.body — so this must be "approved", not the "rejected" a client
    // tried to inject through the payload.
    const row = await prisma.testimonial.findUnique({ where: { id } })
    expect(row.status).toBe("approved")
  })
})
