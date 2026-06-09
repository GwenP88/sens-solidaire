// src/controllers/missionController.js
// Couche controller des missions
// Rôle : extraire les données de la requête, VALIDER les entrées,
//        appeler le service, formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à missionService.js

// Import des fonctions du service missions
import { findAll, findBySlug } from "../services/missionService.js"


// ── CONSTANTES DE VALIDATION ──────────────────────────────────────────────────
// Liste exhaustive des types de missions acceptés
// Si un nouveau type est créé → l'ajouter ici ET dans le seed
const VALID_TYPES = [
  "faune_sauvage",
  "developpement_communautaire",
  "sante",
  "education",
  "environnement"
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
