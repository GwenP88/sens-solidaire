// setupTests.js
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Nettoie le DOM après CHAQUE test — sinon les rendus s'accumulent
afterEach(() => {
  cleanup()
})