import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import RecentSearches from '../components/search/RecentSearches'
import WebGLBackground from '../components/common/WebGLBackground'
import { useSearch } from '../hooks/useSearch'
import { useTMDB } from '../hooks/useTMDB'
import { api } from '../services/apiService'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const { query, setQuery, recentSearches, saveSearch, clearRecentSearches, removeRecentSearch } = useSearch()

  // Live TMDB search results
  const [liveResults, setLiveResults] = useState([])
  const [searching,   setSearching]   = useState(false)
  const debounceRef = useRef(null)

  // Trending for empty-state
  const { data: trending } = useTMDB('/tmdb/trending?type=all&window=week', [], [])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    if (q) setQuery(q)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // Debounced TMDB search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!query.trim()) { setLiveResults([]); return }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.get(`/tmdb/search?q=${encodeURIComponent(query.trim())}`)
        setLiveResults(Array.isArray(data) ? data : [])
      } catch {
        setLiveResults([])
      } finally {
        setSearching(false)
      }
    }, 350)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val) setSearchParams({ q: val })
    else setSearchParams({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) saveSearch(query.trim())
  }

  const handleRecentSelect = (term) => {
    setQuery(term)
    setSearchParams({ q: term })
    inputRef.current?.focus()
  }

  const hasQuery  = query.trim().length > 0
  const showItems = hasQuery ? liveResults : trending.slice(0, 20)

  return (
    <div style={{ minHeight: '100vh', padding: 'clamp(120px,17vh,170px) var(--pad) clamp(50px,6vw,90px)', textAlign: 'center', position: 'relative' }}>
      <WebGLBackground active={true} />

      <h1 style={{ fontSize: 'clamp(28px,3.3vw,50px)', fontWeight: 700, letterSpacing: '-.02em', textShadow: '0 2px 20px rgba(0,0,0,.35)', marginBottom: 'clamp(20px,2.4vw,34px)' }}>
        Ready for an adventure?
      </h1>

      {/* Search box */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 'min(735px,100%)', margin: '0 auto' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 14, height: 'clamp(50px,4.2vw,60px)', padding: '0 clamp(16px,1.6vw,24px)', borderRadius: 999, background: 'rgba(255,255,255,.12)', border: `1px solid ${hasQuery?'rgba(255,255,255,.55)':'rgba(255,255,255,.22)'}`, backdropFilter: 'blur(14px)', transition: 'border-color .2s', color: 'var(--muted)' }}>
          <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search movies, TV shows & people…"
            aria-label="Search"
            style={{ flex: 1, minWidth: 0, background: 'none', border: 0, outline: 0, color: '#fff', font: `500 clamp(15px,1.25vw,18px) var(--font)` }}
          />
          {searching && (
            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
          )}
          {hasQuery && !searching && (
            <button type="button" onClick={() => { setQuery(''); setSearchParams({}); setLiveResults([]); inputRef.current?.focus() }}
              style={{ color: 'rgba(255,255,255,.45)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          )}
        </label>
      </form>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Results */}
      <div style={{ marginTop: 'clamp(28px,4vw,56px)', textAlign: 'left' }}>
        {!hasQuery && recentSearches.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <RecentSearches searches={recentSearches} onSelect={handleRecentSelect} onRemove={removeRecentSearch} onClear={clearRecentSearches} />
          </div>
        )}

        {/* Section label */}
        <h2 style={{ fontSize: 'clamp(17px,1.5vw,22px)', fontWeight: 600, color: 'var(--muted)', marginBottom: 'clamp(18px,2vw,30px)', letterSpacing: '-.01em' }}>
          {hasQuery ? `Results for "${query}"` : 'Trending Today'}
        </h2>

        {showItems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${hasQuery ? 'clamp(130px,13vw,200px)' : 'clamp(150px,17vw,260px)'}, 1fr))`, gap: 'clamp(12px,1.6vw,24px)' }}>
            {showItems.map((item, i) => (
              <article
                key={item.id || item.tmdbId || i}
                className="card"
                tabIndex={0}
                aria-label={item.title}
                style={{ width: '100%', animationDelay: `${Math.min(i, 14) * 35}ms` }}
                onClick={() => navigate(item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`)}
                onKeyDown={e => e.key === 'Enter' && navigate(item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`)}
              >
                <div className="poster" style={{ background: 'linear-gradient(135deg,#2a2a35,#1a1a22)', color: '#fff' }}>
                  {item.poster && <img src={item.poster} alt="" loading="lazy" onError={e => e.target.remove()} />}
                </div>
                <div className="hover" onClick={() => navigate(item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`)}>
                  <span><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></span>
                  <b>{item.title}</b>
                  <small>{item.year} <i>★</i> {item.rating}</small>
                </div>
                <div className="tag">{(item.genres||[])[0]} · {item.year}</div>
              </article>
            ))}
          </div>
        ) : hasQuery && !searching ? (
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.35)', padding: '40px 0', textAlign: 'center' }}>
            No results for "{query}". Try a different title or genre.
          </p>
        ) : null}
      </div>
    </div>
  )
}

