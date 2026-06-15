// jest.config.js
// Config Jest pour un projet en ESM ("type": "module" dans package.json).
// transform: {} → on désactive Babel pour utiliser l'ESM natif de Node,
// activé par le flag --experimental-vm-modules (voir script "test" du package.json).
export default {
  testEnvironment: "node",
  transform: {},
  // Les fichiers de test sont reconnus s'ils finissent par .test.js
  testMatch: ["**/tests/**/*.test.js"],
}
