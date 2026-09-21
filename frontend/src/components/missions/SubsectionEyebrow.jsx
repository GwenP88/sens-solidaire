// SubsectionEyebrow.jsx
// Petit repère visuel au-dessus de chaque sous-section (Destinations,
// Témoignages, Impact terrain, Galerie...) — label centré, ligne discrète
// en dessous pour bien détacher la sous-section.

function SubsectionEyebrow({ label }) {
  return (
    <div className="flex flex-col items-center mb-2">
      <span className="text-md font-bold uppercase tracking-wider text-accent">{label}</span>
      <hr className="w-3/4 mx-auto border-t border-accent/40 mt-3 mb-6" />
    </div>
  )
}

export default SubsectionEyebrow