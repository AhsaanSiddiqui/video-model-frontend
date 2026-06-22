import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

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
