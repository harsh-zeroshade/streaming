import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, SkipForward, SkipBack, List, X } from 'lucide-react'
import EpisodeCard from '../components/cards/EpisodeCard'
import { api } from '../services/apiService'
import { contentService } from '../services/contentService'
import { watchProgressService } from '../services/watchProgressService'

/**
 * Multiple embed providers tried in order.
 * Each has a buildUrl(tmdbId, type, season, episode) function.
 * type is 'movie' or 'tv'.
 */
const SOURCES = [
  {
    name: 'Server 1',
    buildUrl: (id, type, s, e) =>
      type === 'movie'
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Server 2',
    buildUrl: (id, type, s, e) =>
      type === 'movie'
        ? `https://vidsrc.xyz/embed/movie?tmdb=${id}`
        : `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'Server 3',
    buildUrl: (id, type, s, e) =>
      type === 'movie'
        ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    name: 'Server 4',
    buildUrl: (id, type, s, e) =>
      type === 'movie'
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Server 5',
    buildUrl: (id, type, s, e) =>
      type === 'movie'
        ? `https://vidsrc.me/embed/movie?tmdb=${id}`
        : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
]

const getTmdbId = (id = '') => {
  if (/^\d+$/.test(String(id))) return String(id)
  const m = String(id).match(/tmdb-(?:movie|series|ep)-(\d+)/)
  if (m) return m[1]
  const n = String(id).match(/(\d+)/)
  if (n && n[1].length > 4) return n[1]
  return null
}

export default function Player() {
  const { type, id } = useParams()
  const navigate = useNavigate()

  const [content,      setContent]      = useState(null)
  const [parentSeries, setParentSeries] = useState(null)
  const [episodes,     setEpisodes]     = useState([])
  const [nextEp,       setNextEp]       = useState(null)
  const [prevEp,       setPrevEp]       = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [showEpisodes, setShowEpisodes] = useState(false)
  const [progressMap,  setProgressMap]  = useState({})
  const [error,        setError]        = useState(null)

  // embed source state
  const [tmdbId,    setTmdbId]    = useState(null)
  const [embedType, setEmbedType] = useState('movie') // 'movie' | 'tv'
  const [season,    setSeason]    = useState(1)
  const [episode,   setEpisode]   = useState(1)
  const [srcIndex,  setSrcIndex]  = useState(0)
  const [iframeKey, setIframeKey] = useState(0) // force remount on source change

  const embedUrl = tmdbId
    ? SOURCES[srcIndex].buildUrl(tmdbId, embedType, season, episode)
    : null

  const switchSource = useCallback((idx) => {
    setSrcIndex(idx)
    setIframeKey(k => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setSrcIndex(0)
    setIframeKey(0)

    const load = async () => {
      try {
        let item     = null
        let sea      = 1
        let epi      = 1
        const rawId  = getTmdbId(id)

        if (type === 'movie') {
          if (rawId) {
            try { item = await api.get(`/tmdb/movie/${rawId}`) } catch { /* fall through */ }
          }
          if (!item) item = contentService.getMovieById(id)

        } else {
          const localEp = contentService.getEpisodeById(id)
          if (localEp) {
            item = localEp
            sea  = localEp.season  || 1
            epi  = localEp.episode || 1
            const parent = contentService.getSeriesById(localEp.seriesId)
            if (!cancelled) setParentSeries(parent)
            const eps = contentService.getEpisodes(localEp.seriesId, sea)
            if (!cancelled) {
              setEpisodes(eps)
              setNextEp(contentService.getNextEpisode(localEp.id))
              setPrevEp(contentService.getPrevEpisode(localEp.id))
            }
          } else {
            let seriesItem = null
            if (rawId) {
              try { seriesItem = await api.get(`/tmdb/tv/${rawId}`) } catch { /* fall through */ }
            }
            if (!seriesItem) seriesItem = contentService.getSeriesById(id)

            if (seriesItem) {
              let eps = []
              const seriesTmdbId = seriesItem.tmdbId || getTmdbId(seriesItem.id)
              if (seriesTmdbId) {
                try { eps = await api.get(`/tmdb/tv/${seriesTmdbId}/season/1`) } catch { /* fall through */ }
              }
              if (!eps?.length) eps = contentService.getEpisodes(id, 1)
              item = eps[0] || seriesItem
              sea  = eps[0]?.season  || 1
              epi  = eps[0]?.episode || 1
              if (!cancelled) { setParentSeries(seriesItem); setEpisodes(Array.isArray(eps) ? eps : []) }
            }
          }
        }

        if (!item || cancelled) {
          if (!cancelled) setError('Content not found.')
          return
        }

        if (!cancelled) { setContent(item); setProgressMap(watchProgressService.getAllProgress()) }

        const resolvedTmdbId = item.tmdbId || getTmdbId(item.id) || (item.seriesId ? getTmdbId(item.seriesId) : null)
        const resolvedType   = (item.seriesId || item.type === 'series' || item.type === 'tv' || type === 'series') ? 'tv' : 'movie'

        if (!cancelled) {
          setTmdbId(resolvedTmdbId)
          setEmbedType(resolvedType)
          setSeason(sea)
          setEpisode(epi)
        }

      } catch (err) {
        console.error('Player error:', err)
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [type, id])

  const isEpisode   = content?.seriesId != null || (type === 'series' && content?.episode != null)
  const seriesTitle = parentSeries?.title || ''
  const title       = isEpisode && content?.season != null
    ? `${seriesTitle} — S${content.season} E${content.episode}: ${content.title}`
    : content?.title || ''

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>
        <div style={{ width: 44, height: 44, border: '3px solid rgba(255,255,255,.2)', borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 14 }}>Loading player…</p>
      </div>
    </div>
  )

  /* ── Not found ── */
  if (error || !content) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 16, fontSize: 15 }}>{error || 'Content not found.'}</p>
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,.6)', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>Go Back</button>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', background: 'linear-gradient(to bottom, rgba(0,0,0,.85), transparent)', pointerEvents: 'auto' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <p style={{ flex: 1, textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,.85)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </p>
        {isEpisode && episodes.length > 0 && (
          <button onClick={() => setShowEpisodes(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.65)', fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
            <List size={16} /> Episodes
          </button>
        )}
      </div>

      {/* ── Player iframe ── */}
      <div style={{ position: 'relative', flex: 1, minHeight: '56.25vw', background: '#111' }}>
        {embedUrl ? (
          <iframe
            key={iframeKey}
            src={embedUrl}
            title={title}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'rgba(255,255,255,.5)' }}>
            <svg viewBox="0 0 24 24" style={{ width: 48, height: 48, opacity: .4, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }}>
              <circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z" fill="currentColor" stroke="none"/>
            </svg>
            <p style={{ fontSize: 14 }}>Playback unavailable — no TMDB ID found.</p>
          </div>
        )}

        {/* Prev / Next episode */}
        {isEpisode && (prevEp || nextEp) && (
          <div style={{ position: 'absolute', bottom: 80, right: 16, display: 'flex', gap: 8, zIndex: 20 }}>
            {prevEp && (
              <button onClick={() => navigate(`/watch/series/${prevEp.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,.65)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', fontSize: 13, padding: '8px 16px', borderRadius: 12, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                <SkipBack size={14} /> Prev
              </button>
            )}
            {nextEp && (
              <button onClick={() => navigate(`/watch/series/${nextEp.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,.65)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', fontSize: 13, padding: '8px 16px', borderRadius: 12, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                Next <SkipForward size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Source switcher + info ── */}
      <div style={{ padding: '20px clamp(16px,4vw,48px)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

        {/* Source tabs */}
        {embedUrl && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Not playing? Try another server:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SOURCES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => switchSource(i)}
                  style={{
                    fontSize: 13, fontWeight: 600,
                    padding: '7px 18px', borderRadius: 999,
                    border: `1px solid ${i === srcIndex ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.12)'}`,
                    background: i === srcIndex ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.06)',
                    color: i === srcIndex ? '#fff' : 'rgba(255,255,255,.5)',
                    cursor: 'pointer', transition: 'all .18s',
                  }}
                >
                  {src.name}
                  {i === srcIndex && (
                    <span style={{ marginLeft: 6, display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', verticalAlign: 'middle' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Title + meta */}
        <h1 style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, marginBottom: 8 }}>{title}</h1>
        {content.description && (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.6, maxWidth: 700, marginBottom: 12 }}>{content.description}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>
          {content.year     && <span>{content.year}</span>}
          {content.duration && <span>{content.duration}</span>}
          {content.rating   && <span>★ {content.rating}</span>}
          {content.maturity && <span style={{ border: '1px solid rgba(255,255,255,.25)', borderRadius: 4, padding: '1px 6px' }}>{content.maturity}</span>}
        </div>
      </div>

      {/* ── Episode drawer ── */}
      {showEpisodes && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)' }} onClick={() => setShowEpisodes(false)} />
          <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 'min(380px,90vw)', background: '#0f0f11', borderLeft: '1px solid rgba(255,255,255,.08)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>{parentSeries?.title || seriesTitle}</h3>
              <button onClick={() => setShowEpisodes(false)} style={{ color: 'rgba(255,255,255,.4)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {episodes.map(ep => (
              <div key={ep.id} style={{ background: ep.id === content.id ? 'rgba(255,255,255,.05)' : 'transparent' }}>
                <EpisodeCard
                  episode={ep}
                  progress={progressMap[ep.id]?.progress}
                  onPlay={() => { navigate(`/watch/series/${ep.id}`); setShowEpisodes(false) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
