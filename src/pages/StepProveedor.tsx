import { ChevronLeft } from 'lucide-react'

const PROVEEDORES = [
  { id: 'SUDAMERICA HAR CARGO INTERNACIONAL S. A.', label: 'HAR', color: '#FF6C02', bg: '#FFF4EE' },
  { id: 'TIMOL SRL',                               label: 'TIMOL', color: '#6366F1', bg: '#EEF2FF' },
  { id: 'M & E SA',                                label: 'M&E', color: '#0EA5E9', bg: '#E0F2FE' },
]

interface Props {
  onBack: () => void
  onSelect: (proveedor: string) => void
}

export default function StepProveedor({ onBack, onSelect }: Props) {
  return (
    <div className="px-4 pt-4 pb-32 space-y-4 animate-fade-up">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition tap-active">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1E3252' }} />
        </button>
        <span className="text-sm text-gray-500">Incidencia de transporte</span>
      </div>

      <div>
        <h2 className="font-mono-brand text-lg font-bold" style={{ color: '#1E3252' }}>
          ¿Qué transporte?
        </h2>
        <p className="text-sm text-gray-500 mt-1">Elegí el proveedor involucrado</p>
      </div>

      <div className="space-y-3">
        {PROVEEDORES.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full text-left px-5 py-5 rounded-2xl border-2 border-transparent shadow-sm active:scale-98 transition-all tap-active"
            style={{ background: p.bg }}
          >
            <p className="font-bold text-xl" style={{ color: p.color }}>{p.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{p.id}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
