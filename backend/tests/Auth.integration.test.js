// tests/Auth.integration.test.js
// Tests d'intégration de l'authentification admin : login, cookie de refresh, rotation, déconnexion.
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test
// ⚠️ Ces tests se connectent avec le compte admin : une session ouverte dans le
//    dashboard devra se reconnecter après leur passage (un seul refresh token actif).

import { describe, it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

const ADMIN = { email: "admin@sensolidaire.org", password: process.env.ADMIN_PASSWORD || "Admin1234!" }

// Extrait le cookie refreshToken de la réponse (format "refreshToken=...; Path=/; HttpOnly; ...")
const getRefreshCookie = (res) => (res.headers["set-cookie"] || []).find(c => c.startsWith("refreshToken="))

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

afterAll(async () => {
  await prisma.$disconnect()
})

describe("POST /api/auth/login", () => {
  it("champs manquants → 400", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: ADMIN.email })
    expect(res.status).toBe(400)
  })

  it("mauvais mot de passe → 401", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: ADMIN.email, password: "mauvais-mot-de-passe" })
    expect(res.status).toBe(401)
  })

  it("e-mail inconnu → 401 avec le MÊME message (on ne révèle pas quels comptes existent)", async () => {
    const wrongPassword = await request(app).post("/api/auth/login").send({ email: ADMIN.email, password: "x" })
    const unknownEmail = await request(app).post("/api/auth/login").send({ email: "inconnu-jest-test@exemple.org", password: "x" })
    expect(unknownEmail.status).toBe(401)
    expect(unknownEmail.body.message).toBe(wrongPassword.body.message)
  })

  it("identifiants valides → 200, access token + cookie refresh HttpOnly / SameSite=Strict", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN)
    expect(res.status).toBe(200)
    expect(typeof res.body.accessToken).toBe("string")

    const cookie = getRefreshCookie(res)
    expect(cookie).toBeDefined()
    expect(cookie).toMatch(/HttpOnly/i)        // illisible par le JavaScript du navigateur (XSS)
    expect(cookie).toMatch(/SameSite=Strict/i) // non envoyé depuis un autre site (CSRF)
  })

  it("le mot de passe n'apparaît jamais dans la réponse", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN)
    expect(JSON.stringify(res.body)).not.toContain(ADMIN.password)
    expect(res.body.password_hash).toBeUndefined()
  })
})

describe("GET /api/auth/verify", () => {
  it("sans token → 401", async () => {
    const res = await request(app).get("/api/auth/verify")
    expect(res.status).toBe(401)
  })

  it("avec un token admin → 200 et rôle admin", async () => {
    const login = await request(app).post("/api/auth/login").send(ADMIN)
    const res = await request(app).get("/api/auth/verify").set("Authorization", `Bearer ${login.body.accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body.admin.role).toBe("admin")
  })
})

describe("POST /api/auth/refresh", () => {
  it("sans cookie → 401", async () => {
    const res = await request(app).post("/api/auth/refresh")
    expect(res.status).toBe(401)
  })

  it("cookie invalide → 401", async () => {
    const res = await request(app).post("/api/auth/refresh").set("Cookie", "refreshToken=faux-jeton")
    expect(res.status).toBe(401)
  })

  it("cookie valide → nouvel access token ; l'ancien cookie est ensuite refusé (rotation)", async () => {
    const login = await request(app).post("/api/auth/login").send(ADMIN)
    const firstCookie = getRefreshCookie(login).split(";")[0]

    // 1,1 s d'attente : deux jetons signés dans la même seconde seraient identiques
    await wait(1100)
    const refreshed = await request(app).post("/api/auth/refresh").set("Cookie", firstCookie)
    expect(refreshed.status).toBe(200)
    expect(typeof refreshed.body.accessToken).toBe("string")

    // Réutiliser l'ancien jeton = signe de vol → refusé (et toutes les sessions révoquées)
    const reused = await request(app).post("/api/auth/refresh").set("Cookie", firstCookie)
    expect(reused.status).toBe(401)
  })
})

describe("POST /api/auth/logout", () => {
  it("sans token → 401", async () => {
    const res = await request(app).post("/api/auth/logout")
    expect(res.status).toBe(401)
  })

  it("déconnexion → 200, puis le refresh token n'est plus accepté", async () => {
    const login = await request(app).post("/api/auth/login").send(ADMIN)
    const cookie = getRefreshCookie(login).split(";")[0]

    const logout = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${login.body.accessToken}`)
    expect(logout.status).toBe(200)

    const refreshed = await request(app).post("/api/auth/refresh").set("Cookie", cookie)
    expect(refreshed.status).toBe(401)
  })
})
