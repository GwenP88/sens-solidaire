// LignesToPuces.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LignesToPuces from '../src/components/ui/LignesToPuces'

describe('LignesToPuces', () => {
  it('transforme chaque ligne non vide en élément de liste', () => {
    const texte = "Première ligne\nDeuxième ligne\n\nTroisième ligne"
    render(<LignesToPuces texte={texte} />)

    expect(screen.getByText('Première ligne')).toBeInTheDocument()
    expect(screen.getByText('Deuxième ligne')).toBeInTheDocument()
    expect(screen.getByText('Troisième ligne')).toBeInTheDocument()

    // La ligne vide (\n\n) ne doit pas créer d'élément
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it("ne rend rien si le texte est vide ou absent", () => {
    const { container } = render(<LignesToPuces texte="" />)
    expect(container).toBeEmptyDOMElement()
  })
})