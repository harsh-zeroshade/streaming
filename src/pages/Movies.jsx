import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ContentRow from '../components/rows/ContentRow'
import { useTMDB } from '../hooks/useTMDB'
import { getTrendingMovies } from '../data/movies'

const SORTS = { popular: 'Popular', rating: 'Top Rated', newest: 'Newest', az: 'A–Z' }

export default function Movies() {
  const navigate    = useNavigate()
  const [genre,  setGenre]  = useState('')
  const [year,   setYear]   = useState('')
  const [sort,   setSort]   = useState('popular')
  const [openDD, setOpenDD] = useState(null)

  // Live data from TMDB via backend
  const { data: trending,  loading: tLoading } = useTMDB('/tmdb/trending?type=movie', getTrendingMovies(), [])
  const { data: allMovies, loading: aLoading } = useTMDB('/tmdb/top-rated?type=movie', [], [])
  const { data: nowPlaying } = useTMDB('/tmdb/now-playing', [], [])

  // Combine for the grid — trending + top-rated + now playing deduplicated
  const combinedMovies = useMemo(() => {
    const seen = new Set()
    return [...trending, ...allMovies, ...nowPlaying].filter(m => {
      const key = m.tmdbId || m.id
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [trending, allMovies, nowPlaying])

  const years = useMemo(() =>
    [...new Set(combinedMovies.map(m => m.year).filter(Boolean))].sort((a,b) => b - a),
    [combinedMovies]
  )
  const genreOptions = useMemo(() =>
    [...new Set(combinedMovies.flatMap(m => m.genres || []))].sort(),
    [combinedMovies]
  )

  const filtered = useMemo(() => {
    let items = combinedMovies.filter(m =>
      (!genre || (m.genres || []).includes(genre)) &&
      (!year  || String(m.year) === String(year))
    )
    if (sort === 'rating')  items = [...items].sort((a,b) => parseFloat(b.rating||0) - parseFloat(a.rating||0))
    if (sort === 'newest')  items = [...items].sort((a,b) => (b.year||0) - (a.year||0))
    if (sort === 'az')      items = [...items].sort((a,b) => (a.title||'').localeCompare(b.title||''))
    return items
  }, [combinedMovies, genre, year, sort])

  const hasFilter = genre || year || sort !== 'popular'
  const FILTERS = [
    { key: 'genre', label: 'Genre', value: genre, opts: genreOptions.map(g => [g,g]), setValue: setGenre },
    { key: 'year',  label: 'Year',  value: year,  opts: years.map(y => [String(y),String(y)]), setValue: setYear },
    { key: 'sort',  label: SORTS[sort], value: sort, opts: Object.entries(SORTS), setValue: setSort, isSort: true },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 120 }}>
      {/* Blurred backdrop */}
      <div aria-hidden="true" style={{
        pointerEvents: 'none', position: 'absolute', inset: 0,
        height: 'clamp(420px,64vh,660px)', overflow: 'hidden', zIndex: 0,
        WebkitMaskImage: 'linear-gradient(to bottom, #000 35%, transparent)',
        maskImage: 'linear-gradient(to bottom, #000 35%, transparent)',
      }}>
        {trending[0]?.backdrop && (
          <img src={trending[0].backdrop} alt="" style={{ position: 'absolute', inset: '-40px', width: 'calc(100%+80px)', height: 'calc(100%+80px)', objectFit: 'cover', opacity: .30, filter: 'blur(4px)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,.45) 0%,rgba(0,0,0,.20) 50%,transparent)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '0 var(--pad)', paddingTop: 'clamp(92px,12vh,130px)' }}>
        <h1 style={{ fontSize: 'clamp(40px,3.6vw,68px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 'clamp(16px,2vw,24px)', textShadow: '0 2px 24px rgba(0,0,0,.4)' }}>
          Movies
        </h1>

        {/* Filter bar */}
        <div className="pg-filters-wrap">
        <div className="pg-filters">
          <button
            onClick={() => { setGenre(''); setYear(''); setSort('popular'); setOpenDD(null) }}
            title="Reset filters"
            className={`pf-reset${hasFilter ? ' active' : ''}`}
          >
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>
          </button>
          {FILTERS.map(f => {
            const isOpen = openDD === f.key
            const active = f.isSort ? f.value !== 'popular' : !!f.value
            return (
              <div key={f.key} style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setOpenDD(isOpen ? null : f.key)}
                  className={`pf-btn${isOpen ? ' open' : ''}${active ? ' active-filter' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {f.isSort && <i style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', flexShrink: 0 }} />}
                    {f.isSort ? f.label : (f.value || f.label)}
                  </span>
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 2, flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {isOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 190, maxHeight: 260, overflowY: 'auto', background: 'rgba(20,20,22,.97)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 16, padding: 6, boxShadow: '0 20px 48px rgba(0,0,0,.6)', backdropFilter: 'blur(20px)', zIndex: 30 }}>
                    {!f.isSort && <button onClick={() => { f.setValue(''); setOpenDD(null) }} style={{ display: 'flex', width: '100%', padding: '9px 13px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.65)', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>All {f.label.toLowerCase()}s</button>}
                    {f.opts.map(([val, lbl]) => {
                      const sel = f.value === val
                      return (
                        <button key={val} onClick={() => { f.setValue(val); setOpenDD(null) }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 13px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: sel ? 'rgba(255,255,255,.10)' : 'transparent', color: sel ? '#fff' : 'rgba(255,255,255,.65)', cursor: 'pointer', textAlign: 'left' }}>
                          {lbl}
                          {sel && <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: 'none', stroke: '#7ddc5a', strokeWidth: 2.5 }}><path d="m5 12 5 5 9-10"/></svg>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        </div>{/* end pg-filters-wrap */}
        {openDD && <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpenDD(null)} aria-hidden="true" />}

        {/* Trending row */}
        <div style={{ margin: '0 calc(-1 * var(--pad)) clamp(24px,3vw,48px)' }}>
          <ContentRow title="Trending Movies" items={trending} layout="poster" viewAllPath="/movies" />
        </div>

        {/* All movies grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(14px,1.6vw,24px)' }}>
          <h2 style={{ fontSize: 'clamp(18px,1.7vw,26px)', fontWeight: 700, letterSpacing: '-.01em' }}>All Movies</h2>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>
            {aLoading && tLoading ? 'Loading…' : `${filtered.length} titles`}
          </span>
        </div>

        {filtered.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(var(--card-w), 1fr))', gap: 'clamp(12px,1.4vw,22px)' }}>
            {filtered.map(item => (
              <article key={item.id || item.tmdbId} className="card"
                tabIndex={0} aria-label={item.title} style={{ width: '100%' }}
                onClick={() => navigate(`/movie/${item.id}`)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/movie/${item.id}`)}>
                <div className="poster" style={{ background: 'linear-gradient(135deg,#2a2a35,#1a1a22)', color: '#fff' }}>
                  {item.poster && <img src={item.poster} alt="" loading="lazy" onError={e => e.target.remove()} />}
                </div>
                <div className="hover">
                  <span><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></span>
                  <b>{item.title}</b>
                  <small>{item.year} <i>★</i> {item.rating}</small>
                </div>
                <div className="tag">{(item.genres||[])[0]} · {item.year}</div>
              </article>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', padding: 'clamp(40px,6vw,80px) 0', textAlign: 'center' }}>
            {aLoading ? 'Loading movies…' : 'No movies match these filters.'}
          </p>
        )}
      </div>
    </div>
  )
}
