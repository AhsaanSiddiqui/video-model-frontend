import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_EXPIRED_EVENT } from '../api/axios.js'

const AuthContext = createContext(null)

function readStoredSession() {
  try {
    const token = localStorage.getItem('accessToken')
    const raw = localStorage.getItem('currentUser')
    if (!token || !raw) return null
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem('currentUser')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = readStoredSession()
    if (storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const navigate = useNavigate()

  // Session couldn't be renewed (refresh token expired or invalid): log out and go to login
  useEffect(() => {
    function handleAuthExpired() {
      logout()
      const { pathname, search } = window.location
      if (pathname !== '/login') {
        navigate('/login', { replace: true, state: { from: pathname + search } })
      }
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  }, [logout, navigate])

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
      setIsLoading,
      error,
      setError,
      isAuthenticated,
      setIsAuthenticated,
      logout,
    }),
    [user, isLoading, error, isAuthenticated, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
