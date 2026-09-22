// ── COUNTRY CONTROLLER ───────────────────────────────────────────────────
import { getAllCountryNames } from '../utils/countries.js'

// GET /api/admin/countries — liste des noms de pays en français, pour le
// <datalist> du champ pays (délégation)
export const getCountries = async (req, res, next) => {
  try {
    const countries = getAllCountryNames()
    return res.status(200).json({ countries })
  } catch (error) {
    next(error)
  }
}