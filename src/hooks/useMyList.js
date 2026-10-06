/**
 * My List hook — localStorage + backend sync when signed in.
 */
import { useLocalStorage } from './useLocalStorage'
import { api } from '../services/apiService'
import { authService } from '../services/authService'

export const useMyList = () => {
  const [myList, setMyList] = useLocalStorage('nova_my_list', [])

  const isInList = (id) => myList.some((item) => item.id === id)

  const addToList = async (item) => {
    if (isInList(item.id)) return
    setMyList((prev) => [item, ...prev])
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
      } catch { /* backend unavailable — local-only */ }
    }
  }

  const removeFromList = async (id) => {
    setMyList((prev) => prev.filter((item) => item.id !== id))
    if (authService.isSignedIn()) {
      try { await api.delete(`/mylist/${id}`) } catch { /* ignore */ }
    }
  }

  const toggleList = (item) => {
    if (isInList(item.id)) return removeFromList(item.id)
    return addToList(item)
  }

  /** Pull saved list from backend on mount */
  const syncFromBackend = async () => {
    if (!authService.isSignedIn()) return
    try {
      const { items } = await api.get('/mylist')
      if (!Array.isArray(items) || items.length === 0) return
      // Remap backend schema → frontend schema
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
  }

  return { myList, isInList, addToList, removeFromList, toggleList, syncFromBackend }
}
