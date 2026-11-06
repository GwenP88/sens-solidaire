// services/api/index.js
// Point d'entrée unique : réexporte toutes les fonctions d'API — les imports existants
// (`from '../services/api'`) restent inchangés depuis le découpage de api.js (tâche 128).

export * from './auth.js'
export * from './missions.js'
export * from './testimonials.js'
export * from './fieldActions.js'
export * from './mediaPosts.js'
export * from './education.js'
export * from './teamMembers.js'
export * from './activityReports.js'
export * from './locations.js'
export * from './delegations.js'
export * from './countries.js'
export * from './missionReports.js'
export * from './partners.js'
export * from './galleries.js'
export * from './uploads.js'
