export interface Viaje {
  trip_id: string
  estado: string | null
  proveedor: string | null
  chofer: string | null
  segundo_chofer: string | null
  patente_camion: string | null
  patente_trailer: string | null
}

export type Categoria = 'Previo' | 'Carga' | 'Tránsito' | 'Descarga' | 'Retorno' | 'Transversal'

export interface CatConfig {
  id: Categoria
  emoji: string
  color: string
  bg: string
}

export const CATEGORIAS: CatConfig[] = [
  { id: 'Previo',       emoji: '📋', color: '#6366F1', bg: '#EEF2FF' },
  { id: 'Carga',        emoji: '🏗️', color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'Tránsito',     emoji: '🚛', color: '#FF6C02', bg: '#FFF4EE' },
  { id: 'Descarga',     emoji: '📦', color: '#10B981', bg: '#D1FAE5' },
  { id: 'Retorno',      emoji: '🔄', color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'Transversal',  emoji: '⚡', color: '#EF4444', bg: '#FEE2E2' },
]

export const SUBCATEGORIAS: Record<Categoria, string[]> = {
  'Previo': [
    'Backup sin alta previa',
    'Cambio de unidad sin aviso',
    'Unidad sin GPS',
    'Parte diario no enviado',
    'Faltante de unidades en el parte',
    'Otro',
  ],
  'Carga': [
    'Demora en planta',
    'Convoy de arribos al cargadero',
    'Sandbox en mal estado',
    'Otro',
  ],
  'Tránsito': [
    'Avería mecánica',
    'Unidad atascada o enterrada',
    'Neumático pinchado',
    'Pérdida de señal GPS',
    'Detención en lugar no habilitado',
    'Desvío de ruta',
    'Tránsito en convoy',
    'Velocidad muy baja',
    'Exceso de velocidad',
    'Corte de ruta o manifestación',
    'Condiciones climáticas adversas',
    'Camino de acceso intransitable',
    'Accidente vial',
    'Otro',
  ],
  'Descarga': [
    'Falta de cajas vacías',
    'Cola de espera en el PAD',
    'PAD no habilitado para recibir',
    'Otro',
  ],
  'Retorno': [
    'Unidad no regresa al cargadero',
    'Otro',
  ],
  'Transversal': [
    'Cambio de turno fuera del diagrama',
    'Demora en carga de gasoil',
    'Unidad fuera de servicio',
    'Interrupción de señal satelital',
    'Otro',
  ],
}
