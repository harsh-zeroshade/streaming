import { useState, useMemo, useCallback } from 'react'
import { movies } from '../data/movies'
import { series } from '../data/series'
import { searchContent } from '../utils/filterContent'
import { useLocalStorage } from './useLocalStorage'

const ALL_CONTENT = [...movies, ...series]

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useLocalStorage('nova_recent_searches', [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchContent(ALL_CONTENT, query)
  }, [query])

  const saveSearch = useCallback(
    (term) => {
      if (!term.trim()) return
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== term)
        return [term, ...filtered].slice(0, 8)
      })
    },
    [setRecentSearches]
  )

  const clearRecentSearches = () => setRecentSearches([])

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term))
  }

  return {
    query,
    setQuery,
    results,
    recentSearches,
    saveSearch,
    clearRecentSearches,
    removeRecentSearch,
  }
}
