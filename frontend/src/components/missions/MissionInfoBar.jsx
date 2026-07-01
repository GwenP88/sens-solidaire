// MissionInfoBar.jsx
// Barre d'informations clés d'une section mission — icônes + labels + séparateurs

// ── React
import React from 'react'

function MissionInfoBar({ items }) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-around gap-sm padding-x py-4">
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <span className="text-caption text-primary/60 flex flex-col items-center gap-xs text-center">
            <item.icon className="text-primary text-xl" />
            <span>{item.label}</span>
          </span>
          {i < items.length - 1 && (
            <div className="hidden sm:block w-[2px] h-12 bg-surface-dark" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default MissionInfoBar