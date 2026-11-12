// utils/texteMisEnForme.js
// Découpe un texte saisi dans le dashboard en blocs affichables (tâche 172A) : la cliente gère la mise en page avec ses touches.
//   - ligne vide            → nouveau paragraphe
//   - ligne qui commence par « - » (ou « • ») → puce
//   - simple retour à la ligne → retour à la ligne dans le paragraphe
// Aucun HTML n'est interprété : le texte reste du texte (pas de risque d'injection).

const BULLET = /^\s*[-•]\s+/

// Retourne [{ type: 'paragraph', lines: [...] } | { type: 'list', items: [...] }]
export const parseTexteMisEnForme = (text) => {
  const blocks = []

  String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)                       // une ou plusieurs lignes vides séparent les blocs
    .forEach(chunk => {
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      // Dans un même bloc, les lignes à puces et les lignes de texte peuvent alterner
      lines.forEach(line => {
        const isBullet = BULLET.test(line)
        const last = blocks[blocks.length - 1]
        const type = isBullet ? 'list' : 'paragraph'
        const value = isBullet ? line.replace(BULLET, '').trim() : line.trim()

        if (last && last.type === type && !last.closed) {
          last[type === 'list' ? 'items' : 'lines'].push(value)
        } else {
          blocks.push(type === 'list' ? { type, items: [value] } : { type, lines: [value] })
        }
      })
      // Fin du bloc (ligne vide) : le paragraphe ou la liste suivante repart de zéro
      if (blocks.length > 0) blocks[blocks.length - 1].closed = true
    })

  // Retire le marqueur interne « closed », inutile à l'affichage
  return blocks.map(block => {
    const { type, items, lines } = block
    return type === 'list' ? { type, items } : { type, lines }
  })
}
