// tests/Contact.integration.test.js
// Tests d'intégration de la validation du formulaire de contact (POST /api/contact).
//
// ⚠️ Volontairement, AUCUN test n'envoie un message valide : il partirait réellement par e-mail (Resend).
//    On vérifie seulement que le serveur refuse les saisies incorrectes, même sans passer par le site.

import { describe, it, expect } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"

const VALID = { nom: "Martin", prenom: "Léa", email: "lea@exemple.org", sujet: "Question", message: "Bonjour" }

describe("POST /api/contact — validation côté serveur", () => {
  it.each(["nom", "prenom", "email", "sujet", "message"])("champ %s manquant → 400", async (field) => {
    const body = { ...VALID }
    delete body[field]
    const res = await request(app).post("/api/contact").send(body)
    expect(res.status).toBe(400)
  })

  it.each([
    ["nom", 81], ["prenom", 81], ["sujet", 151], ["message", 2001],
  ])("champ %s trop long (%i caractères) → 400", async (field, length) => {
    const res = await request(app).post("/api/contact").send({ ...VALID, [field]: "a".repeat(length) })
    expect(res.status).toBe(400)
  })

  it.each(["pas-un-email", "a@b", "@exemple.org", "lea @exemple.org"])("e-mail invalide %p → 400", async (email) => {
    const res = await request(app).post("/api/contact").send({ ...VALID, email })
    expect(res.status).toBe(400)
  })
})
