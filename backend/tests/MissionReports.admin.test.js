// tests/MissionReports.admin.test.js
// Tests d'intégration du CRUD admin Rapports de mission (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test

import { expect, afterAll } from "@jest/globals"
import prisma from "../src/config/db.js"
import { describeAdminCrud, TEST_MARKER } from "./helpers/adminCrud.js"

const AUTHOR = `Volontaire ${TEST_MARKER}`
const PDF = `/uploads/documents/${TEST_MARKER}-rapport.pdf` // chemin fictif : aucun fichier n'est envoyé

const cleanup = async () => {
  await prisma.missionReport.deleteMany({ where: { auteur: { contains: TEST_MARKER } } })
}

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Rapports de mission",
  adminPath: "/api/admin/mission-reports",
  key: "report",
  validBody: () => ({ auteur: AUTHOR, type: "groupe_jeunes", annee: 2025, pdf_url: PDF }),
  invalidBody: () => ({ auteur: AUTHOR, type: "groupe_jeunes", annee: 1999, pdf_url: PDF }), // année hors plage
  updateBody: () => ({ annee: 2024 }),
  checkUpdated: (report) => {
    expect(report.annee).toBe(2024)
  },
  publicList: { path: "/api/mission-reports", extract: (body) => body },
  cleanup,
})
