// MissionInfoBar.jsx
// Barre d'informations clés d'une section mission — icônes + labels + séparateurs

function MissionInfoBar({ items }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      {items.map((item, i) => (
        <>
          <span key={item.label} className="font-body text-sm text-primary/60 flex flex-col items-center gap-1">
            <item.icon className="text-primary text-xl" />
            <span>{item.label}</span>
          </span>
          {i < items.length - 1 && (
            <div key={`sep-${i}`} className="w-[2px] h-12 bg-surface-dark" />
          )}
        </>
      ))}
    </div>
  )
}

export default MissionInfoBar