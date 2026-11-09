// tests/unit/jwt.test.js
// Tests unitaires des jetons d'authentification : access token (15 min) et refresh token (7 j), secrets distincts.

import { describe, it, expect, beforeAll } from "@jest/globals"
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../src/utils/jwt.js"

const ADMIN = { id: 42, role: "admin" }

beforeAll(() => {
  // Secrets de test : jamais les vrais secrets du .env
  process.env.JWT_SECRET = "secret-de-test-access"
  process.env.JWT_REFRESH_SECRET = "secret-de-test-refresh"
  delete process.env.JWT_EXPIRES_IN
  delete process.env.JWT_REFRESH_EXPIRES_IN
})

describe("access token", () => {
  it("contient l'id et le rôle de l'admin", () => {
    const payload = verifyAccessToken(generateAccessToken(ADMIN))
    expect(payload).toMatchObject({ id: 42, role: "admin" })
  })

  it("expire au bout de 15 minutes", () => {
    const { iat, exp } = verifyAccessToken(generateAccessToken(ADMIN))
    expect(exp - iat).toBe(15 * 60)
  })

  it("refuse un jeton signé avec un autre secret", () => {
    const forged = jwt.sign({ id: 1, role: "admin" }, "secret-pirate")
    expect(() => verifyAccessToken(forged)).toThrow()
  })

  it("refuse un jeton expiré", () => {
    const expired = jwt.sign({ id: 1, role: "admin" }, process.env.JWT_SECRET, { expiresIn: -10 })
    expect(() => verifyAccessToken(expired)).toThrow(/expired/)
  })
})

describe("refresh token", () => {
  it("ne contient que l'id (pas le rôle) et dure 7 jours", () => {
    const payload = verifyRefreshToken(generateRefreshToken(ADMIN))
    expect(payload.id).toBe(42)
    expect(payload.role).toBeUndefined()
    expect(payload.exp - payload.iat).toBe(7 * 24 * 60 * 60)
  })

  it("un refresh token ne peut pas servir d'access token (secrets différents)", () => {
    expect(() => verifyAccessToken(generateRefreshToken(ADMIN))).toThrow()
  })
})
