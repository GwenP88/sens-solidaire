// contactController.js
// Contrôleur — formulaire de contact

import { sendContactEmail } from '../services/contactService.js'

// POST /api/contact
export const sendContact = async (req, res) => {
  try {
    const { nom, prenom, email, sujet, message } = req.body

    if (!nom || !prenom || !email || !sujet || !message) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' })
    }

    await sendContactEmail({ nom, prenom, email, sujet, message })
    res.status(200).json({ success: true, message: 'Message envoyé avec succès' })
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' })
  }
}