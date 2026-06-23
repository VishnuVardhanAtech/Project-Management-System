import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token  = localStorage.getItem('pf_token')
    const stored = localStorage.getItem('pf_user')
    if (token && stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.clear() }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('pf_token', data.token)
    localStorage.setItem('pf_user',  JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password })
    localStorage.setItem('pf_token', data.token)
    localStorage.setItem('pf_user',  JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('pf_token')
    localStorage.removeItem('pf_user')
    setUser(null)
  }, [])

  return (
    <Ctx.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
