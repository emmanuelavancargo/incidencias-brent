import { useState, useEffect, useRef } from 'react'
import { Search, X, Plus, ChevronRight, ChevronLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Viaje } from '../types'

function shortProveedor(p: string | null): string {
  if (!p) return '—'
  if (p.includes('HAR')) return 'HAR'
  if (p.includes('TIMOL')) return 'TIMOL'
  if (p.includes('M &') || p.includes('M&')) return 'M&E'
  return p.split(' ')[0]
}

function ViajeCard({ v, onAdd }: { v: Viaje; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-orange-50 transition tap-active flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono-brand text-xs font-bold" style={{ color: '#FF6C02' }}>{v.patente_camion ?? v.trip_id}</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#F7F8FA', color: '#1E3252' }}>{shortProveedor(v.proveedor)}</span>
        </div>
        <p className="text-sm font-medium truncate mt-0.5" style={{ color: '#1E3252' }}>
          {v.chofer ?? '—'}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {v.segundo_chofer ? `Noche: ${v.segundo_chofer}` : ''}{v.trip_id ? ` · #${v.trip_id}` : ''}
        </p>
      </div>
      <Plus className="w-4 h-4 flex-shrink-0" style={{ color: '#FF6C02' }} />
    </button>
  )
}

interface Props {
  selected: Viaje[]
  onAdd: (v: Viaje) => void
  onRemove: (tripId: string) => void
  onContinue: () => void
  onBack: () => void
}

export default function Step1Unidades({ selected, onAdd, onRemove, onContinue, onBack }: Props) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<Viaje[]>([])
  const [open, setOpen]       = useState(false)
  const timer                 = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (query.trim().length < 2) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      const q = query.trim()
      const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('viajes')
        .select('*')
        .gte('synced_at', cutoff)
        .or(
          `trip_id.ilike.%${q}%,patente_camion.ilike.%${q}%,patente_trailer.ilike.%${q}%,` +
          `chofer.ilike.%${q}%,segundo_chofer.ilike.%${q}%,proveedor.ilike.%${q}%,estado.ilike.%${q}%`
        )
        .limit(15)
      const filtered = (data ?? []).filter(v => !selected.some(s => s.trip_id === v.trip_id))
      setResults(filtered as Viaje[])
      setOpen(true)
    }, 280)
  }, [query, selected])

  const handleAdd = (v: Viaje) => {
    onAdd(v)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="px-4 pt-4 pb-32 space-y-4 animate-fade-up">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition tap-active">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1E3252' }} />
        </button>
        <span className="text-sm text-gray-500">Unidad específica</span>
      </div>
      <div>
        <h2 className="font-mono-brand text-xl font-bold" style={{ color: '#1E3252' }}>
          ¿Qué unidad/es?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Buscá por patente, chofer, proveedor o número de viaje
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <div
          className="flex items-center gap-3 bg-white rounded-2xl border-2 px-4 py-3 shadow-sm transition-all"
          style={{ borderColor: open ? '#FF6C02' : '#E3E4E4' }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: open ? '#FF6C02' : '#9CA3AF' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="AI228EI, Javier Aravena, TIMOL..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#1E3252' }}
            autoComplete="off"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
              className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
          )}
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10 max-h-72 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">Sin resultados para "{query}"</div>
            ) : (
              results.map(v => <ViajeCard key={v.trip_id} v={v} onAdd={() => handleAdd(v)} />)
            )}
          </div>
        )}
      </div>

      {/* Unidades seleccionadas */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {selected.length === 1 ? '1 unidad seleccionada' : `${selected.length} unidades seleccionadas`}
          </p>
          {selected.map(v => (
            <div key={v.trip_id}
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono-brand text-sm font-bold" style={{ color: '#FF6C02' }}>
                    {v.patente_camion ?? v.trip_id}
                  </span>
                  <span className="text-xs text-gray-400">{shortProveedor(v.proveedor)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{v.chofer ?? '—'}</p>
              </div>
              <button onClick={() => onRemove(v.trip_id)}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition tap-active">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón continuar */}
      {selected.length > 0 && (
        <div className="animate-fade-up">
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition tap-active"
            style={{ background: '#FF6C02' }}
          >
            Continuar
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
