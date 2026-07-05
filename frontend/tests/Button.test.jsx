// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../src/components/ui/Button'

describe('Button', () => {
  it('affiche le label passé en prop', () => {
    render(<Button label="Envoyer" />)
    expect(screen.getByText('Envoyer')).toBeInTheDocument()
  })

  it('appelle onClick au clic', () => {
    const handleClick = vi.fn()
    render(<Button label="Cliquer" onClick={handleClick} />)
    fireEvent.click(screen.getByText('Cliquer'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("n'appelle pas onClick quand disabled", () => {
    const handleClick = vi.fn()
    render(<Button label="Bloqué" onClick={handleClick} disabled />)
    fireEvent.click(screen.getByText('Bloqué'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})