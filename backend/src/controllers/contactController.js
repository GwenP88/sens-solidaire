// contactController.js
// Contact form controller — POST /api/contact
//
// Server-side validation is mandatory here even though the frontend form
// already validates: frontend checks never protect the API, because anyone
// can call it directly with curl or Postman and skip the browser entirely.

import { sendContactEmail } from '../services/contactService.js'

const LIMITS = { nom: 80, prenom: 80, email: 254, sujet: 150, message: 2000 }

// Deliberately permissive: "something@something.something". The goal is to
// reject obvious garbage, not to fully validate every RFC 5322 edge case.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/contact
export const sendContact = async (req, res) => {
  try {
    const { nom, prenom, email, sujet, message } = req.body

    if (!nom || !prenom || !email || !sujet || !message) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' })
    }

    const fields = { nom, prenom, email, sujet, message }
    for (const field of Object.keys(LIMITS)) {
      if (fields[field].length > LIMITS[field]) {
        return res.status(400).json({ error: `Le champ "${field}" dépasse la longueur maximale (${LIMITS[field]} caractères)` })
      }
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide' })
    }

    await sendContactEmail({ nom, prenom, email, sujet, message })
    res.status(200).json({ success: true, message: 'Message envoyé avec succès' })
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' })
  }
}
