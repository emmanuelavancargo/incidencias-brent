import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const KEY = 'brent_user_email'

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored) setEmail(stored)
    setLoading(false)
  }, [])

  const login = async (inputEmail: string) => {
    setError(null)
    const normalized = inputEmail.trim().toLowerCase()
    const { data, error: err } = await supabase
      .from('usuarios_permitidos')
      .select('email')
      .eq('email', normalized)
      .maybeSingle()

    if (err) { setError('Error de conexión'); return }
    if (!data) { setError('Email no autorizado'); return }

    localStorage.setItem(KEY, normalized)
    setEmail(normalized)
  }

  const logout = () => {
    localStorage.removeItem(KEY)
    setEmail(null)
  }

  return { email, loading, error, login, logout }
}
