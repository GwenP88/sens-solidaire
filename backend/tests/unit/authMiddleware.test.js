// tests/unit/authMiddleware.test.js
// Tests unitaires du middleware qui protège les routes /api/admin : requêtes simulées, sans serveur ni base.

import { describe, it, expect, beforeAll, jest } from "@jest/globals"
import jwt from "jsonwebtoken"
import authMiddleware from "../../src/middlewares/authMiddleware.js"

const SECRET = "secret-de-test-access"

// Faux objets Express : on vérifie seulement ce que le middleware en fait
const makeRes = () => {
  const res = {}
  res.status = jest.fn(() => res)
  res.json = jest.fn(() => res)
  return res
}
const run = (authorization) => {
  const req = { headers: authorization === undefined ? {} : { authorization } }
  const res = makeRes()
  const next = jest.fn()
  authMiddleware(req, res, next)
  return { req, res, next }
}

beforeAll(() => {
  process.env.JWT_SECRET = SECRET
})

describe("authMiddleware", () => {
  it("sans header Authorization → 401, la route n'est pas atteinte", () => {
    const { res, next } = run(undefined)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it("header sans « Bearer <token> » → 401", () => {
    const { res, next } = run("Bearer")
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it("jeton invalide → 401", () => {
    const { res, next } = run("Bearer nimportequoi")
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it("jeton valide mais rôle différent de admin → 403", () => {
    const token = jwt.sign({ id: 7, role: "invite" }, SECRET)
    const { res, next } = run(`Bearer ${token}`)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it("jeton admin valide → next() et req.user renseigné", () => {
    const token = jwt.sign({ id: 7, role: "admin" }, SECRET)
    const { req, res, next } = run(`Bearer ${token}`)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(req.user).toEqual({ id: 7, role: "admin" })
  })
})
