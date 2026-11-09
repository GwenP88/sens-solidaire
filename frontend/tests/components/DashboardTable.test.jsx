// tests/components/DashboardTable.test.jsx
// Tableau générique du dashboard : affichage, rendu personnalisé, actions, colonnes masquées sur téléphone.

import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DashboardTable from '../../src/components/admin/DashboardTable'

const COLUMNS = [
  { key: 'title', label: 'Titre' },
  { key: 'theme', label: 'Thème', hideOnMobile: true },
  { key: 'is_active', label: 'Statut', render: (row) => (row.is_active ? 'Actif' : 'Inactif') },
]
const DATA = [
  { id: 1, title: 'Article A', theme: 'Événement', is_active: true },
  { id: 2, title: 'Article B', theme: 'Newsletter', is_active: false },
]

describe('DashboardTable', () => {
  it('liste vide → message explicite', () => {
    render(<DashboardTable columns={COLUMNS} data={[]} onEdit={vi.fn()} />)
    expect(screen.getByText('Aucune donnée à afficher pour le moment.')).toBeInTheDocument()
  })

  it('affiche une ligne par élément, avec le rendu personnalisé des colonnes', () => {
    render(<DashboardTable columns={COLUMNS} data={DATA} onEdit={vi.fn()} />)
    expect(screen.getAllByRole('row')).toHaveLength(3) // en-tête + 2 lignes
    expect(screen.getByText('Actif')).toBeInTheDocument()
    expect(screen.getByText('Inactif')).toBeInTheDocument()
  })

  it('hideOnMobile : la colonne est masquée sous 768 px (en-tête ET cellules)', () => {
    render(<DashboardTable columns={COLUMNS} data={DATA} onEdit={vi.fn()} />)
    expect(screen.getByRole('columnheader', { name: 'Thème' }).className).toContain('hidden md:table-cell')
    expect(screen.getByText('Événement').className).toContain('hidden md:table-cell')
    expect(screen.getByRole('columnheader', { name: 'Titre' }).className).not.toContain('hidden')
  })

  it('les boutons transmettent la ligne complète aux callbacks', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const onHardDelete = vi.fn()
    render(<DashboardTable columns={COLUMNS} data={DATA} onEdit={onEdit} onDelete={onDelete} onHardDelete={onHardDelete} />)
    const firstRow = screen.getAllByRole('row')[1]

    fireEvent.click(within(firstRow).getByRole('button', { name: 'Modifier 1' }))
    fireEvent.click(within(firstRow).getByRole('button', { name: 'Mettre en pause 1' }))
    fireEvent.click(within(firstRow).getByRole('button', { name: 'Supprimer définitivement 1' }))

    expect(onEdit).toHaveBeenCalledWith(DATA[0])
    expect(onDelete).toHaveBeenCalledWith(DATA[0])
    expect(onHardDelete).toHaveBeenCalledWith(DATA[0])
  })

  it('élément en pause → bouton « Reprendre » au lieu de « Mettre en pause »', () => {
    render(<DashboardTable columns={COLUMNS} data={DATA} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Reprendre 2' })).toBeInTheDocument()
  })

  it('sans onDelete / onHardDelete : seul le bouton Modifier est proposé', () => {
    render(<DashboardTable columns={COLUMNS} data={[DATA[0]]} onEdit={vi.fn()} />)
    expect(within(screen.getAllByRole('row')[1]).getAllByRole('button')).toHaveLength(1)
  })
})
