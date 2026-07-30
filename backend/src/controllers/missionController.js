// src/controllers/missionController.js
// Couche controller des missions
// Rôle : extraire les données de la requête, VALIDER les entrées,
//        appeler le service, formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à missionService.js

// Import des fonctions du service missions
import { findAll, findAllForAdmin, findById, findBySlug, create, update, softDelete, hardDelete } from "../services/missionService.js"

// ── CONSTANTES DE VALIDATION ──────────────────────────────────────────────────
// ⚠️ TODO (à valider avec la cliente le [date]) : figer la taxonomie définitive.
//    Valeurs ACTUELLES en base (voir seed.js) — à confirmer/compléter :
//      volontariat_individuel · service_civique · groupe_jeunes · conge_solidaire
const VALID_TYPES = [
  "volontariat_individuel",
  "service_civique",
  "groupe_jeunes",
  "conge_solidaire",
]

// Regex pour valider un nom de pays
// Autorise : lettres (avec accents), espaces, tirets
// Interdit : chiffres, <, >, ", ', ;, ( ) etc. → bloque les tentatives XSS
const COUNTRY_REGEX = /^[a-zA-ZÀ-ÿ\s-]+$/

// Regex pour valider un slug
// Un slug ne contient que des lettres minuscules, chiffres et tirets
// Ex valide : "volontariat-kenya-faune-sauvage"
// Ex invalide : "kenya<script>", "kenya/../../etc"
const SLUG_REGEX = /^[a-z0-9-]+$/


// ── GET ALL MISSIONS ──────────────────────────────────────────────────────────
// GET /api/missions
// Query params optionnels : ?type=faune_sauvage&country=Kenya
// Exemples :
//   /api/missions                          → toutes les missions actives
//   /api/missions?type=faune_sauvage       → filtre par type
//   /api/missions?country=Kenya            → filtre par pays
//   /api/missions?type=faune_sauvage&country=Kenya → les deux filtres
export const getMissions = async (req, res, next) => {
  try {
    const { type, country } = req.query

    // ── Validation du paramètre "type" ──
    // On valide uniquement si le paramètre est fourni (il est optionnel)
    // Si fourni mais invalide → 400 Bad Request
    if (type !== undefined) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({
          error: true,
          message: `Type invalide. Valeurs acceptées : ${VALID_TYPES.join(", ")}`,
        })
      }
    }

    // ── Validation du paramètre "country" ──
    // Vérifie le format avec la regex — bloque les caractères dangereux
    if (country !== undefined) {
      if (!COUNTRY_REGEX.test(country)) {
        return res.status(400).json({
          error: true,
          message: "Paramètre country invalide — caractères non autorisés",
        })
      }

      // Limite la longueur — un nom de pays ne dépasse pas 100 caractères
      if (country.length > 100) {
        return res.status(400).json({
          error: true,
          message: "Paramètre country trop long",
        })
      }
    }

    // Construit l'objet filtres après validation
    // Les valeurs sont maintenant garanties propres
    const filters = {
      type,    // undefined si non fourni → ignoré par le service
      country, // undefined si non fourni → ignoré par le service
    }

    // Délègue la récupération des missions au service
    const missions = await findAll(filters)

    // Retourne la liste des missions en JSON
    return res.status(200).json({
      success: true,
      missions
    })

  } catch (error) {
    next(error)
  }
}


// ── GET MISSION BY SLUG ───────────────────────────────────────────────────────
// GET /api/missions/:slug
// Paramètre URL : slug — ex: /api/missions/volontariat-kenya-faune-sauvage
// Retourne la mission complète avec pricing, location et témoignages approuvés
export const getMissionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    // ── Validation : slug présent ──
    if (!slug) {
      return res.status(400).json({
        error: true,
        message: "Slug manquant"
      })
    }

    // ── Validation : format du slug ──
    // Un slug valide = lettres minuscules, chiffres, tirets uniquement
    // Bloque : "../../../etc/passwd", "<script>", espaces, majuscules
    if (!SLUG_REGEX.test(slug)) {
      return res.status(400).json({
        error: true,
        message: "Format de slug invalide"
      })
    }

    // ── Validation : longueur du slug ──
    // Un slug normal ne dépasse pas 100 caractères
    if (slug.length > 100) {
      return res.status(400).json({
        error: true,
        message: "Slug trop long"
      })
    }

    // Délègue la récupération au service
    // Si aucune mission trouvée → le service throw une erreur 404
    const mission = await findBySlug(slug)

    // Retourne la mission complète en JSON
    return res.status(200).json({
      success: true,
      mission
    })

  } catch (error) {
    // Gère le 404 throwé par le service si slug inconnu
    next(error)
  }
}

// ── GET ALL MISSIONS FOR ADMIN ────────────────────────────────────────────────
// GET /api/admin/missions
// Route PROTÉGÉE (authMiddleware) : réservée au dashboard.
// Différence avec getMissions : AUCUN filtre → renvoie actives ET inactives.
// Aucune query à valider, donc pas de validation ici.
export const getMissionsForAdmin = async (req, res, next) => {
  try {

    // 👉 appelle le bon service (celui qui ne filtre pas is_active)
    const missions = await findAllForAdmin()

    // 👉 renvoie la MÊME enveloppe que getMissions (status + format)
    return res.status(200).json({
      success: true,
      missions
    })

  } catch (error) {
    next(error)
  }
}

// ── GET MISSION BY ID (ADMIN) ─────────────────────────────────────────────────
// GET /api/admin/missions/:id
// Route PROTÉGÉE — charge une mission par son id pour le formulaire d'édition
export const getMissionById = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    const mission = await findById(id)
    return res.status(200).json({ success: true, mission })

  } catch (error) {
    next(error)
  }
}

// ── CREATE MISSION (ADMIN) ────────────────────────────────────────────────────
// POST /api/admin/missions
// Route PROTÉGÉE : montée derrière authMiddleware (token valide + role admin)
// Body JSON attendu : { title, country, slug, short_description, type, ... }
export const createMission = async (req, res, next) => {
  try {
    // 1. Extraction des champs depuis le body
    const {
      title, country, slug, short_description, type,
      description, volunteer_role, programme, included, not_include,
      admin_info, ministry_url, health_info, helloasso_url,
      image_url, image_alt, how_to_go,
    } = req.body

    // 2. Validation : champs OBLIGATOIRES présents
    const missing = []
    if (!title)  missing.push("title")
    if (!country)  missing.push("country")
    if (!slug)   missing.push("slug")
    if (!short_description)  missing.push("short_description")
    
    if (missing.length > 0){
      return res.status(400).json({
        error : true, 
        message : `Champ(s) obligatoire(s) manquant(s) : ${missing.join(", ")}`,
      })
    }

    // 3. Validation des FORMATS
    // 👉 VALID_TYPES.includes(type) ?     sinon → 400   (si type fourni)
    // 👉 SLUG_REGEX.test(slug) ?          sinon → 400
    // 👉 COUNTRY_REGEX.test(country) ?    sinon → 400
    if (type !== undefined && !VALID_TYPES.includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Type non valide"
      })
    }

    if (!SLUG_REGEX.test(slug)) {
      return res.status(400).json({
        error: true,
        message: "Caractére non accepté dans le slug"
      })
    }

    if (!COUNTRY_REGEX.test(country)) {
      return res.status(400).json({
        error: true,
        message: "Pays non valide"
      })
    }

    // 4. Appel du service avec un objet PROPRE (jamais req.body brut !)
    const mission = await create({
      title, country, slug, short_description, type,
      description, volunteer_role, programme, included, not_include,
      admin_info, ministry_url, health_info, helloasso_url,
      image_url, how_to_go, image_alt,
    })

    // 5. Réponse 201 Created (ressource créée, pas un simple 200)
    // 👉 return res.status(201).json({ success: true, mission })
    return res.status(201).json({
      success: true,
      mission
    })

  } catch (error) {
    // Attrape le 409 (slug dupliqué) + autres erreurs Prisma
    next(error)
  }
}

// ── UPDATE MISSION (ADMIN) ────────────────────────────────────────────────────
// PATCH /api/admin/missions/:id
// Modification PARTIELLE : l'admin n'envoie QUE les champs à changer.
// Route PROTÉGÉE (authMiddleware).
export const updateMission = async (req, res, next) => {
  try {
    // 1. Récupérer et valider l'id depuis l'URL
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    // 2. WHITELIST + champs fournis uniquement
    //    On construit "data" en n'ajoutant QUE les champs réellement envoyés.
    //    → un champ absent ne sera pas touché (c'est tout l'intérêt du PATCH).
    const data = {}
    const allowed = [
      "title", "country", "slug", "short_description", "type",
      "description", "volunteer_role", "programme", "included", "not_include",
      "admin_info", "ministry_url", "health_info", "helloasso_url",
      "image_url", "how_to_go", "is_active", "image_alt",
    ]
    for (const champ of allowed) {
      if (req.body[champ] !== undefined) {
        data[champ] = req.body[champ]
      }
    }

    // 3. Refuser une requête vide (aucun champ à modifier)
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: true, message: "Aucun champ à modifier" })
    }

    // 4. Valider les FORMATS — mais SEULEMENT pour les champs présents
    if (data.type !== undefined && !VALID_TYPES.includes(data.type)) {
      return res.status(400).json({ error: true, message: "Type non valide" })
    }
    if (data.slug !== undefined && !SLUG_REGEX.test(data.slug)) {
      return res.status(400).json({ error: true, message: "Format de slug invalide" })
    }
    if (data.country !== undefined && !COUNTRY_REGEX.test(data.country)) {
      return res.status(400).json({ error: true, message: "Pays non valide" })
    }

    // 5. Appel du service
    const mission = await update(id, data)

    // 6. Réponse 200 OK (modification réussie — pas 201, rien n'a été CRÉÉ)
    return res.status(200).json({ success: true, mission })

  } catch (error) {
    next(error)   // attrape 404 (id absent) et 409 (slug pris) du service
  }
}

// ── DELETE MISSION (ADMIN) ────────────────────────────────────────────────────
// DELETE /api/admin/missions/:id
// SOFT DELETE : désactive la mission (is_active = false) au lieu de l'effacer.
// Route PROTÉGÉE (authMiddleware).
export const deleteMission = async (req, res, next) => {
  try {
    // 1. Valider l'id (même logique que le PATCH)
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    // 2. Désactivation via le service
    const mission = await softDelete(id)

    // 3. Réponse 200 + confirmation
    //    On renvoie la mission désactivée pour que le front confirme l'action.
    return res.status(200).json({
      success: true,
      message: "Mission désactivée",
      mission,
    })

  } catch (error) {
    next(error)   // attrape le 404 du service
  }
}

// ── HARD DELETE MISSION (ADMIN) ───────────────────────────────────────────────
// DELETE /api/admin/missions/:id/permanent
// HARD DELETE : supprime définitivement la mission et ses données dépendantes.
// Route PROTÉGÉE (authMiddleware). IRRÉVERSIBLE.
export const hardDeleteMission = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    const mission = await hardDelete(id)

    return res.status(200).json({
      success: true,
      message: "Mission supprimée définitivement",
      mission,
    })

  } catch (error) {
    next(error)
  }
}