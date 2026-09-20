// AdminFileUpload.jsx
// Composant réutilisable — upload de fichiers pour le dashboard admin
// Chaque fichier est uploadé immédiatement à la sélection (feedback rapide)
// Props :
//   value           : tableau [{ file_url, label, force_display?, original_name? }]
//                     — état actuel (contrôlé par le parent)
//   onChange        : (nouveauTableau) => void — appelé à chaque ajout/suppression/réorganisation
//   accept          : types de fichiers acceptés (ex: "image/*" ou "application/pdf")
//   maxFiles        : nombre maximum de fichiers (défaut : 10)
//   showLabel       : true = affiche un champ légende/alt sous chaque fichier (défaut : true)
//   helperText      : texte d'aide affiché sous la zone d'upload
//   imageType       : 'hero' | 'gallery' | 'card' | 'avatar' — tiers Sharp (voir storageService.js)
//   showForceDisplay: true = affiche une case "Toujours afficher" par fichier (défaut : false)
//   layout          : 'list' (défaut, une ligne par fichier) | 'grid' (grille 3 colonnes)
//   allowReorder    : true = affiche les flèches ▲▼ (défaut : true — désactivé pour la galerie,
//                     dont l'ordre d'affichage public est automatique, pas manuel)

import { useState } from 'react'
import { uploadAdminFile } from '../../services/api'

function AdminFileUpload({
  value = [],
  onChange,
  accept = 'image/*',
  maxFiles = 10,
  showLabel = true,
  helperText,
  imageType,
  showForceDisplay = false,
  layout = 'list',
  allowReorder = true,
}) {

  // Suivi des uploads en cours — évite de bloquer toute l'UI pendant l'envoi
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // ── Sélection de nouveaux fichiers ──
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Respecte la limite maxFiles (compte les fichiers déjà présents)
    const remainingSlots = maxFiles - value.length
    const filesToUpload = files.slice(0, remainingSlots)

    setUploading(true)
    setError(null)

    try {
      // Upload séquentiel — plus simple à débugger qu'en parallèle, et évite
      // de saturer le serveur si la cliente sélectionne plusieurs photos d'un coup
      const newItems = []
      for (const file of filesToUpload) {
        const result = await uploadAdminFile(file, '', imageType)
        newItems.push({ file_url: result.url, label: '', original_name: file.name })
      }
      onChange([...value, ...newItems])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = '' // permet de resélectionner le même fichier si besoin
    }
  }

  // ── Suppression d'un fichier ──
  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  // ── Modification de la légende d'un fichier ──
  const handleLabelChange = (index, newLabel) => {
    const updated = [...value]
    updated[index] = { ...updated[index], label: newLabel }
    onChange(updated)
  }

  // ── Bascule "forcer l'affichage" d'un fichier (galerie uniquement) ──
  const handleForceDisplayChange = (index) => {
    const updated = [...value]
    updated[index] = { ...updated[index], force_display: !updated[index].force_display }
    onChange(updated)
  }

  // ── Réordonnancement — déplace un fichier vers le haut ou le bas ──
  const handleMove = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= value.length) return
    const updated = [...value]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    onChange(updated)
  }

  const isImage = accept.startsWith('image')

  return (
    <div className="flex flex-col gap-3">

      {/* ── Liste des fichiers déjà uploadés ── */}
      <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
        {value.map((item, i) => (
          <div
            key={i}
            className={
              layout === 'grid'
                ? 'flex flex-col gap-2 border border-gray-200 rounded-lg p-3'
                : 'flex items-center gap-3 border border-gray-200 rounded-lg p-2'
            }
          >
            {/* Aperçu — miniature pour une image, icône pour un PDF */}
            {isImage ? (
              <img
                src={item.file_url}
                alt=""
                className={layout === 'grid' ? 'w-full h-32 object-cover rounded' : 'w-14 h-10 object-cover rounded shrink-0'}
              />
            ) : (
              <span
                className={
                  layout === 'grid'
                    ? 'w-full h-32 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-400'
                    : 'w-14 h-10 flex items-center justify-center bg-gray-100 rounded shrink-0 text-xs text-gray-400'
                }
              >
                PDF
              </span>
            )}

            {/* Champ légende/alt — optionnel selon showLabel, textarea en grille pour plus de place */}
            {showLabel ? (
              layout === 'grid' ? (
                <textarea
                  value={item.label || ''}
                  onChange={e => handleLabelChange(i, e.target.value)}
                  placeholder="Légende / texte alternatif"
                  rows={2}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              ) : (
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={e => handleLabelChange(i, e.target.value)}
                  placeholder={isImage ? "Légende / texte alternatif" : "Nom du document"}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              )
            ) : (
              <span className="flex-1 text-sm text-gray-600 truncate">
                {item.original_name || 'Fichier déjà importé'}
              </span>
            )}

            {/* Case "forcer l'affichage" + réordonnancement + suppression —
                regroupés dans un conteneur qui s'adapte à la mise en page :
                'contents' en mode liste (n'affecte pas l'alignement existant),
                flex justify-between en mode grille (case à gauche, croix à droite) */}
            <div className={layout === 'grid' ? 'flex items-center justify-between' : 'contents'}>

              {showForceDisplay && (
                <label className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.force_display || false}
                    onChange={() => handleForceDisplayChange(i)}
                    className="w-4 h-4 accent-primary"
                  />
                  Toujours afficher
                </label>
              )}

              {allowReorder && maxFiles > 1 && (
                <div className="flex flex-col shrink-0">
                  <button type="button" onClick={() => handleMove(i, -1)} disabled={i === 0}
                    className="text-gray-300 hover:text-primary disabled:opacity-20 text-xs leading-none">▲</button>
                  <button type="button" onClick={() => handleMove(i, 1)} disabled={i === value.length - 1}
                    className="text-gray-300 hover:text-primary disabled:opacity-20 text-xs leading-none">▼</button>
                </div>
              )}

              <button type="button" onClick={() => handleRemove(i)}
                className="text-gray-300 hover:text-red-500 text-xl shrink-0 transition-colors">×</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Zone de sélection ── */}
      {value.length < maxFiles && (
        <label className="text-sm text-primary hover:text-primary/70 border border-dashed border-primary/30 rounded-lg px-4 py-2 transition-colors cursor-pointer text-center">
          {uploading ? 'Envoi en cours...' : '+ Ajouter un fichier'}
          <input
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {helperText && <span className="text-xs text-gray-400">{helperText}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}

    </div>
  )
}

export default AdminFileUpload