// tests/Education.admin.test.js
// Tests d'intégration de la page Éducation (tâches 172 / 172C) : CRUD des sections et des cards — scénario commun : helpers/adminCrud.js
//
// Sections et cards dans UN SEUL fichier : Jest exécute les fichiers en parallèle, et le nettoyage
// des cards (cleanupItems) effacerait celles que les tests de sections créent si les deux fichiers tournaient en même temps.
// Lancer : docker exec sensolidaire_backend npm run test:integration

import { it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"
import { describeAdminCrud, loginAsAdmin, TEST_MARKER } from "./helpers/adminCrud.js"

const SECTIONS = "/api/admin/education-sections"
const ITEMS = "/api/admin/education-items"
const auth = (token) => ({ Authorization: `Bearer ${token}` })

// ── NETTOYAGE — uniquement les enregistrements de test (marqueur dans le titre) ──
const cleanupItems = async () => {
  const items = await prisma.educationItem.findMany({ where: { title: { contains: TEST_MARKER } }, select: { id: true } })
  const ids = items.map(i => i.id)
  if (ids.length === 0) return
  await prisma.media.deleteMany({ where: { entity_type: "education_item", entity_id: { in: ids } } })
  await prisma.educationItem.deleteMany({ where: { id: { in: ids } } })
}

const cleanupSections = async () => {
  await cleanupItems() // les cards de test d'abord (clé étrangère vers la section)
  const sections = await prisma.educationSection.findMany({ where: { title: { contains: TEST_MARKER } }, select: { id: true } })
  const ids = sections.map(s => s.id)
  if (ids.length === 0) return
  await prisma.media.deleteMany({ where: { entity_type: "education_section", entity_id: { in: ids } } })
  await prisma.educationSection.deleteMany({ where: { id: { in: ids } } })
}

afterAll(async () => {
  await cleanupSections()
  await prisma.$disconnect()
})

// ── Données de test ──
const sectionBody = (title = `Section ${TEST_MARKER}`) => ({
  title,
  eyebrow: "Programme de test",
  content: "Premier paragraphe.\n\nSecond paragraphe.",
  audience: "Écoles primaires",
  price: "Gratuit",
  rattachement: "FRANCE",
})

const itemBody = (title = `Card ${TEST_MARKER}`) => ({
  title,
  description: "Description courte de test",
  type: "Atelier",
  public: ["primaire", "adultes"],
})

const createSection = async (token, title) => {
  const res = await request(app).post(SECTIONS).set(auth(token)).send(sectionBody(title))
  expect(res.status).toBe(201)
  return res.body.section
}

// ═══ SECTIONS ═════════════════════════════════════════════════════════════

describeAdminCrud({
  label: "Éducation — sections",
  adminPath: SECTIONS,
  key: "section",
  validBody: () => sectionBody(),
  invalidBody: () => ({ title: `Section ${TEST_MARKER}` }), // pas de texte de présentation
  // Modification partielle : seuls ces champs sont envoyés
  updateBody: () => ({ title: `Section ${TEST_MARKER} modifiée`, rattachement: "COMMUN" }),
  checkUpdated: (section) => {
    expect(section.title).toBe(`Section ${TEST_MARKER} modifiée`)
    expect(section.rattachement).toBe("COMMUN")
    // Champs non envoyés : conservés, pas vidés
    expect(section.eyebrow).toBe("Programme de test")
    expect(section.price).toBe("Gratuit")
  },
  publicList: { path: "/api/education-sections", extract: (body) => body },
  cleanup: cleanupSections,
  extraTests: ({ token, created }) => {
    it("adresse d'ancre générée depuis le titre, inchangée après modification du titre", async () => {
      expect(created().slug).toBe(`section-${TEST_MARKER}`)
      const res = await request(app).get(`${SECTIONS}/${created().id}`).set(auth(token()))
      expect(res.body.section.title).toBe(`Section ${TEST_MARKER} modifiée`)
      expect(res.body.section.slug).toBe(`section-${TEST_MARKER}`)
    })

    it("rattachement inconnu → 400", async () => {
      const res = await request(app).patch(`${SECTIONS}/${created().id}`).set(auth(token())).send({ rattachement: "ALLEMAGNE" })
      expect(res.status).toBe(400)
    })

    it("plus de 3 boutons → 400", async () => {
      const buttons = Array.from({ length: 4 }, (_, i) => ({ label: `Bouton ${i}`, url: "/contact" }))
      const res = await request(app).put(`${SECTIONS}/${created().id}/media`).set(auth(token())).send({ buttons })
      expect(res.status).toBe(400)
    })

    it("bouton avec un lien invalide → 400", async () => {
      const res = await request(app).put(`${SECTIONS}/${created().id}/media`).set(auth(token()))
        .send({ buttons: [{ label: "Site", url: "javascript:alert(1)" }] })
      expect(res.status).toBe(400)
    })

    it("photos et boutons enregistrés, boutons dans l'ordre envoyé", async () => {
      const res = await request(app).put(`${SECTIONS}/${created().id}/media`).set(auth(token())).send({
        images: [{ file_url: `/uploads/images/${TEST_MARKER}.webp`, label: "Photo de test" }],
        buttons: [
          { label: "Nous contacter", url: "/contact" },
          { label: "Site officiel", url: "https://www.eco-ecole.org/" },
        ],
      })
      expect(res.status).toBe(200)

      const check = await request(app).get(`${SECTIONS}/${created().id}`).set(auth(token()))
      expect(check.body.section.images).toHaveLength(1)
      expect(check.body.section.buttons.map(b => b.label)).toEqual(["Nous contacter", "Site officiel"])
      expect(check.body.section.buttons[1].file_url).toBe("https://www.eco-ecole.org/")
    })

    it("ordre des sections : liste invalide → 400", async () => {
      const res = await request(app).put(`${SECTIONS}/order`).set(auth(token())).send({ ids: ["a", "b"] })
      expect(res.status).toBe(400)
    })
  },
})

// ── Ordre et suppression : cas propres aux sections ──
it("ordre des sections : la liste envoyée devient l'ordre d'affichage", async () => {
  const token = await loginAsAdmin()
  const a = await createSection(token, `Section ${TEST_MARKER} A`)
  const b = await createSection(token, `Section ${TEST_MARKER} B`)

  // Seules les sections de test sont réordonnées : celles de la cliente ne sont pas touchées
  const res = await request(app).put(`${SECTIONS}/order`).set(auth(token)).send({ ids: [b.id, a.id] })
  expect(res.status).toBe(200)

  const [newA, newB] = await Promise.all([
    prisma.educationSection.findUnique({ where: { id: a.id } }),
    prisma.educationSection.findUnique({ where: { id: b.id } }),
  ])
  expect(newB.display_order).toBeLessThan(newA.display_order)

  await cleanupSections()
})

it("suppression d'une section → ses cards sont conservées, détachées", async () => {
  const token = await loginAsAdmin()
  const section = await createSection(token)
  const card = await request(app).post(ITEMS).set(auth(token)).send({ ...itemBody(), section_id: section.id })
  expect(card.status).toBe(201)

  const del = await request(app).delete(`${SECTIONS}/${section.id}`).set(auth(token))
  expect(del.status).toBe(200)

  const kept = await prisma.educationItem.findUnique({ where: { id: card.body.item.id } })
  expect(kept).not.toBeNull()
  expect(kept.section_id).toBeNull()

  await cleanupSections()
})

// ═══ CARDS ════════════════════════════════════════════════════════════════

describeAdminCrud({
  label: "Éducation — cards",
  adminPath: ITEMS,
  key: "item",
  validBody: () => itemBody(),
  invalidBody: () => ({ ...itemBody(), public: [] }), // aucun public
  updateBody: () => ({ title: `Card ${TEST_MARKER} modifiée`, public: ["college_lycee"] }),
  checkUpdated: (item) => {
    expect(item.title).toBe(`Card ${TEST_MARKER} modifiée`)
    expect(item.public).toBe("college_lycee")
    expect(item.type).toBe("Atelier") // non envoyé : conservé
  },
  publicList: { path: "/api/education-items", extract: (body) => body },
  cleanup: cleanupItems,
  extraTests: ({ token, created }) => {
    it("card masquée → sa page publique répond 404", async () => {
      const res = await request(app).get(`/api/education-items/${created().slug}`)
      expect(res.status).toBe(404)
    })

    it("public inconnu → 400", async () => {
      const res = await request(app).patch(`${ITEMS}/${created().id}`).set(auth(token())).send({ public: ["retraites"] })
      expect(res.status).toBe(400)
    })

    it("section inexistante → 400 (message clair, pas d'erreur de base)", async () => {
      const res = await request(app).patch(`${ITEMS}/${created().id}`).set(auth(token())).send({ section_id: 2_000_000_000 })
      expect(res.status).toBe(400)
    })

    it("fiche qui n'est ni un fichier envoyé ni une adresse complète → 400", async () => {
      const res = await request(app).patch(`${ITEMS}/${created().id}`).set(auth(token())).send({ external_url: "fiche.pdf" })
      expect(res.status).toBe(400)
    })

    it("fiche PDF envoyée depuis l'ordinateur → acceptée", async () => {
      const res = await request(app).patch(`${ITEMS}/${created().id}`).set(auth(token()))
        .send({ external_url: `/uploads/documents/${TEST_MARKER}.pdf` })
      expect(res.status).toBe(200)
      expect(res.body.item.external_url).toBe(`/uploads/documents/${TEST_MARKER}.pdf`)
    })
  },
})
