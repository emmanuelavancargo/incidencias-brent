import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import type { Viaje, Categoria } from './types'

import LoginPage        from './pages/LoginPage'
import Step1Unidades    from './pages/Step1Unidades'
import Step2Conductor   from './pages/Step2Conductor'
import Step3Categoria   from './pages/Step3Categoria'
import Step4Subcategoria from './pages/Step4Subcategoria'
import SuccessPage      from './pages/SuccessPage'
import Header           from './components/Header'
import ProgressBar      from './components/ProgressBar'

type Step = 1 | 2 | 3 | 4 | 'success'

interface FlowState {
  unidades:     Viaje[]
  conductor:    string | null
  categoria?:   Categoria
  subcategoria?: string
}

export default function App() {
  const { email, loading, error, login, logout } = useAuth()
  const [step, setStep]   = useState<Step>(1)
  const [state, setState] = useState<FlowState>({ unidades: [], conductor: null })
  const [saving, setSaving] = useState(false)

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center" style={{ background: '#1E3252' }}>
      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (!email) return <LoginPage onLogin={login} error={error} />

  // ── success ──────────────────────────────────────────────────
  if (step === 'success' && state.categoria && state.subcategoria) return (
    <SuccessPage
      unidades={state.unidades}
      categoria={state.categoria}
      subcategoria={state.subcategoria}
      onAddAnother={() => { setState(s => ({ unidades: s.unidades, conductor: null })); setStep(3) }}
      onReset={() => { setState({ unidades: [], conductor: null }); setStep(1) }}
    />
  )

  // ── step 1: unidades ─────────────────────────────────────────
  const handleContinueUnidades = () => {
    // Si es una sola unidad → paso de conductor; convoy → saltar directo a categoría
    if (state.unidades.length === 1) setStep(2)
    else setStep(3)
  }

  // ── step 4: confirm ──────────────────────────────────────────
  const handleConfirm = async (subcategoria: string, descripcionOtro: string | null) => {
    if (!state.categoria || !email) return
    setSaving(true)
    try {
      await supabase.from('incidencias').insert({
        user_email:       email,
        trip_ids:         state.unidades.map(v => v.trip_id),
        patentes:         state.unidades.map(v => v.patente_camion).filter(Boolean),
        chofer_asignado:  state.conductor,
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

  const numStep = (step === 'success' ? 4 : step) as 1 | 2 | 3 | 4

  return (
    <div className="min-h-svh flex flex-col" style={{ maxWidth: 480, margin: '0 auto', background: '#F7F8FA' }}>
      <Header user={{ email }} onLogout={logout} />
      <ProgressBar step={numStep} />
      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <Step1Unidades
            selected={state.unidades}
            onAdd={v => setState(s => ({ ...s, unidades: [...s.unidades, v] }))}
            onRemove={id => setState(s => ({ ...s, unidades: s.unidades.filter(u => u.trip_id !== id) }))}
            onContinue={handleContinueUnidades}
          />
        )}
        {step === 2 && state.unidades.length === 1 && (
          <Step2Conductor
            viaje={state.unidades[0]}
            onBack={() => setStep(1)}
            onSelect={c => { setState(s => ({ ...s, conductor: c })); setStep(3) }}
          />
        )}
        {step === 3 && (
          <Step3Categoria
            unidades={state.unidades}
            conductor={state.conductor}
            onBack={() => setStep(state.unidades.length === 1 ? 2 : 1)}
            onSelect={c => { setState(s => ({ ...s, categoria: c })); setStep(4) }}
            onDirectSelect={(c, sub) => { setState(s => ({ ...s, categoria: c, subcategoria: sub })); setStep(4) }}
          />
        )}
        {step === 4 && state.categoria && (
          <Step4Subcategoria
            unidades={state.unidades}
            categoria={state.categoria}
            preSelectedSub={state.subcategoria}
            onBack={() => setStep(3)}
            onConfirm={handleConfirm}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}
