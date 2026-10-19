import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_EXPIRED_EVENT, clearManualLogout, markManualLogout } from '../api/axios.js'
import { logoutUser } from '../api/auth.api.js'

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

function toStoredUser(nextUser) {
  const safe = { ...nextUser }
  delete safe.password
  delete safe.refreshToken
  return safe
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredSession())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(readStoredSession()))

  const clearSession = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const saveUser = useCallback((nextUser) => {
    if (!nextUser || typeof nextUser !== 'object') return
    const safe = toStoredUser(nextUser)
    localStorage.setItem('currentUser', JSON.stringify(safe))
    setUser(safe)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    markManualLogout()
    try {
      if (localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')) {
        await logoutUser()
      }
    } finally {
      clearSession()
      clearManualLogout()
    }
  }, [clearSession])

  const navigate = useNavigate()

  // Session couldn't be renewed (refresh token expired or invalid): log out and go to login
  useEffect(() => {
    function handleAuthExpired() {
      clearSession()
      const { pathname, search } = window.location
      if (pathname !== '/login') {
        navigate('/login', { replace: true, state: { from: pathname + search } })
      }
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  }, [clearSession, navigate])

  const value = useMemo(
    () => ({
      user,
      setUser,
      saveUser,
      isLoading,
      setIsLoading,
      error,
      setError,
      isAuthenticated,
      setIsAuthenticated,
      logout,
    }),
    [user, isLoading, error, isAuthenticated, logout, saveUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
