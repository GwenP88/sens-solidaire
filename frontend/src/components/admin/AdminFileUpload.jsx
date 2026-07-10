// AdminFileUpload.jsx
// Composant réutilisable — upload de fichiers pour le dashboard admin
// Chaque fichier est uploadé immédiatement à la sélection (feedback rapide)
// Props :
//   value      : tableau [{ file_url, label }] — état actuel (contrôlé par le parent)
//   onChange   : (nouveauTableau) => void — appelé à chaque ajout/suppression/réorganisation
//   accept     : types de fichiers acceptés (ex: "image/*" ou "application/pdf")
//   maxFiles   : nombre maximum de fichiers (défaut : 10)
//   showLabel  : true = affiche un champ légende/alt sous chaque fichier (défaut : true)
//   helperText : texte d'aide affiché sous la zone d'upload

import { useState } from 'react'
import { uploadAdminFile } from '../../services/api'

function AdminFileUpload({ value = [], onChange, accept = 'image/*', maxFiles = 10, showLabel = true, helperText }) {

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
      // de saturer le serveur si la cliente sélectionne 10 photos d'un coup
      const newItems = []
      for (const file of filesToUpload) {
        const result = await uploadAdminFile(file)
        newItems.push({ file_url: result.url, label: '' })
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
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-3 border border-gray-200 rounded-lg p-2">

          {/* Aperçu — miniature pour une image, icône pour un PDF */}
          {isImage ? (
            <img src={item.file_url} alt="" className="w-14 h-10 object-cover rounded shrink-0" />
          ) : (
            <span className="w-14 h-10 flex items-center justify-center bg-gray-100 rounded shrink-0 text-xs text-gray-400">PDF</span>
          )}

          {/* Champ légende/alt — optionnel selon showLabel */}
          {showLabel && (
            <input
              type="text"
              value={item.label || ''}
              onChange={e => handleLabelChange(i, e.target.value)}
              placeholder={isImage ? "Légende / texte alternatif" : "Nom du document"}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}

          {/* Réordonnancement — utile surtout pour la galerie (1ère image = hero) */}
          {maxFiles > 1 && (
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
      ))}

      {/* ── Zone de sélection ── */}
      {value.length < maxFiles && (
        <label className="text-sm text-primary hover:text-primary/70 border border-dashed border-primary/30 rounded-lg px-4 py-2 transition-colors cursor-pointer text-center">
          {uploading ? 'Envoi en cours...' : `+ Ajouter ${maxFiles > 1 ? 'un fichier' : 'un fichier'}`}
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