// TestimonialForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TestimonialForm from '../src/components/testimonials/TestimonialForm'

describe('TestimonialForm', () => {
  it("le bouton d'envoi est désactivé sans consentement RGPD", () => {
    render(<TestimonialForm onClose={vi.fn()} />)
    const submitButton = screen.getByText('Envoyer mon témoignage →')
    expect(submitButton).toBeDisabled()
  })

  it("le bouton d'envoi s'active une fois la case RGPD cochée", () => {
    render(<TestimonialForm onClose={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    const submitButton = screen.getByText('Envoyer mon témoignage →')
    expect(submitButton).not.toBeDisabled()
  })
})