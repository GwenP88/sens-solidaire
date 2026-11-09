// tests/Locations.admin.test.js
// Tests d'intégration du CRUD admin Lieux partenaires (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test

import { it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"
import { describeAdminCrud, TEST_MARKER } from "./helpers/adminCrud.js"

// Pays fictif : la liste publique est filtrée par pays, et aucun vrai lieu n'y est rattaché
const COUNTRY = "Pays-jest-test"

const cleanup = async () => {
  const locations = await prisma.location.findMany({ where: { slug: { contains: TEST_MARKER } }, select: { id: true } })
  const ids = locations.map(l => l.id)
  if (ids.length === 0) return
  await prisma.media.deleteMany({ where: { entity_type: "location", entity_id: { in: ids } } })
  await prisma.location.deleteMany({ where: { id: { in: ids } } })
}

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Lieux partenaires",
  adminPath: "/api/admin/locations",
  key: "location",
  validBody: () => ({ slug: `lieu-${TEST_MARKER}`, name: `Lieu ${TEST_MARKER}`, country: COUNTRY, description: "Description de test." }),
  invalidBody: () => ({ slug: `lieu-${TEST_MARKER}`, country: COUNTRY, description: "Sans nom" }), // pas de nom
  updateBody: () => ({ name: `Lieu ${TEST_MARKER} modifié`, website_url: "https://example.org" }),
  checkUpdated: (location) => {
    expect(location.name).toBe(`Lieu ${TEST_MARKER} modifié`)
    expect(location.website_url).toBe("https://example.org")
  },
  publicList: { path: `/api/locations?country=${encodeURIComponent(COUNTRY)}`, extract: (body) => body.locations },
  cleanup,
  extraTests: ({ created }) => {
    it("lieu en pause → sa page publique répond 404", async () => {
      const res = await request(app).get(`/api/locations/${created().slug}`)
      expect(res.status).toBe(404)
    })
  },
})
