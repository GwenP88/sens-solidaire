// useCountUp.js
// Hook custom — anime un chiffre de 0 vers une valeur cible
// Déclenché une seule fois quand l'élément entre dans le viewport (IntersectionObserver)
// Props :
//   target   : valeur finale (number)
//   duration : durée de l'animation en ms (défaut : 2000)
//   ref      : ref React vers l'élément à observer

import { useState, useEffect } from 'react'

function useCountUp(target, duration = 2000, ref) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  // ── Démarre l'animation quand l'élément entre dans le viewport
  useEffect(() => {
    if (!ref?.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, started])

  // ── Animation ease-out — rapide au début, ralentit à la fin
  useEffect(() => {
    if (!started) return

    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ── Ease-out quadratique (plus doux, progression plus régulière)
      const eased = 1 - Math.pow(1 - progress, 2)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [started, target, duration])

  return count
}

export default useCountUp