// TestimonialForm.test.jsx

import { render, screen, fireEvent } from '@testing-library/react'
import { submitTestimonial } from '../src/services/api'
import { describe, it, expect, vi } from 'vitest'
import TestimonialForm from '../src/components/testimonials/TestimonialForm'

// On neutralise les appels API pour éviter les requêtes réseau pendant les tests
vi.mock('../src/services/api', () => ({
  fetchMissions: vi.fn(() => Promise.resolve([])),
  submitTestimonial: vi.fn(() => Promise.resolve()),
  uploadFile: vi.fn(() => Promise.resolve(null)),
}))

describe('TestimonialForm', () => {

  it("affiche une erreur si le formulaire est soumis sans consentement RGPD", () => {
    render(<TestimonialForm onClose={vi.fn()} />)

    fireEvent.click(screen.getByText('Envoyer mon témoignage →'))

    expect(
      screen.getByText(
        "Le consentement RGPD est obligatoire pour envoyer votre témoignage."
      )
    ).toBeInTheDocument()
  })

  it("ne signale plus d'erreur RGPD lorsque le consentement est coché", () => {
    render(<TestimonialForm onClose={vi.fn()} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    fireEvent.click(screen.getByText('Envoyer mon témoignage →'))

    expect(
      screen.queryByText(
        "Le consentement RGPD est obligatoire pour envoyer votre témoignage."
      )
    ).not.toBeInTheDocument()
  })

  it("affiche un message dans le formulaire si l'envoi échoue (pas d'alert)", async () => {
    submitTestimonial.mockRejectedValueOnce(new Error('Serveur injoignable'))
    const { container } = render(<TestimonialForm onClose={vi.fn()} />)

    // Remplit les champs obligatoires ("Groupe jeune" ne demande pas de destination)
    fireEvent.change(container.querySelector('[name="prenom"]'), { target: { name: 'prenom', value: 'Léa' } })
    fireEvent.change(container.querySelector('[name="nom"]'), { target: { name: 'nom', value: 'Martin' } })
    fireEvent.change(container.querySelector('[name="type"]'), { target: { name: 'type', value: 'groupe_jeunes' } })
    fireEvent.change(container.querySelector('[name="quote"]'), { target: { name: 'quote', value: 'Super séjour.' } })
    fireEvent.click(screen.getByRole('checkbox'))

    fireEvent.click(screen.getByText('Envoyer mon témoignage →'))

    expect(await screen.findByRole('alert')).toHaveTextContent("Votre témoignage n'a pas pu être envoyé")
  })

})