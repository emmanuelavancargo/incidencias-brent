interface Props { step: 1 | 2 | 3 | 4 }

const LABELS = ['Unidades', 'Conductor', 'Categoría', 'Subcategoría']

export default function ProgressBar({ step }: Props) {
  return (
    <div className="px-4 py-2" style={{ background: '#1E3252' }}>
      <div className="flex gap-1.5 mb-1.5">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: s <= step ? '#FF6C02' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Paso {step} de 4 — {LABELS[step - 1]}
      </p>
    </div>
  )
}
