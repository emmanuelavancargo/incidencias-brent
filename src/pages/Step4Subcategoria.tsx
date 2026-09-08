import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { Viaje, Categoria } from '../types'
import { SUBCATEGORIAS, CATEGORIAS } from '../types'

interface Props {
  unidades: Viaje[]
  categoria: Categoria
  preSelectedSub?: string
  onBack: () => void
  onConfirm: (subcategoria: string, descripcionOtro: string | null) => void
  saving: boolean
}

export default function Step4Subcategoria({ unidades, categoria, preSelectedSub, onBack, onConfirm, saving }: Props) {
  const [selected, setSelected] = useState<string | null>(preSelectedSub ?? null)
  const [otroText, setOtroText] = useState('')

  const catConfig = CATEGORIAS.find(c => c.id === categoria)!
  const subs = SUBCATEGORIAS[categoria]

  const handleSelect = (sub: string) => {
    setSelected(sub)
    if (sub !== 'Otro') onConfirm(sub, null)
  }

  return (
    <div className="px-4 pt-4 pb-32 space-y-4 animate-fade-up">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition tap-active">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1E3252' }} />
        </button>
        <div className="flex-1 min-w-0">
          <span className="font-mono-brand text-xs font-bold block" style={{ color: catConfig.color }}>
            {catConfig.emoji} {categoria}
          </span>
          <span className="text-xs text-gray-400 truncate block">
            {unidades.map(v => v.patente_camion ?? v.trip_id).join(' · ')}
          </span>
        </div>
      </div>

      <div>
        <h2 className="font-mono-brand text-lg font-bold" style={{ color: '#1E3252' }}>¿Cuál fue la incidencia?</h2>
        <p className="text-sm text-gray-500 mt-1">Seleccioná la más específica</p>
      </div>

      <div className="space-y-2">
        {subs.map(sub => {
          const isOtro   = sub === 'Otro'
          const isActive = selected === sub
          return (
            <button key={sub} onClick={() => handleSelect(sub)}
              className="w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all tap-active font-medium text-sm"
              style={{
                borderColor: isActive ? catConfig.color : '#E3E4E4',
                background:  isActive ? catConfig.bg    : '#fff',
                color:       isActive ? catConfig.color : '#1E3252',
              }}>
              {isOtro ? '✏️ Otro...' : sub}
            </button>
          )
        })}
      </div>

      {selected && selected !== 'Otro' && (
        <div className="animate-fade-up">
          <button disabled={saving} onClick={() => onConfirm(selected, null)}
            className="w-full py-4 rounded-2xl font-bold text-white text-base transition tap-active disabled:opacity-40"
            style={{ background: '#FF6C02' }}>
            {saving ? 'Guardando…' : 'Registrar incidencia'}
          </button>
        </div>
      )}

      {selected === 'Otro' && (
        <div className="space-y-3 animate-fade-up">
          <textarea value={otroText} onChange={e => setOtroText(e.target.value.slice(0, 200))}
            placeholder="Describí brevemente la incidencia..."
            rows={4}
            className="w-full rounded-2xl border-2 px-4 py-3 text-sm resize-none outline-none transition"
            style={{ borderColor: '#2C9FC0', color: '#1E3252' }} />
          <p className="text-right text-xs text-gray-400">{otroText.length}/200</p>
          <button disabled={!otroText.trim() || saving} onClick={() => onConfirm('Otro', otroText.trim())}
            className="w-full py-4 rounded-2xl font-bold text-white text-base transition tap-active disabled:opacity-40"
            style={{ background: '#FF6C02' }}>
            {saving ? 'Guardando…' : 'Registrar incidencia'}
          </button>
        </div>
      )}
    </div>
  )
}
