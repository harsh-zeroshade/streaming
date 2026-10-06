import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DetailsHero from '../components/details/DetailsHero'
import TrailerSection from '../components/details/TrailerSection'
import ContentRow from '../components/rows/ContentRow'
import { api } from '../services/apiService'
import { contentService } from '../services/contentService'

const dh = { fontSize: 'clamp(18px,1.5vw,22px)', fontWeight: 700, marginBottom: 16 }

export default function MovieDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [movie,   setMovie]   = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const load = async () => {
      try {
        // Extract numeric TMDB id from route id (e.g. "tmdb-movie-550" → "550", or "movie-001")
        const tmdbMatch = String(id).match(/(\d+)$/)
        const tmdbId = tmdbMatch ? tmdbMatch[1] : null

        let item = null
        if (tmdbId) {
          try { item = await api.get(`/tmdb/movie/${tmdbId}`) } catch { /* fall through */ }
        }
        // Fallback to local data
        if (!item) item = contentService.getMovieById(id)
        if (!cancelled) setMovie(item)

        // Related — fetch more like this from TMDB
        if (tmdbId) {
          try {
            const data = await api.get(`/tmdb/trending?type=movie`)
            if (!cancelled) setRelated(Array.isArray(data) ? data.filter(m => String(m.tmdbId) !== String(tmdbId)).slice(0, 10) : [])
          } catch {
            if (!cancelled) setRelated(contentService.getRelated(item || {}, 10))
          }
        } else if (item) {
          if (!cancelled) setRelated(contentService.getRelated(item, 10))
        }
      } catch (err) {
        console.error('MovieDetails:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,.2)', borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  )

  if (!movie) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,.40)', marginBottom: 16 }}>Movie not found.</p>
        <button onClick={() => navigate('/movies')} style={{ fontSize: 14, color: 'rgba(255,255,255,.60)', cursor: 'pointer', textDecoration: 'underline' }}>Browse Movies</button>
      </div>
    </div>
  )

  return (
    <article className="d2">
      <DetailsHero item={movie} />

      <section className="d2-body" id="d2body">
        <div className="d2-c">
          <div className="d2-grid">
            <div>
              <h2 className="d2-h">About</h2>
              <p>{movie.description}</p>
              {movie.cast?.length > 0 && (
                <>
                  <div className="d2-cast">Cast</div>
                  <div className="chips">{movie.cast.map(n => <span key={n}>{n}</span>)}</div>
                </>
              )}
            </div>
            <div>
              <h2 className="d2-h">Details</h2>
              <dl>
                {[
                  ['Director:', movie.director],
                  ['Language:', movie.language],
                  ['Country:',  movie.country],
                  ['Maturity:', movie.maturity],
                  ['Released:', movie.year],
                ].filter(([,v]) => v).map(([k,v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              {movie.rating && (
                <div className="d2-rate">
                  <small>Rating</small>
                  <div>
                    <b className="g">★ {movie.rating}</b>
                    <strong>{movie.rating}</strong>
                    <span>/ 10</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h2 className="d2-h">Trailer</h2>
          <TrailerSection item={movie} />

          {related.length > 0 && (
            <ContentRow title="More Like This" items={related} layout="poster" />
          )}
        </div>
      </section>
    </article>
  )
}
