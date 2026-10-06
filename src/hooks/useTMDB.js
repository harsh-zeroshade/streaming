import { useState, useEffect, useRef } from 'react'
import { api } from '../services/apiService'

/**
 * Generic TMDB data fetcher.
 * Returns { data, loading, error }
 * `fallback` is shown immediately while fetch is in-flight.
 */
export const useTMDB = (path, fallback = [], deps = []) => {
  const [data,    setData]    = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    setLoading(true)
    setError(null)

    api.get(path)
      .then(res => {
        if (!mounted.current) return
        // api returns array or object — normalise
        const result = Array.isArray(res) ? res : (res.results || res.items || res)
        setData(result)
      })
      .catch(err => {
        if (!mounted.current) return
        console.warn(`useTMDB(${path}):`, err.message)
        setError(err.message)
        // keep fallback data on error
      })
      .finally(() => {
        if (mounted.current) setLoading(false)
      })

    return () => { mounted.current = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
