// src/controllers/missionController.js
// Couche controller des missions
// Rôle : extraire les données de la requête, appeler le service,
//        formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à missionService.js

// Import des fonctions du service missions
import { findAll, findBySlug } from "../services/missionService.js"


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
    // Extrait les filtres depuis les query params de l'URL
    // Si absent → undefined → le service ignorera ce filtre et retournera tout
    const filters = {
      type: req.query.type,
      country: req.query.country,
    }

    // Délègue la récupération des missions au service
    // findAll retourne toujours un tableau (vide si aucun résultat)
    const missions = await findAll(filters)

    // Retourne la liste des missions en JSON
    return res.status(200).json({
      success: true,
      missions
    })

  } catch (error) {
    // Passe l'erreur au errorMiddleware pour la formater
    next(error)
  }
}


// ── GET MISSION BY SLUG ───────────────────────────────────────────────────────
// GET /api/missions/:slug
// Paramètre URL : slug — ex: /api/missions/volontariat-kenya-faune-sauvage
// Retourne la mission complète avec pricing, location et témoignages approuvés
// Retourne 400 si slug absent, 404 si mission introuvable (géré par le service)
export const getMissionBySlug = async (req, res, next) => {
  try {
    // Extrait le slug depuis les paramètres de l'URL
    const { slug } = req.params

    // Vérifie que le slug est présent dans la requête
    // Ce cas arrive si la route est mal configurée ou appelée sans paramètre
    if (!slug) {
      return res.status(400).json({
        error: true,
        message: "Slug manquant"
      })
    }

    // Délègue la récupération au service
    // Si aucune mission trouvée → le service throw une erreur 404
    // qui sera interceptée par le catch et passée au errorMiddleware
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
