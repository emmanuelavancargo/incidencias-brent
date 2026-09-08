import { CheckCircle, Plus, LogOut } from 'lucide-react'
import type { Viaje, Categoria } from '../types'
import { CATEGORIAS } from '../types'

interface Props {
  unidades: Viaje[]
  categoria: Categoria
  subcategoria: string
  onAddAnother: () => void
  onReset: () => void
}

function shortProveedor(p: string | null): string {
  if (!p) return '—'
  if (p.includes('HAR')) return 'HAR'
  if (p.includes('TIMOL')) return 'TIMOL'
  if (p.includes('M &') || p.includes('M&')) return 'M&E'
  return p.split(' ')[0]
}

export default function SuccessPage({ unidades, categoria, subcategoria, onAddAnother, onReset }: Props) {
  const cat = CATEGORIAS.find(c => c.id === categoria)!

  return (
    <div className="px-4 pt-10 pb-32 space-y-6 animate-fade-up">
      <div className="text-center space-y-3">
        <CheckCircle className="w-14 h-14 mx-auto" style={{ color: '#0DCB7B' }} />
        <h2 className="font-mono-brand text-xl font-bold" style={{ color: '#1E3252' }}>Incidencia registrada</h2>
      </div>

      {/* Resumen */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: '#1E3252' }}>
        <div>
          <p className="text-white/40 text-xs mb-1">{unidades.length === 1 ? 'Unidad' : 'Unidades'}</p>
          {unidades.map(v => (
            <div key={v.trip_id} className="flex items-center gap-2">
              <span className="font-mono-brand text-sm font-bold" style={{ color: '#FF6C02' }}>
                {v.patente_camion ?? v.trip_id}
              </span>
              <span className="text-white/40 text-xs">{shortProveedor(v.proveedor)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-white/40 text-xs mb-1">Incidencia</p>
          <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: cat.bg, color: cat.color }}>
            {cat.emoji} {categoria}
          </span>
          <p className="text-white text-sm font-medium mt-2">{subcategoria}</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3">
        <button onClick={onAddAnother}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition tap-active"
          style={{ background: '#FF6C02' }}>
          <Plus className="w-5 h-5" />
          Agregar otra incidencia
        </button>
        <button onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition tap-active border-2"
          style={{ borderColor: '#1E3252', color: '#1E3252', background: 'transparent' }}>
          <LogOut className="w-4 h-4" />
          Terminar
        </button>
      </div>
    </div>
  )
}
