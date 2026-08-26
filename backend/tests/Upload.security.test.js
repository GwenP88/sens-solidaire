// tests/Upload.security.test.js
// ============================================================
// Non-regression tests for the path-traversal / MIME-spoofing upload
// vulnerability fixed in storageService.js + uploadMiddleware.js
// (audit commit f169ba0, phase 1).
// ------------------------------------------------------------
// Covers:
//   - a path traversal attempt via file.originalname on POST /api/upload
//   - a PDF sent to the public (images-only) upload route
//   - POST /api/admin/upload without a token
//
// ⚠️ PRÉREQUIS pour lancer :
//   - la base Postgres doit tourner (conteneur Docker up + seedée)
//   - lancer DANS le conteneur backend (sinon "postgres" n'est pas résolu) :
//       docker exec sensolidaire_backend npm test
// ============================================================

import { describe, it, expect, afterAll } from "@jest/globals"
import request from "supertest"
import fs from "fs"
import path from "path"
import app from "../src/app.js"

// A real, minimal, valid 1x1 transparent PNG — not a fake buffer. If a
// magic-number check gets added to the upload pipeline later, this test
// must keep passing rather than fail on a bogus payload.
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
)

// Where a successful traversal would have written the file, pre-fix.
const ESCAPED_PATH = path.resolve("src/pwned.js")

// Files actually created on disk by these tests, cleaned up afterwards.
const createdFiles = []

afterAll(() => {
  for (const filePath of createdFiles) {
    fs.rmSync(filePath, { force: true })
  }
})

// ============================================================
// U1 — PATH TRAVERSAL via file.originalname
// ============================================================
describe("POST /api/upload — path traversal via le nom de fichier", () => {

  it("U1 — '../../../../../src/pwned.js' ne sort jamais de public/uploads", async () => {
    const res = await request(app)
      .post("/api/upload")
      .attach("file", PNG_1X1, {
        filename: "../../../../../src/pwned.js",
        contentType: "image/png",
      })

    if (res.status === 200) {
      expect(res.body.url).toMatch(/^\/uploads\/(images|videos|documents)\/[^/]+$/)

      const absolutePath = path.join(process.cwd(), "public", res.body.url)
      const uploadsRoot = path.resolve("public/uploads")
      expect(absolutePath.startsWith(uploadsRoot + path.sep)).toBe(true)
      expect(path.extname(absolutePath)).toBe(".png")

      createdFiles.push(absolutePath)
    }

    // Whatever the response, the traversal target must never exist.
    expect(fs.existsSync(ESCAPED_PATH)).toBe(false)
  })
})

// ============================================================
// U2 — WHITELIST MIME sur la route publique
// ============================================================
describe("POST /api/upload — liste blanche MIME", () => {

  it("U2 — un PDF sur la route publique (images seulement) est refusé, pas un 500", async () => {
    const res = await request(app)
      .post("/api/upload")
      .attach("file", Buffer.from("%PDF-1.4 fake content"), {
        filename: "document.pdf",
        contentType: "application/pdf",
      })

    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })
})

// ============================================================
// U3 — ROUTE ADMIN PROTÉGÉE
// ============================================================
describe("POST /api/admin/upload — authentification requise", () => {

  it("U3 — sans jeton → 401", async () => {
    const res = await request(app).post("/api/admin/upload")
    expect(res.status).toBe(401)
  })
})
