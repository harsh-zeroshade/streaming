/**
 * Watch progress service — syncs with backend when signed in,
 * always mirrors to localStorage for instant reads.
 */
import { api } from './apiService'
import { authService } from './authService'

const KEY = 'nova_watch_progress'

const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
const saveLocal = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

export const watchProgressService = {
  getProgress: (contentId) => {
    return loadLocal()[contentId] || null
  },

  saveProgress: async (contentId, progressSeconds, durationMinutes, meta = {}) => {
    const progress = durationMinutes > 0
      ? Math.min(100, Math.round((progressSeconds / (durationMinutes * 60)) * 100))
      : 0

    const entry = { contentId, progressSeconds, durationMinutes, progress, updatedAt: Date.now(), ...meta }

    // Always write locally first for instant UI updates
    const all = loadLocal()
    all[contentId] = entry
    saveLocal(all)

    // Sync to backend if signed in
    if (authService.isSignedIn()) {
      try { await api.post('/progress', entry) } catch { /* backend unavailable */ }
    }
  },

  clearProgress: async (contentId) => {
    const all = loadLocal()
    delete all[contentId]
    saveLocal(all)

    if (authService.isSignedIn()) {
      try { await api.delete(`/progress/${contentId}`) } catch { /* ignore */ }
    }
  },

  getAllProgress: () => loadLocal(),

  /** Pull progress from backend and merge into localStorage */
  syncFromBackend: async () => {
    if (!authService.isSignedIn()) return
    try {
      const { progress } = await api.get('/progress')
      if (!Array.isArray(progress)) return
      const map = {}
      progress.forEach(p => { map[p.contentId] = p })
      // Merge: backend wins for server-tracked, keep local for anything not on server
      const local = loadLocal()
      saveLocal({ ...local, ...map })
    } catch { /* ignore */ }
  },
}
