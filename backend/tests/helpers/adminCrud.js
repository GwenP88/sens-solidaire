// tests/helpers/adminCrud.js
// Scénario de test commun à tous les CRUD du dashboard (tâche 126) — chaque fichier *.admin.test.js l'appelle avec sa config.
//
// ⚠️ Ces tests tournent sur la VRAIE base (celle du conteneur Docker), qui contient
// les données saisies par la cliente. Règle absolue : on ne crée, ne modifie et ne
// supprime QUE des enregistrements de test, reconnaissables à un marqueur
// (TEST_MARKER dans le titre / nom / slug), et on ne supprime jamais "en masse".
//
// Lancer : docker exec sensolidaire_backend npm test

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../../src/app.js"

// Marqueur présent dans tout ce que les tests créent — sert au nettoyage ciblé
export const TEST_MARKER = "jest-test"

// Identifiants de l'admin créé par le seed (mot de passe = ADMIN_PASSWORD de backend/.env)
const ADMIN = {
  email: "admin@sensolidaire.org",
  password: process.env.ADMIN_PASSWORD || "Admin1234!",
}

// Id qui n'existe pas (reste dans la limite d'un Int PostgreSQL)
const UNKNOWN_ID = 2_000_000_000

export const loginAsAdmin = async () => {
  const res = await request(app).post("/api/auth/login").send(ADMIN)
  return res.body.accessToken
}

// config :
//   label         : nom affiché dans le rapport Jest (ex. "Médias & actualités")
//   adminPath     : ex. "/api/admin/media-posts"
//   key           : clé de l'objet dans les réponses create / update / get (ex. "post")
//   validBody     : () => corps valide pour la création
//   invalidBody   : () => corps refusé (champ obligatoire manquant) → 400 attendu
//   updateBody    : () => corps de modification
//   checkUpdated  : (record) => assertions sur l'enregistrement modifié
//   publicList    : { path, extract: (body) => tableau } — liste publique (éléments actifs seulement)
//   cleanup       : async () => supprime les restes d'un run précédent (enregistrements de test UNIQUEMENT)
//   extraTests    : (ctx) => tests propres à la ressource ; ctx.token() et ctx.created() donnent l'état courant
export const describeAdminCrud = (config) => {
  const { label, adminPath, key, validBody, invalidBody, updateBody, checkUpdated, publicList, cleanup, extraTests } = config

  describe(`CRUD admin — ${label}`, () => {
    let token
    let created // enregistrement créé pendant le scénario

    // Est-ce que l'enregistrement de test apparaît sur le site public ?
    const isPublic = async () => {
      const res = await request(app).get(publicList.path)
      expect(res.status).toBe(200)
      return publicList.extract(res.body).some(item => item.id === created.id)
    }

    beforeAll(async () => {
      await cleanup()               // un run précédent interrompu a pu laisser des restes
      token = await loginAsAdmin()
    })

    afterAll(async () => {
      await cleanup()
    })

    // ── Sécurité ──────────────────────────────────────────────────────────
    it("sans token → 401 (rien n'est créé)", async () => {
      const res = await request(app).post(adminPath).send(validBody())
      expect(res.status).toBe(401)
    })

    // ── Création ──────────────────────────────────────────────────────────
    it("champ obligatoire manquant → 400", async () => {
      const res = await request(app).post(adminPath).set("Authorization", `Bearer ${token}`).send(invalidBody())
      expect(res.status).toBe(400)
      expect(res.body.message).toBeDefined() // message affiché à la cliente
    })

    it("création valide → 201", async () => {
      const res = await request(app).post(adminPath).set("Authorization", `Bearer ${token}`).send(validBody())
      expect(res.status).toBe(201)
      created = res.body[key]
      expect(created.id).toBeDefined()
      expect(created.is_active).toBe(true)
    })

    // ── Lecture ───────────────────────────────────────────────────────────
    it("lecture par id → 200", async () => {
      const res = await request(app).get(`${adminPath}/${created.id}`).set("Authorization", `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body[key].id).toBe(created.id)
    })

    it("lecture d'un id inexistant → 404", async () => {
      const res = await request(app).get(`${adminPath}/${UNKNOWN_ID}`).set("Authorization", `Bearer ${token}`)
      expect(res.status).toBe(404)
    })

    // ── Modification ──────────────────────────────────────────────────────
    it("modification → 200 et valeurs enregistrées", async () => {
      const res = await request(app).patch(`${adminPath}/${created.id}`).set("Authorization", `Bearer ${token}`).send(updateBody())
      expect(res.status).toBe(200)
      checkUpdated(res.body[key])
    })

    // ── Pause / reprise : visibilité sur le site public ───────────────────
    it("actif → visible dans la liste publique", async () => {
      expect(await isPublic()).toBe(true)
    })

    it("mise en pause → invisible dans la liste publique", async () => {
      const res = await request(app).patch(`${adminPath}/${created.id}/toggle`).set("Authorization", `Bearer ${token}`).send({ is_active: false })
      expect(res.status).toBe(200)
      expect(res.body[key].is_active).toBe(false)
      expect(await isPublic()).toBe(false)
    })

    // Tests propres à la ressource (ex. page détail d'un contenu en pause) —
    // exécutés pendant que l'enregistrement est EN PAUSE
    if (extraTests) extraTests({ token: () => token, created: () => created })

    it("réactivation → de nouveau visible", async () => {
      const res = await request(app).patch(`${adminPath}/${created.id}/toggle`).set("Authorization", `Bearer ${token}`).send({ is_active: true })
      expect(res.status).toBe(200)
      expect(await isPublic()).toBe(true)
    })

    // ── Suppression définitive ────────────────────────────────────────────
    it("suppression sans token → 401", async () => {
      const res = await request(app).delete(`${adminPath}/${created.id}`)
      expect(res.status).toBe(401)
    })

    it("suppression définitive → 200, puis introuvable", async () => {
      const res = await request(app).delete(`${adminPath}/${created.id}`).set("Authorization", `Bearer ${token}`)
      expect(res.status).toBe(200)

      const check = await request(app).get(`${adminPath}/${created.id}`).set("Authorization", `Bearer ${token}`)
      expect(check.status).toBe(404)
    })
  })
}
