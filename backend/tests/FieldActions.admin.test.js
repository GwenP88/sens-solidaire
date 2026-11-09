// tests/FieldActions.admin.test.js
// Tests d'intégration du CRUD admin Actions terrain (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test

import { it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"
import { describeAdminCrud, loginAsAdmin, TEST_MARKER } from "./helpers/adminCrud.js"

const SLUG = `action-${TEST_MARKER}`

const fullBody = (title) => ({
  slug: SLUG,
  title,
  description: "Résumé de test",
  content: "Contenu de test.",
  countries: ["Kenya"],
  odds: [13, 15],
})

// Tags, ODD et pays ont une clé étrangère vers l'action : on les supprime d'abord
const cleanup = async () => {
  const actions = await prisma.fieldAction.findMany({ where: { slug: { contains: TEST_MARKER } }, select: { id: true } })
  const ids = actions.map(a => a.id)
  if (ids.length === 0) return
  await prisma.fieldActionTag.deleteMany({ where: { action_id: { in: ids } } })
  await prisma.fieldActionODD.deleteMany({ where: { action_id: { in: ids } } })
  await prisma.fieldActionCountry.deleteMany({ where: { action_id: { in: ids } } })
  await prisma.media.deleteMany({ where: { entity_type: "field_action", entity_id: { in: ids } } })
  await prisma.fieldAction.deleteMany({ where: { id: { in: ids } } })
}

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Actions terrain",
  adminPath: "/api/admin/field-actions",
  key: "action",
  validBody: () => fullBody(`Action ${TEST_MARKER}`),
  invalidBody: () => ({ slug: SLUG, title: `Action ${TEST_MARKER}`, description: "Résumé" }), // pas de contenu
  // Le formulaire envoie toujours l'action complète (pays et ODD sont recréés à chaque modification)
  updateBody: () => ({ ...fullBody(`Action ${TEST_MARKER} modifiée`), countries: ["Pérou"] }),
  checkUpdated: (action) => {
    expect(action.title).toBe(`Action ${TEST_MARKER} modifiée`)
  },
  publicList: { path: "/api/field-actions", extract: (body) => body },
  cleanup,
  extraTests: ({ created }) => {
    it("action en pause → sa page publique répond 404", async () => {
      const res = await request(app).get(`/api/field-actions/${created().slug}`)
      expect(res.status).toBe(404)
    })
  },
})

// ── Cas propre aux actions : adresse déjà prise ──
it("deux actions avec la même adresse → 409", async () => {
  const token = await loginAsAdmin()
  const body = fullBody(`Action ${TEST_MARKER} doublon`)

  const first = await request(app).post("/api/admin/field-actions").set("Authorization", `Bearer ${token}`).send(body)
  expect(first.status).toBe(201)
  const second = await request(app).post("/api/admin/field-actions").set("Authorization", `Bearer ${token}`).send(body)
  expect(second.status).toBe(409)

  await cleanup()
})
