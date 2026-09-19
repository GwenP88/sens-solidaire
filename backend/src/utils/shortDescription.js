// ── SHORT DESCRIPTION AUTO ──────────────────────────────────────────────────
// Dérive une description courte à partir d'un texte long, avec un marqueur de
// coupure optionnel ("---") que l'auteur peut insérer pour contrôler où le
// résumé s'arrête. Sans marqueur : repli sur la dernière phrase complète
// avant la limite de caractères — jamais de phrase coupée au milieu.
// Le marqueur est toujours retiré du texte complet, qu'il serve ou non au
// résumé — il ne doit jamais apparaître tel quel sur la page publique.

const CUT_MARKER = '---'

export const deriveShortDescription = (fullText, maxLength = 150) => {
  if (!fullText) return { shortDescription: '', cleanedFullText: fullText }

  const markerIndex = fullText.indexOf(CUT_MARKER)
  const hasMarker = markerIndex !== -1

  const excerpt = hasMarker ? fullText.slice(0, markerIndex).trim() : fullText

  const cleanedFullText = hasMarker
    ? (fullText.slice(0, markerIndex) + fullText.slice(markerIndex + CUT_MARKER.length)).trim()
    : fullText

  if (excerpt.length <= maxLength) {
    return { shortDescription: excerpt, cleanedFullText }
  }

  // Trop long → repli sur la dernière phrase complète avant la limite
  const truncated = excerpt.slice(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? ')
  )

  if (lastSentenceEnd > 0) {
    return { shortDescription: truncated.slice(0, lastSentenceEnd + 1).trim(), cleanedFullText }
  }

  // Aucune phrase complète trouvée → coupe au dernier espace, jamais en plein mot
  const lastSpace = truncated.lastIndexOf(' ')
  const safeTruncated = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated
  return { shortDescription: `${safeTruncated.trim()}…`, cleanedFullText }
}