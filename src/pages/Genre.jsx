import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ContentGrid from '../components/rows/ContentGrid'
import ContentRow from '../components/rows/ContentRow'
import { contentService, tmdbService } from '../services/contentService'
import { getGenreBySlug } from '../data/genres'

export default function Genre() {
  const { genre } = useParams()
  const navigate  = useNavigate()

  const genreMeta = useMemo(() => getGenreBySlug(genre), [genre])

  // ── Local mock data (instant fallback) ──
  const localMovies = useMemo(() => contentService.getMoviesByGenre(genre), [genre])
  const localShows  = useMemo(() => contentService.getSeriesByGenre(genre), [genre])

  // ── TMDB live data ──
  const [movies,  setMovies]  = useState(localMovies)
  const [shows,   setShows]   = useState(localShows)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!genre) return
    let cancelled = false
    setLoading(true)
    setError(null)

    // Reset to local data immediately when genre changes
    setMovies(localMovies)
    setShows(localShows)

    const load = async () => {
      try {
        // Fetch movies and TV shows in parallel from TMDB
        const [tmdbMovies, tmdbShows] = await Promise.all([
          tmdbService.getByGenre(genre, 'movie'),
          tmdbService.getByGenre(genre, 'tv'),
        ])
        if (cancelled) return
        // Use TMDB results if non-empty, otherwise keep local fallback
        if (tmdbMovies?.length) setMovies(tmdbMovies)
        if (tmdbShows?.length)  setShows(tmdbShows)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [genre]) // eslint-disable-line react-hooks/exhaustive-deps

  const featured = useMemo(() => [...movies, ...shows].slice(0, 6), [movies, shows])
  const hasContent = movies.length > 0 || shows.length > 0

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 120 }}>

      {/* ── Genre hero banner ── */}
      <div style={{
        position: 'relative',
        height: 'clamp(200px, 35vw, 320px)',
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        {genreMeta?.backdrop && (
          <>
            <img
              src={genreMeta.backdrop} alt="" aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* color tint overlay from genre data */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, var(--bg) 0%, ${genreMeta.color || 'rgba(0,0,0,.5)'}88 55%, transparent 100%)`,
            }} />
          </>
        )}
        <div style={{ position: 'relative', padding: '0 var(--pad) clamp(20px,3vw,40px)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>Genre</p>
          <h1 style={{ fontSize: 'clamp(32px,6vw,64px)', fontWeight: 800, letterSpacing: '-.02em' }}>
            {genreMeta?.name || genre}
          </h1>
          {genreMeta?.description && (
            <p style={{ fontSize: 'clamp(13px,1.1vw,16px)', color: 'rgba(255,255,255,.55)', marginTop: 8, maxWidth: 480 }}>
              {genreMeta.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && !hasContent && (
        <div style={{ padding: '40px var(--pad)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: 'clamp(100px,12vw,160px)',
              aspectRatio: '2/3',
              borderRadius: 10,
              background: 'rgba(255,255,255,.06)',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 60}ms`,
            }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
        </div>
      )}

      {/* ── Content ── */}
      {!loading || hasContent ? (
        <div style={{ paddingTop: 16 }}>
          {featured.length > 0 && (
            <ContentRow title={`Featured · ${genreMeta?.name || genre}`} items={featured} layout="poster" />
          )}

          {movies.length > 0 && (
            <div style={{ padding: '0 var(--pad)', marginBottom: 40 }}>
              <h2 style={{ fontSize: 'clamp(17px,1.5vw,22px)', fontWeight: 700, marginBottom: 20 }}>
                Movies
                <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,.35)' }}>
                  {movies.length} titles
                </span>
              </h2>
              <ContentGrid items={movies} layout="poster" />
            </div>
          )}

          {shows.length > 0 && (
            <div style={{ padding: '0 var(--pad)', marginBottom: 40 }}>
              <h2 style={{ fontSize: 'clamp(17px,1.5vw,22px)', fontWeight: 700, marginBottom: 20 }}>
                TV Shows
                <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,.35)' }}>
                  {shows.length} titles
                </span>
              </h2>
              <ContentGrid items={shows} layout="poster" />
            </div>
          )}

          {!hasContent && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px var(--pad)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,.30)', fontSize: 16, marginBottom: 16 }}>
                {error ? `Failed to load: ${error}` : 'No content found for this genre.'}
              </p>
              <button
                onClick={() => navigate('/')}
                style={{ fontSize: 14, color: 'rgba(255,255,255,.60)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

