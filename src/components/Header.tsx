import { LogOut } from 'lucide-react'

interface Props {
  user: { email: string }
  onLogout: () => void
}

export default function Header({ user, onLogout }: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 shadow-sm" style={{ background: '#1E3252' }}>
      {/* Logo + título */}
      <div className="flex items-center gap-3">
        <img src="/logo-avancargo.png" alt="Avancargo" className="h-7 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="border-l border-white/20 pl-3">
          <p className="font-mono-brand text-xs font-bold leading-none" style={{ color: '#FF6C02' }}>BRENT</p>
          <p className="text-white/40 text-xs leading-none mt-0.5">Incidencias</p>
        </div>
      </div>

      {/* Usuario */}
      <div className="flex items-center gap-2">
        <span className="text-white/40 text-xs truncate max-w-[120px] hidden sm:block">{user.email}</span>
        <button onClick={onLogout} className="p-2 rounded-xl hover:bg-white/10 transition tap-active" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
