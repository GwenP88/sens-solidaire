// TexteMisEnForme.jsx
// Affiche un texte saisi dans le dashboard avec sa mise en page (paragraphes, retours à la ligne, puces) — sections Éducation (tâche 172A).
// Règles de découpage : utils/texteMisEnForme.js

import { Fragment } from 'react'
import { parseTexteMisEnForme } from '../../utils/texteMisEnForme'

// className : classes du texte (ex. « text-body text-primary/90 » sur le site)
function TexteMisEnForme({ texte, className = 'text-body text-primary/90' }) {
  const blocks = parseTexteMisEnForme(texte)
  if (blocks.length === 0) return null

  return (
    <div className="flex flex-col gap-sm">
      {blocks.map((block, i) => (
        block.type === 'list' ? (
          <ul key={i} className="flex flex-col gap-0 list-none">
            {block.items.map((item, j) => (
              <li key={j} className={`flex items-start gap-xs ${className}`}>
                <span className="text-accent-2 shrink-0" aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className={className}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        )
      ))}
    </div>
  )
}

export default TexteMisEnForme
