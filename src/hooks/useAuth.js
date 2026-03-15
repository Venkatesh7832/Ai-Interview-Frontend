import { createContext, useContext, useState, useCallback } from 'react'
import { getUser, isAuthenticated, logout as clearAuth } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser())
  const navigate = useNavigate()

  const refreshUser = useCallback(() => {
    setUser(getUser())
  }, [])

  const signOut = useCallback(() => {
    clearAuth()
    setUser(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: isAuthenticated(), refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
