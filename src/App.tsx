import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import type { Viaje, Categoria } from './types'
import type { TipoIncidencia } from './pages/StepTipo'

import LoginPage         from './pages/LoginPage'
import StepTipo          from './pages/StepTipo'
import Step1Unidades     from './pages/Step1Unidades'
import StepProveedor     from './pages/StepProveedor'
import Step2Conductor    from './pages/Step2Conductor'
import Step3Categoria    from './pages/Step3Categoria'
import Step4Subcategoria from './pages/Step4Subcategoria'
import SuccessPage       from './pages/SuccessPage'
import Header            from './components/Header'
import ProgressBar       from './components/ProgressBar'

type AppStep = 'tipo' | 'unidades' | 'proveedor' | 'conductor' | 'categoria' | 'subcategoria' | 'success'

interface FlowState {
  tipo:          TipoIncidencia | null
  unidades:      Viaje[]
  conductor:     string | null
  proveedor:     string | null
  categoria?:    Categoria
  subcategoria?: string
}

const INITIAL: FlowState = { tipo: null, unidades: [], conductor: null, proveedor: null }

function progressStep(step: AppStep): 1 | 2 | 3 | 4 {
  if (step === 'tipo')                    return 1
  if (step === 'unidades' || step === 'proveedor') return 2
  if (step === 'conductor')               return 2
  if (step === 'categoria')               return 3
  return 4
}

function progressLabel(step: AppStep, _tipo: TipoIncidencia | null): string {
  if (step === 'tipo')       return 'Tipo de incidencia'
  if (step === 'unidades')   return 'Unidades'
  if (step === 'proveedor')  return 'Transporte'
  if (step === 'conductor')  return 'Conductor'
  if (step === 'categoria')  return 'Categoría'
  if (step === 'subcategoria') return 'Subcategoría'
  return ''
}

export default function App() {
  const { email, loading, error, login, logout } = useAuth()
  const [step, setStep]   = useState<AppStep>('tipo')
  const [state, setState] = useState<FlowState>(INITIAL)
  const [saving, setSaving] = useState(false)

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center" style={{ background: '#1E3252' }}>
      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (!email) return <LoginPage onLogin={login} error={error} />

  // ── success ──────────────────────────────────────────────────────
  if (step === 'success' && state.categoria && state.subcategoria) return (
    <SuccessPage
      unidades={state.unidades}
      categoria={state.categoria}
      subcategoria={state.subcategoria}
      onAddAnother={() => {
        setState(s => ({ ...INITIAL, tipo: s.tipo, unidades: s.unidades, proveedor: s.proveedor }))
        setStep('categoria')
      }}
      onReset={() => { setState(INITIAL); setStep('tipo') }}
    />
  )

  // ── confirm ───────────────────────────────────────────────────────
  const handleConfirm = async (subcategoria: string, descripcionOtro: string | null) => {
    if (!state.categoria || !email) return
    setSaving(true)
    try {
      await supabase.from('incidencias').insert({
        user_email:       email,
        tipo_incidencia:  state.tipo,
        trip_ids:         state.unidades.length > 0 ? state.unidades.map(v => v.trip_id) : [],
        patentes:         state.unidades.map(v => v.patente_camion).filter(Boolean),
        chofer_asignado:  state.conductor,
        proveedor:        state.proveedor ?? (state.unidades[0]?.proveedor ?? null),
        categoria:        state.categoria,
        subcategoria,
        descripcion_otro: descripcionOtro,
      })
      setState(s => ({ ...s, subcategoria }))
      setStep('success')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const numStep  = step === 'success' ? 4 : progressStep(step)
  const numLabel = progressLabel(step, state.tipo)

  return (
    <div className="min-h-svh flex flex-col" style={{ maxWidth: 480, margin: '0 auto', background: '#F7F8FA' }}>
      <Header user={{ email }} onLogout={logout} />
      <ProgressBar step={numStep} label={numLabel} />

      <div className="flex-1 overflow-y-auto">

        {step === 'tipo' && (
          <StepTipo onSelect={tipo => {
            setState(s => ({ ...s, tipo }))
            if (tipo === 'unidad')     setStep('unidades')
            if (tipo === 'transporte') setStep('proveedor')
            if (tipo === 'operacion')  setStep('categoria')
          }} />
        )}

        {step === 'unidades' && (
          <Step1Unidades
            selected={state.unidades}
            onAdd={v => setState(s => ({ ...s, unidades: [...s.unidades, v] }))}
            onRemove={id => setState(s => ({ ...s, unidades: s.unidades.filter(u => u.trip_id !== id) }))}
            onContinue={() => {
              if (state.unidades.length === 1) setStep('conductor')
              else setStep('categoria')
            }}
            onBack={() => setStep('tipo')}
          />
        )}

        {step === 'proveedor' && (
          <StepProveedor
            onBack={() => setStep('tipo')}
            onSelect={p => { setState(s => ({ ...s, proveedor: p })); setStep('categoria') }}
          />
        )}

        {step === 'conductor' && state.unidades.length === 1 && (
          <Step2Conductor
            viaje={state.unidades[0]}
            onBack={() => setStep('unidades')}
            onSelect={c => { setState(s => ({ ...s, conductor: c })); setStep('categoria') }}
          />
        )}

        {step === 'categoria' && (
          <Step3Categoria
            unidades={state.unidades}
            conductor={state.conductor}
            proveedor={state.proveedor}
            tipo={state.tipo}
            onBack={() => {
              if (state.tipo === 'unidad')     setStep(state.unidades.length === 1 ? 'conductor' : 'unidades')
              if (state.tipo === 'transporte') setStep('proveedor')
              if (state.tipo === 'operacion')  setStep('tipo')
            }}
            onSelect={c => { setState(s => ({ ...s, categoria: c })); setStep('subcategoria') }}
            onDirectSelect={(c, sub) => { setState(s => ({ ...s, categoria: c, subcategoria: sub })); setStep('subcategoria') }}
          />
        )}

        {step === 'subcategoria' && state.categoria && (
          <Step4Subcategoria
            unidades={state.unidades}
            categoria={state.categoria}
            preSelectedSub={state.subcategoria}
            onBack={() => setStep('categoria')}
            onConfirm={handleConfirm}
            saving={saving}
          />
        )}

      </div>
    </div>
  )
}
