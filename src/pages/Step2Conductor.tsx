import { ChevronLeft } from 'lucide-react'
import type { Viaje } from '../types'

interface Props {
  viaje: Viaje
  onBack: () => void
  onSelect: (chofer: string) => void
}

export default function Step2Conductor({ viaje, onBack, onSelect }: Props) {
  const opciones = [
    viaje.chofer   ? { label: viaje.chofer,        tag: 'Diurno'  } : null,
    viaje.segundo_chofer ? { label: viaje.segundo_chofer, tag: 'Nocturno' } : null,
  ].filter(Boolean) as { label: string; tag: string }[]

  return (
    <div className="px-4 pt-4 pb-32 space-y-4 animate-fade-up">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition tap-active">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1E3252' }} />
        </button>
        <span className="text-sm text-gray-500">Unidad seleccionada</span>
      </div>

      {/* Viaje card */}
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: '#1E3252' }}>
        <span className="font-mono-brand text-sm font-bold" style={{ color: '#FF6C02' }}>
          {viaje.patente_camion ?? viaje.trip_id}
        </span>
        <p className="text-white/60 text-xs mt-0.5">{viaje.proveedor ?? '—'} · #{viaje.trip_id}</p>
      </div>

      <div>
        <h2 className="font-mono-brand text-lg font-bold" style={{ color: '#1E3252' }}>
          ¿A quién le asignás la incidencia?
        </h2>
        <p className="text-sm text-gray-500 mt-1">Elegí el conductor involucrado</p>
      </div>

      <div className="space-y-2">
        {opciones.map(op => (
          <button
            key={op.label}
            onClick={() => onSelect(op.label)}
            className="w-full text-left px-4 py-4 rounded-2xl border-2 transition-all tap-active"
            style={{ borderColor: '#E3E4E4', background: '#fff' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1E3252' }}>{op.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{op.tag}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: op.tag === 'Diurno' ? '#FFF4EE' : '#EEF2FF',
                         color: op.tag === 'Diurno' ? '#FF6C02' : '#6366F1' }}>
                {op.tag}
              </span>
            </div>
          </button>
        ))}

        {opciones.length === 0 && (
          <p className="text-sm text-gray-400 px-1">Sin conductores registrados para esta unidad.</p>
        )}
      </div>
    </div>
  )
}
