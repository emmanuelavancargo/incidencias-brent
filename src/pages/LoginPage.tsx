import { useState } from 'react'
import { LogIn } from 'lucide-react'

interface Props {
  onLogin: (email: string) => void
  error: string | null
}

export default function LoginPage({ onLogin, error }: Props) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) onLogin(email)
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6" style={{ background: '#1E3252' }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="text-4xl">🚛</div>
          <h1 className="font-mono-brand text-2xl font-bold text-white">Brent · Incidencias</h1>
          <p className="text-white/50 text-sm">Control Tower — Avancargo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@avancargo.com"
            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.15)' }}
            autoComplete="email"
          />
          {error && <p className="text-red-300 text-xs px-1">{error}</p>}
          <button
            type="submit"
            disabled={!email.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm transition disabled:opacity-40"
            style={{ background: '#FF6C02' }}
          >
            <LogIn className="w-4 h-4" />
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
