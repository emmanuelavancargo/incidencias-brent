import { Truck, Building2, Globe } from 'lucide-react'

export type TipoIncidencia = 'unidad' | 'transporte' | 'operacion'

interface Opcion {
  tipo: TipoIncidencia
  icon: React.ReactNode
  label: string
  desc: string
  color: string
  bg: string
}

const OPCIONES: Opcion[] = [
  {
    tipo: 'unidad',
    icon: <Truck className="w-7 h-7" />,
    label: 'Unidad específica',
    desc: 'La incidencia recae sobre una patente o chofer particular',
    color: '#FF6C02',
    bg: '#FFF4EE',
  },
  {
    tipo: 'transporte',
    icon: <Building2 className="w-7 h-7" />,
    label: 'Transporte',
    desc: 'La incidencia recae sobre HAR, TIMOL o M&E en general',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    tipo: 'operacion',
    icon: <Globe className="w-7 h-7" />,
    label: 'Operación general',
    desc: 'Afecta a toda la operación (clima, ruta, PAD, planta...)',
    color: '#10B981',
    bg: '#D1FAE5',
  },
]

interface Props {
  onSelect: (tipo: TipoIncidencia) => void
}

export default function StepTipo({ onSelect }: Props) {
  return (
    <div className="px-4 pt-5 pb-32 space-y-4 animate-fade-up">
      <div>
        <h2 className="font-mono-brand text-xl font-bold" style={{ color: '#1E3252' }}>
          ¿Qué tipo de incidencia?
        </h2>
        <p className="text-sm text-gray-500 mt-1">Elegí el nivel al que aplica</p>
      </div>

      <div className="space-y-3">
        {OPCIONES.map(op => (
          <button
            key={op.tipo}
            onClick={() => onSelect(op.tipo)}
            className="w-full text-left p-4 rounded-2xl border-2 border-transparent shadow-sm active:scale-98 transition-all tap-active flex items-center gap-4"
            style={{ background: op.bg }}
          >
            <div className="flex-shrink-0 p-2 rounded-xl" style={{ background: op.color + '20', color: op.color }}>
              {op.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: op.color }}>{op.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{op.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
