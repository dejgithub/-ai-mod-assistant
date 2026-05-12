import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', { username, password })
      setToken(data.access_token)
      setUser({ username })
      toast.success('Welcome back!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/register', { username, email, password })
      setToken(data.access_token)
      setUser({ username })
      toast.success('Account created successfully!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
