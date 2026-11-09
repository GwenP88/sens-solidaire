// tests/TeamMembers.admin.test.js
// Tests d'intégration du CRUD admin Membres de l'équipe (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test

import { expect, afterAll } from "@jest/globals"
import prisma from "../src/config/db.js"
import { describeAdminCrud, TEST_MARKER } from "./helpers/adminCrud.js"

const NAME = `Membre ${TEST_MARKER}`

const cleanup = async () => {
  await prisma.teamMember.deleteMany({ where: { nom: { contains: TEST_MARKER } } })
}

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Membres de l'équipe",
  adminPath: "/api/admin/team-members",
  key: "member",
  validBody: () => ({ nom: NAME, role: "Bénévole test", category: "egalement" }),
  invalidBody: () => ({ nom: NAME, category: "egalement" }), // pas de rôle
  updateBody: () => ({ role: "Trésorière test", category: "bureau" }),
  checkUpdated: (member) => {
    expect(member.role).toBe("Trésorière test")
    expect(member.category).toBe("bureau")
  },
  publicList: { path: "/api/team-members", extract: (body) => body },
  cleanup,
})
