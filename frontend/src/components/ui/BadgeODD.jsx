// BadgeODD.jsx
// Composant réutilisable — 17 variants avec chiffre et couleur différentes

function Badge({number = 1}) {

  const colors = {
    1: '#E5243B',
    2: '#DDA63A',
    3: '#4C9F38',
    4: '#C5192D',
    5: '#FF3A21',
    6: '#26BDE2',
    7: '#FCC30B',
    8: '#A21942',
    9: '#FD6925',
    10: '#DD1367',
    11: '#FD9D24',
    12: '#BF8B2E',
    13: '#3F7E44',
    14: '#0A97D9',
    15: '#56C02B',
    16: '#00689D',
    17: '#19486A',
  }

  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center text-surface font-body font-bold text-sm`} style={{ backgroundColor: colors[number] }}>
      {number}
    </div>
  )
}

export default Badge