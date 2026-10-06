import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DetailsHero from '../components/details/DetailsHero'
import TrailerSection from '../components/details/TrailerSection'
import SeasonSelector from '../components/details/SeasonSelector'
import EpisodeList from '../components/details/EpisodeList'
import ContentRow from '../components/rows/ContentRow'
import { api } from '../services/apiService'
import { contentService } from '../services/contentService'
import { watchProgressService } from '../services/watchProgressService'

export default function SeriesDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [show,         setShow]         = useState(null)
  const [related,      setRelated]      = useState([])
  const [episodes,     setEpisodes]     = useState([])
  const [activeSeason, setActiveSeason] = useState(1)
  const [loading,      setLoading]      = useState(true)
  const progressMap = watchProgressService.getAllProgress()

  // Load series details
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const load = async () => {
      try {
        const tmdbMatch = String(id).match(/(\d+)$/)
        const tmdbId = tmdbMatch ? tmdbMatch[1] : null

        let item = null
        if (tmdbId) {
          try { item = await api.get(`/tmdb/tv/${tmdbId}`) } catch { /* fall through */ }
        }
        if (!item) item = contentService.getSeriesById(id)
        if (!cancelled) setShow(item)

        // Related
        if (tmdbId) {
          try {
            const data = await api.get(`/tmdb/trending?type=tv`)
            if (!cancelled) setRelated(Array.isArray(data) ? data.filter(s => String(s.tmdbId) !== String(tmdbId)).slice(0, 10) : [])
          } catch {
            if (item && !cancelled) setRelated(contentService.getRelated(item, 10))
          }
        } else if (item) {
          if (!cancelled) setRelated(contentService.getRelated(item, 10))
        }
      } catch (err) {
        console.error('SeriesDetails:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  // Load episodes when season changes
  useEffect(() => {
    if (!show) return
    let cancelled = false

    const loadEps = async () => {
      const tmdbMatch = String(id).match(/(\d+)$/)
      const tmdbId = tmdbMatch ? tmdbMatch[1] : null
      if (tmdbId) {
        try {
          const data = await api.get(`/tmdb/tv/${tmdbId}/season/${activeSeason}`)
          if (!cancelled) setEpisodes(Array.isArray(data) ? data : [])
          return
        } catch { /* fall through */ }
      }
      // Local fallback
      const local = contentService.getEpisodes(id, activeSeason)
      if (!cancelled) setEpisodes(local)
    }

    loadEps()
    return () => { cancelled = true }
  }, [id, show, activeSeason])

  if (loading) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,.2)', borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  )

  if (!show) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,.40)', marginBottom: 16 }}>Series not found.</p>
        <button onClick={() => navigate('/series')} style={{ fontSize: 14, color: 'rgba(255,255,255,.60)', cursor: 'pointer', textDecoration: 'underline' }}>Browse Series</button>
      </div>
    </div>
  )

  return (
    <article className="d2">
      <DetailsHero item={show} />

      <section className="d2-body" id="d2body">
        <div className="d2-c">
          <div className="d2-grid">
            <div>
              <h2 className="d2-h">About</h2>
              <p>{show.description}</p>
              {show.cast?.length > 0 && (
                <>
                  <div className="d2-cast">Cast</div>
                  <div className="chips">{show.cast.map(n => <span key={n}>{n}</span>)}</div>
                </>
              )}
            </div>
            <div>
              <h2 className="d2-h">Details</h2>
              <dl>
                {[
                  ['Language:', show.language],
                  ['Country:',  show.country],
                  ['Maturity:', show.maturity],
                  ['Seasons:',  show.seasons],
                  ['Released:', show.year],
                  ['Status:',   show.status],
                ].filter(([,v]) => v).map(([k,v]) => (
                  <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>
                ))}
              </dl>
              {show.rating && (
                <div className="d2-rate">
                  <small>Rating</small>
                  <div>
                    <b className="g">★ {show.rating}</b>
                    <strong>{show.rating}</strong>
                    <span>/ 10</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Episodes */}
          <div style={{ marginBottom: 'clamp(34px,5vw,64px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <h2 className="d2-h" style={{ marginBottom: 0 }}>Episodes</h2>
              {show.seasons > 1 && (
                <SeasonSelector seasons={show.seasons} activeSeason={activeSeason} onChange={setActiveSeason} />
              )}
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, overflow: 'hidden' }}>
              <EpisodeList episodes={episodes} seriesId={id} progressMap={progressMap} />
            </div>
            {episodes.length === 0 && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.30)', marginTop: 12 }}>
                Episode details for Season {activeSeason} coming soon.
              </p>
            )}
          </div>

          <h2 className="d2-h">Trailer</h2>
          <TrailerSection item={show} />

          {related.length > 0 && (
            <ContentRow title="More Like This" items={related} layout="poster" />
          )}
        </div>
      </section>
    </article>
  )
}
