import { useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import type { Viaje, Categoria } from '../types'
import { CATEGORIAS, SUBCATEGORIAS } from '../types'

interface Props {
  unidades: Viaje[]
  conductor: string | null
  onBack: () => void
  onSelect: (c: Categoria) => void
  onDirectSelect: (c: Categoria, sub: string) => void
}

const ALL_SUBS = Object.entries(SUBCATEGORIAS).flatMap(([cat, subs]) =>
  subs.map(sub => ({ categoria: cat as Categoria, subcategoria: sub }))
)

function shortProveedor(p: string | null): string {
  if (!p) return '—'
  if (p.includes('HAR')) return 'HAR'
  if (p.includes('TIMOL')) return 'TIMOL'
  if (p.includes('M &') || p.includes('M&')) return 'M&E'
  return p.split(' ')[0]
}

export default function Step3Categoria({ unidades, conductor, onBack, onSelect, onDirectSelect }: Props) {
  const [query, setQuery] = useState('')
  const showSearch = query.length >= 2

  const results = showSearch
    ? ALL_SUBS.filter(({ subcategoria, categoria }) =>
        subcategoria.toLowerCase().includes(query.toLowerCase()) ||
        categoria.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="px-4 pt-4 space-y-4 animate-fade-up">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition tap-active">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1E3252' }} />
        </button>
        <span className="text-sm text-gray-500">
          {unidades.length === 1 ? 'Unidad' : `${unidades.length} unidades`} seleccionada{unidades.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Unidades card */}
      <div className="rounded-2xl p-3 shadow-sm space-y-1.5" style={{ background: '#1E3252' }}>
        {unidades.map(v => (
          <div key={v.trip_id} className="flex items-center gap-2">
            <span className="font-mono-brand text-xs font-bold" style={{ color: '#FF6C02' }}>
              {v.patente_camion ?? v.trip_id}
            </span>
            <span className="text-white/40 text-xs">{shortProveedor(v.proveedor)}</span>
          </div>
        ))}
        {conductor && (
          <p className="text-white/60 text-xs pt-1 border-t border-white/10">{conductor}</p>
        )}
      </div>

      {/* Keyword search */}
      <div className="relative">
        <div
          className="flex items-center gap-3 bg-white rounded-2xl border-2 px-4 py-3 shadow-sm transition-all"
          style={{ borderColor: showSearch ? '#FF6C02' : '#E3E4E4' }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: showSearch ? '#FF6C02' : '#9CA3AF' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscá por palabra clave..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#1E3252' }}
            autoComplete="off"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
          )}
        </div>

        {showSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10 max-h-72 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">Sin resultados para "{query}"</div>
            ) : (
              results.map((r, i) => {
                const cat = CATEGORIAS.find(c => c.id === r.categoria)!
                return (
                  <button key={i} onClick={() => onDirectSelect(r.categoria, r.subcategoria)}
                    className="w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-orange-50 transition tap-active">
                    <div className="text-sm font-medium" style={{ color: '#1E3252' }}>{r.subcategoria}</div>
                    <div className="text-xs mt-0.5 font-medium" style={{ color: cat.color }}>{cat.emoji} {r.categoria}</div>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Categorías */}
      {!showSearch && (
        <>
          <div>
            <h2 className="font-mono-brand text-lg font-bold" style={{ color: '#1E3252' }}>¿Qué tipo de incidencia?</h2>
            <p className="text-sm text-gray-500 mt-1">Buscá por palabra clave o elegí una categoría</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pb-4">
            {CATEGORIAS.map(cat => (
              <button key={cat.id} onClick={() => onSelect(cat.id)}
                className="tap-active rounded-2xl p-4 text-left shadow-sm border border-transparent active:scale-95 transition-all"
                style={{ background: cat.bg, borderColor: cat.color + '30' }}>
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="text-sm font-semibold leading-tight block" style={{ color: cat.color }}>{cat.id}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
