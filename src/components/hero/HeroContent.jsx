import { useNavigate } from 'react-router-dom'
import { Play, Plus, Info, Star } from 'lucide-react'
import { useMyList } from '../../hooks/useMyList'

/**
 * Hero text panel — Cinejoy reference design:
 *  • Bowlby One display font for title
 *  • White play pill button
 *  • Glass + / info button group
 *  • Meta row: star · calendar · genre icons
 */
export default function HeroContent({ item }) {
  const navigate = useNavigate()
  const { isInList, toggleList } = useMyList()

  if (!item) return null

  const inList     = isInList(item.id)
  const watchPath  = `/watch/${item.type}/${item.id}`
  const detailPath = item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`
  const genre      = item.genres?.[0] ?? ''

  return (
    <div style={{ padding: '0 var(--pad)' }}>
      <div style={{ maxWidth: 'min(720px,100%)' }}>

        {/* ── Display title — Bowlby One ──────────── */}
        <h1
          style={{
            fontFamily: "'Bowlby One', Impact, sans-serif",
            fontSize:   'clamp(64px, 9.2vw, 176px)',
            lineHeight:  0.9,
            letterSpacing: '-.02em',
            color:       '#e3d9c0',
            transform:   'rotate(-2deg)',
            transformOrigin: 'left bottom',
            marginBottom: 'clamp(20px,3vw,36px)',
            textShadow:  '0 6px 24px rgba(0,0,0,.25)',
            maxWidth:    '90%',
          }}
        >
          {item.title}
        </h1>

        {/* ── Meta row ─────────────────────────────── */}
        <div
          className="flex flex-wrap items-center"
          style={{
            gap:          12,
            fontSize:     'clamp(14px,1.25vw,20px)',
            fontWeight:   500,
            marginBottom: 'clamp(14px,1.6vw,26px)',
          }}
        >
          {item.rating && (
            <span className="flex items-center" style={{ gap: 8 }}>
              <Star size={14} fill="#fff" stroke="#fff" aria-hidden="true" />
              {item.rating}/10
            </span>
          )}
          {item.rating && item.year && (
            <i style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.6)', display: 'inline-block' }} />
          )}
          {item.year && (
            <span className="flex items-center" style={{ gap: 8 }}>
              {/* Calendar icon inline */}
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, strokeWidth: 2, fill: 'none', stroke: 'currentColor' }}>
                <rect x="3" y="4" width="18" height="17" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              {item.year}
            </span>
          )}
          {item.year && genre && (
            <i style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.6)', display: 'inline-block' }} />
          )}
          {genre && (
            <span className="flex items-center" style={{ gap: 8 }}>
              {/* Smiley / genre icon */}
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, strokeWidth: 2, fill: 'none', stroke: 'currentColor' }}>
                <circle cx="12" cy="12" r="9"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/>
              </svg>
              {genre}
            </span>
          )}
          {item.seasons && (
            <>
              <i style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.6)', display: 'inline-block' }} />
              <span>{item.seasons} Season{item.seasons > 1 ? 's' : ''}</span>
            </>
          )}
          {item.maturity && (
            <>
              <i style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.6)', display: 'inline-block' }} />
              <span>{item.maturity}</span>
            </>
          )}
        </div>

        {/* ── Description ─────────────────────────── */}
        <p
          className="line-clamp-3"
          style={{
            maxWidth:     'min(720px,100%)',
            fontSize:     'clamp(16px,1.45vw,23px)',
            lineHeight:    1.5,
            fontWeight:    600,
            marginBottom: 'clamp(20px,2.4vw,36px)',
            textShadow:   '0 1px 12px rgba(0,0,0,.35)',
          }}
        >
          {item.description}
        </p>

        {/* ── Actions ─────────────────────────────── */}
        <div className="flex items-center" style={{ gap: 16 }}>

          {/* Play — white pill (reference exact) */}
          <button
            onClick={() => navigate(watchPath)}
            className="btn-play"
            aria-label={`Play ${item.title}`}
          >
            <Play size={18} fill="#111" stroke="#111" aria-hidden="true" />
            Play
          </button>

          {/* Glass group: + and ℹ */}
          <div className="btn-glass-group">
            <button
              onClick={() => toggleList(item)}
              aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
            >
              <Plus size={22} aria-hidden="true" />
            </button>
            <span className="sep-line" aria-hidden="true" />
            <button
              onClick={() => navigate(detailPath)}
              aria-label={`More info about ${item.title}`}
            >
              <Info size={22} aria-hidden="true" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
