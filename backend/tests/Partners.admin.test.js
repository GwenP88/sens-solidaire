// tests/Partners.admin.test.js
// Tests d'intégration du CRUD admin Partenaires (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test

import { expect, afterAll } from "@jest/globals"
import prisma from "../src/config/db.js"
import { describeAdminCrud, TEST_MARKER } from "./helpers/adminCrud.js"

const NAME = `Partenaire ${TEST_MARKER}`
const LOGO = `/uploads/images/${TEST_MARKER}-logo.webp` // chemin fictif : aucun fichier n'est envoyé

const cleanup = async () => {
  await prisma.partner.deleteMany({ where: { name: { contains: TEST_MARKER } } })
}

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Partenaires",
  adminPath: "/api/admin/partners",
  key: "partner",
  validBody: () => ({ name: NAME, logo_url: LOGO }),
  invalidBody: () => ({ name: NAME }), // logo obligatoire (affiché dans le bandeau public)
  updateBody: () => ({ website_url: "https://example.org" }),
  checkUpdated: (partner) => {
    expect(partner.website_url).toBe("https://example.org")
    expect(partner.name).toBe(NAME) // champ non envoyé → inchangé
  },
  publicList: { path: "/api/partners", extract: (body) => body },
  cleanup,
})
