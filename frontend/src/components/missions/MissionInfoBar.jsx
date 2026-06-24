// MissionInfoBar.jsx
// Barre d'informations clés d'une section mission — icônes + labels + séparateurs

function MissionInfoBar({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-around gap-4 px-2 md:px-6 py-4">
      {items.map((item, i) => (
        <>
          <span key={item.label} className="text-caption text-primary/60 flex flex-col items-center gap-1">
            <item.icon className="text-primary text-xl" />
            <span>{item.label}</span>
          </span>
          {i < items.length - 1 && (
            <div key={`sep-${i}`} className="hidden sm:block w-[2px] h-12 bg-surface-dark" />
          )}
        </>
      ))}
    </div>
  )
}

export default MissionInfoBar