/**
 * Auth service — calls the Node/Express backend.
 * Falls back gracefully if the backend is unreachable.
 */
import { api } from './apiService'

const STORAGE_KEY = 'nova_auth'

const persist = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
const clear   = () => localStorage.removeItem(STORAGE_KEY)

export const authService = {
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  signIn: async (email, password) => {
    if (!email || !password) throw new Error('Email and password are required.')
    const { user, token } = await api.post('/auth/signin', { email, password })
    persist({ ...user, token })
    return user
  },

  signUp: async (name, email, password) => {
    if (!name || !email || !password) throw new Error('All fields are required.')
    const { user, token } = await api.post('/auth/signup', { name, email, password })
    persist({ ...user, token })
    return user
  },

  signOut: async () => {
    try { await api.post('/auth/signout') } catch { /* ignore network errors */ }
    clear()
  },

  isSignedIn: () => !!authService.getCurrentUser(),

  /** Re-validate token and refresh stored user from server */
  refreshUser: async () => {
    try {
      const { user } = await api.get('/auth/me')
      const stored = authService.getCurrentUser()
      persist({ ...stored, ...user })
      return user
    } catch {
      clear()
      return null
    }
  },
}
