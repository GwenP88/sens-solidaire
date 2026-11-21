// hooks/useRefreshOnFocus.js
// Renvoie un compteur qui augmente quand l'utilisateur revient sur l'onglet.
// À ajouter aux dépendances des useEffect de chargement des pages publiques :
// les données sont rechargées en silence (pas de « Chargement... », pas de saut
// de scroll), ce qui affiche les modifications faites entre-temps dans le dashboard.
// Garde-fou perf : on ne recharge que si l'onglet est resté caché au moins MIN_HIDDEN_MS.
import { useState, useEffect } from 'react'

const MIN_HIDDEN_MS = 5000

export default function useRefreshOnFocus() {
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let hiddenAt = null

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now()
      } else if (hiddenAt && Date.now() - hiddenAt >= MIN_HIDDEN_MS) {
        hiddenAt = null
        setRefreshKey(k => k + 1)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return refreshKey
}
