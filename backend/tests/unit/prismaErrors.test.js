// tests/unit/prismaErrors.test.js
// Tests unitaires de la traduction des erreurs Prisma en codes HTTP (id inexistant → 404, doublon → 409).

import { describe, it, expect } from "@jest/globals"
import { prismaErrorToHttp } from "../../src/utils/prismaErrors.js"

describe("prismaErrorToHttp", () => {
  it("P2025 (enregistrement introuvable) → 404", () => {
    expect(prismaErrorToHttp({ code: "P2025" })).toEqual({ status: 404, message: expect.any(String) })
  })

  it("P2002 (valeur unique déjà prise) → 409", () => {
    expect(prismaErrorToHttp({ code: "P2002" }).status).toBe(409)
  })

  it("une erreur qui porte déjà un statut (posé par un service) n'est pas modifiée", () => {
    expect(prismaErrorToHttp({ code: "P2025", status: 400 })).toBeNull()
  })

  it("une erreur inconnue reste une erreur serveur (null → 500 dans app.js)", () => {
    expect(prismaErrorToHttp({ code: "P1001" })).toBeNull()
    expect(prismaErrorToHttp(new Error("panne"))).toBeNull()
    expect(prismaErrorToHttp(undefined)).toBeNull()
  })
})
