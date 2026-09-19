// Aperçu de la description courte — pour l'affichage en direct dans le
// formulaire uniquement. La version qui fait foi est côté backend
// (backend/src/utils/shortDescription.js), calculée à l'enregistrement.

const CUT_MARKER = '---'

export const previewShortDescription = (fullText, maxLength = 150) => {
  if (!fullText) return ''

  const markerIndex = fullText.indexOf(CUT_MARKER)
  const excerpt = markerIndex !== -1 ? fullText.slice(0, markerIndex).trim() : fullText

  if (excerpt.length <= maxLength) return excerpt

  const truncated = excerpt.slice(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? ')
  )
  if (lastSentenceEnd > 0) return truncated.slice(0, lastSentenceEnd + 1).trim()

  const lastSpace = truncated.lastIndexOf(' ')
  const safeTruncated = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated
  return `${safeTruncated.trim()}…`
}