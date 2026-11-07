// tests/components/FormElements.test.jsx
// Éléments de formulaire partagés du dashboard : champ avec erreur, barre d'actions, aperçu du résumé de carte.

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Field, FormActionBar, ShortDescriptionPreview, FormSection } from '../../src/components/admin/FormElements'

describe('Field', () => {
  it('affiche l\'astérisque des champs obligatoires et transmet la saisie', () => {
    const onChange = vi.fn()
    render(<Field label="Titre" name="title" value="" onChange={onChange} required />)
    expect(screen.getByText('*')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nouveau' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('affiche le message d\'erreur sous le champ et colore la bordure', () => {
    render(<Field label="Titre" name="title" value="" onChange={vi.fn()} error="Le titre est obligatoire." />)
    expect(screen.getByText('Le titre est obligatoire.')).toBeInTheDocument()
    expect(screen.getByRole('textbox').className).toContain('border-red-400')
  })
})

describe('FormSection', () => {
  it('affiche titre et description', () => {
    render(<FormSection title="Photos" description="Jusqu'à 10 photos."><p>contenu</p></FormSection>)
    expect(screen.getByRole('heading', { name: 'Photos' })).toBeInTheDocument()
    expect(screen.getByText("Jusqu'à 10 photos.")).toBeInTheDocument()
  })
})

describe('FormActionBar', () => {
  it('Annuler appelle onCancel ; Enregistrer est un bouton de soumission', () => {
    const onCancel = vi.fn()
    render(<FormActionBar onCancel={onCancel} submitting={false} submitLabel="Enregistrer" />)
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toHaveAttribute('type', 'submit')
  })

  it("pendant l'envoi : bouton désactivé (pas de double enregistrement) et libellé d'attente", () => {
    render(<FormActionBar onCancel={vi.fn()} submitting submitLabel="Enregistrer" />)
    const button = screen.getByRole('button', { name: 'Enregistrement...' })
    expect(button).toBeDisabled()
  })
})

describe('ShortDescriptionPreview', () => {
  it("n'affiche rien sans texte", () => {
    const { container } = render(<ShortDescriptionPreview text="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('affiche le résumé et le nombre de caractères', () => {
    render(<ShortDescriptionPreview text="Résumé court.---Suite" maxLength={150} />)
    expect(screen.getByText('Résumé court.')).toBeInTheDocument()
    expect(screen.getByText(/13\/150 caractères/)).toBeInTheDocument()
  })

  it('avertit quand le repère --- est placé trop loin', () => {
    render(<ShortDescriptionPreview text={`${'a'.repeat(30)}---suite`} maxLength={20} />)
    expect(screen.getByRole('status')).toHaveTextContent('Placez le repère plus tôt')
  })

  it("pas d'avertissement quand le repère est bien placé", () => {
    render(<ShortDescriptionPreview text="Court.---suite" maxLength={20} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
