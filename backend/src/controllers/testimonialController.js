// testimonialController.js
// Contrôleur — témoignages

import { getValidatedTestimonials, submitTestimonial } from '../services/testimonialService.js'

// GET /api/testimonials — témoignages validés
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await getValidatedTestimonials()
    res.json(testimonials)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// POST /api/testimonials — soumission d'un témoignage
export const createTestimonial = async (req, res) => {
  try {
    const { author_name, content, mission_id, annee } = req.body

    if (!author_name || !content) {
      return res.status(400).json({ error: 'Nom et témoignage obligatoires' })
    }

    if (content.length > 280) {
      return res.status(400).json({ error: 'Témoignage limité à 280 caractères' })
    }

    if (!req.body.consent_given) {
      return res.status(400).json({ error: 'Consentement RGPD obligatoire' })
    }

    const testimonial = await submitTestimonial({ author_name, content, mission_id, annee })
    res.status(201).json(testimonial)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}