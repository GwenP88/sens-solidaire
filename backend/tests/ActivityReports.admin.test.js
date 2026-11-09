// tests/ActivityReports.admin.test.js
// Tests d'intégration du CRUD admin Rapports d'activité (tâche 126) — scénario commun : helpers/adminCrud.js
//
// Prérequis : base Docker démarrée et seedée — docker exec sensolidaire_backend npm test
//
// Particularité : l'année est UNIQUE (1 rapport par an). On cherche donc une année
// libre au lancement, pour ne jamais toucher aux vrais rapports de la cliente.

import { it, expect, beforeAll, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"
import { describeAdminCrud, loginAsAdmin, TEST_MARKER } from "./helpers/adminCrud.js"

const PDF = `/uploads/documents/${TEST_MARKER}-rapport-activite.pdf` // chemin fictif, sert aussi au nettoyage

let freeYear // 1re année sans rapport, à partir de 2000 (limite basse de isValidYear)

// Le nettoyage cible l'URL de test : un vrai rapport ne peut pas être supprimé par erreur
const cleanup = async () => {
  await prisma.activityReport.deleteMany({ where: { url: PDF } })
}

beforeAll(async () => {
  await cleanup()
  const taken = (await prisma.activityReport.findMany({ select: { annee: true } })).map(r => r.annee)
  freeYear = 2000
  while (taken.includes(freeYear)) freeYear++
})

afterAll(async () => {
  await prisma.$disconnect()
})

describeAdminCrud({
  label: "Rapports d'activité",
  adminPath: "/api/admin/activity-reports",
  key: "report",
  validBody: () => ({ annee: freeYear, url: PDF }),
  invalidBody: () => ({ annee: freeYear }), // pas de PDF
  updateBody: () => ({ url: PDF }),
  checkUpdated: (report) => {
    expect(report.url).toBe(PDF)
    expect(report.annee).toBe(freeYear)
  },
  publicList: { path: "/api/activity-reports", extract: (body) => body },
  cleanup,
})

// ── Cas propre aux rapports : une seule entrée par année ──
it("deux rapports pour la même année → 409", async () => {
  const token = await loginAsAdmin()

  const first = await request(app).post("/api/admin/activity-reports").set("Authorization", `Bearer ${token}`).send({ annee: freeYear, url: PDF })
  expect(first.status).toBe(201)
  const second = await request(app).post("/api/admin/activity-reports").set("Authorization", `Bearer ${token}`).send({ annee: freeYear, url: PDF })
  expect(second.status).toBe(409)

  await cleanup()
})
