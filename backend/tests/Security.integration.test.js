// tests/Security.integration.test.js
// Tests d'intégration des protections HTTP : en-têtes Helmet, CORS restreint, routes admin fermées sans jeton.
//
// Prérequis : base Docker démarrée — docker exec sensolidaire_backend npm test

import { describe, it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

afterAll(async () => {
  await prisma.$disconnect()
})

describe("En-têtes de sécurité (Helmet)", () => {
  it("empêche le navigateur de deviner le type des fichiers (nosniff)", async () => {
    const res = await request(app).get("/api/health")
    expect(res.headers["x-content-type-options"]).toBe("nosniff")
  })

  it("ne révèle pas la technologie du serveur (pas de X-Powered-By: Express)", async () => {
    const res = await request(app).get("/api/health")
    expect(res.headers["x-powered-by"]).toBeUndefined()
  })

  it("interdit l'affichage du site dans une iframe d'un autre site", async () => {
    const res = await request(app).get("/api/health")
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN")
  })
})

describe("CORS", () => {
  it("origine autorisée (site en local) → en-tête Access-Control-Allow-Origin renvoyé", async () => {
    const origin = process.env.FRONTEND_URL || "http://localhost:5173"
    const res = await request(app).get("/api/health").set("Origin", origin)
    expect(res.headers["access-control-allow-origin"]).toBe(origin)
  })

  it("origine inconnue → 403 (et non 500)", async () => {
    const res = await request(app).get("/api/health").set("Origin", "https://site-malveillant.example")
    expect(res.status).toBe(403)
    expect(res.headers["access-control-allow-origin"]).toBeUndefined()
  })
})

describe("Routes admin fermées sans jeton", () => {
  it.each([
    ["get", "/api/admin/missions"],
    ["get", "/api/admin/testimonials"],
    ["get", "/api/admin/locations"],
    ["get", "/api/admin/media-posts"],
    ["get", "/api/admin/field-actions"],
    ["get", "/api/admin/team-members"],
    ["get", "/api/admin/partners"],
    ["get", "/api/admin/activity-reports"],
    ["get", "/api/admin/mission-reports"],
    ["get", "/api/admin/countries"],
    ["post", "/api/admin/upload"],
    ["delete", "/api/admin/media-posts/1"],
  ])("%s %s → 401", async (method, path) => {
    const res = await request(app)[method](path)
    expect(res.status).toBe(401)
  })

  it("jeton falsifié → 401", async () => {
    const res = await request(app).get("/api/admin/missions").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIn0.signature-fausse")
    expect(res.status).toBe(401)
  })
})
