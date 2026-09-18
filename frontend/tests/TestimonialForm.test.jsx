// TestimonialForm.test.jsx

import { render, screen, fireEvent } from '@testing-library/react'
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

})