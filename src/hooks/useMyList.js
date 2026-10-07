/**
 * My List hook — user-scoped localStorage + backend sync.
 * Each user's list is stored under a unique key so lists don't bleed between accounts.
 */
import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/apiService'
import { authService } from '../services/authService'

const getStorageKey = () => {
  const user = authService.getCurrentUser()
  return user?.id ? `nova_my_list_${user.id}` : 'nova_my_list_guest'
}

const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(getStorageKey()) || '[]') } catch { return [] }
}
const writeLocal = (items) => {
  localStorage.setItem(getStorageKey(), JSON.stringify(items))
}

export const useMyList = () => {
  const [myList, setMyListState] = useState(readLocal)

  // Keep state in sync when user changes
  useEffect(() => {
    setMyListState(readLocal())
  }, [authService.getCurrentUser()?.id])

  const setMyList = useCallback((updater) => {
    setMyListState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeLocal(next)
      return next
    })
  }, [])

  const isInList = (id) => myList.some(item => item.id === id)

  const addToList = async (item) => {
    if (isInList(item.id)) return
    setMyList(prev => [item, ...prev])
    if (authService.isSignedIn()) {
      try {
        await api.post('/mylist', {
          contentId:   item.id,
          type:        item.type,
          title:       item.title,
          poster:      item.poster,
          backdrop:    item.backdrop,
          year:        item.year,
          rating:      item.rating,
          genres:      item.genres,
          description: item.description,
        })
      } catch { /* backend unavailable — local only */ }
    }
  }

  const removeFromList = async (id) => {
    setMyList(prev => prev.filter(item => item.id !== id))
    if (authService.isSignedIn()) {
      try { await api.delete(`/mylist/${id}`) } catch { /* ignore */ }
    }
  }

  const toggleList = (item) => {
    if (isInList(item.id)) return removeFromList(item.id)
    return addToList(item)
  }

  // Pull saved list from backend (call this on app init / after login)
  const syncFromBackend = useCallback(async () => {
    if (!authService.isSignedIn()) return
    try {
      const { items } = await api.get('/mylist')
      if (!Array.isArray(items)) return
      const mapped = items.map(i => ({
        id:          i.contentId,
        type:        i.type,
        title:       i.title,
        poster:      i.poster,
        backdrop:    i.backdrop,
        year:        i.year,
        rating:      i.rating,
        genres:      i.genres || [],
        description: i.description,
      }))
      setMyList(mapped)
    } catch { /* ignore */ }
  }, [setMyList])

  return { myList, isInList, addToList, removeFromList, toggleList, syncFromBackend }
}
