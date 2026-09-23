// ── COUNTRIES ─────────────────────────────────────────────────────────────
// Liste des pays en français + leur code ISO 3166-1 alpha-2 (ex: Kenya → KE).
// Sert à peupler le <datalist> du champ pays et à déduire automatiquement
// flag_code sans jamais le demander à la cliente.

import countries from 'i18n-iso-countries'
import frLocale from 'i18n-iso-countries/langs/fr.json' with { type: 'json' }

countries.registerLocale(frLocale)

// Entrées personnalisées — pas des pays officiels (îles, régions), mais
// utilisées comme "pays" dans certaines missions. Rattachées au code ISO
// du pays réel, pour que le drapeau (flag_code) reste cohérent.
const CUSTOM_ENTRIES = {
  Sumatra: 'ID', // île d'Indonésie
}

// { "Kenya": "KE", "Sénégal": "SN", ..., "Sumatra": "ID" } — pays ISO + entrées perso
const COUNTRY_NAME_TO_CODE = {
  ...(countries.getNames('fr', { select: 'official' })
    ? Object.fromEntries(
        Object.entries(countries.getNames('fr')).map(([code, name]) => [name, code])
      )
    : {}),
  ...CUSTOM_ENTRIES,
}

// Liste triée des noms de pays — pour peupler le <datalist> côté front
export const getAllCountryNames = () => Object.keys(COUNTRY_NAME_TO_CODE).sort()

// Retrouve le code ISO à partir du nom exact du pays (tel que choisi dans le
// <datalist>) — retourne null si le nom ne correspond à rien de connu
export const getCountryCode = (name) => (COUNTRY_NAME_TO_CODE[name] || null)?.toLowerCase() ?? null