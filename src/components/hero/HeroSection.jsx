import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyList } from '../../hooks/useMyList'

const TINT = {
  'movie-001': '#33402f', 'movie-002': '#5a2a14', 'movie-003': '#4b3a2a',
  'movie-004': '#6a4220', 'movie-005': '#3a1a1a', 'series-001': '#1d2f66',
  'series-002': '#2c3a30', 'series-003': '#3a3a3f', 'series-006': '#2a2a1a',
}

export default function HeroSection({ items = [] }) {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const navigate = useNavigate()
  const { isInList, toggleList } = useMyList()

  useEffect(() => {
    const el = document.getElementById('ambient')
    if (!el || !items[active]) return
    const tint = TINT[items[active].id] || '#3a3020'
    el.style.background = `radial-gradient(120% 80% at 30% 40%, ${tint}, transparent 70%), var(--bg)`
  }, [active, items])

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => { setActive(i => (i + 1) % items.length); setFading(false) }, 400)
    }, 7000)
    return () => clearInterval(t)
  }, [items.length])

  if (!items.length) return null

  const goTo = (i) => {
    if (i === active) return
    setFading(true)
    setTimeout(() => { setActive(i); setFading(false) }, 400)
  }

  const item   = items[active]
  const inList = isInList(item?.id)
  const watch  = item ? `/watch/${item.type}/${item.id}` : '#'
  const detail = item ? (item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`) : '#'
  const genre  = item?.genres?.[0] ?? ''

  /* ── shared inline style objects ── */
  const s = {
    rel: { position: 'relative', zIndex: 1 },
    svgIcon: { display: 'block', width: '1em', height: '1em', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 },
    dot: { display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.6)', flexShrink: 0 },
  }

  return (
    <section
      aria-label="Featured"
      style={{
        position: 'relative',
        minHeight: 'clamp(560px, 100vh, 960px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Full-bleed backdrop ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        opacity: fading ? 0 : 1, transition: 'opacity .6s',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: item?.backdrop ? `url(${item.backdrop})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }} />
        {/* gradient overlays: darken bottom + left so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.0) 30%, rgba(0,0,0,.55) 68%, rgba(0,0,0,.88) 100%)',
            'linear-gradient(to right, rgba(0,0,0,.5) 0%, rgba(0,0,0,.15) 55%, transparent 80%)',
          ].join(', '),
        }} />
      </div>

      {/* ── Spacer — pushes content toward the bottom ── */}
      <div style={{ flex: 1, minHeight: 80 }} />

      {/* ── Content area ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '0 var(--pad)',
        marginBottom: 20,
      }}>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Bowlby One', Impact, sans-serif",
          fontSize: 'clamp(36px, 5.5vw, 96px)',
          fontWeight: 400,
          lineHeight: 0.92,
          letterSpacing: '-.02em',
          color: '#e3d9c0',
          transform: 'rotate(-2deg)',
          transformOrigin: 'left bottom',
          marginBottom: 'clamp(12px,1.6vw,22px)',
          textShadow: '0 4px 20px rgba(0,0,0,.5)',
          maxWidth: '65%',
        }}>
          {item?.title}
        </h1>

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          fontSize: 'clamp(12px,1vw,16px)', fontWeight: 500,
          marginBottom: 'clamp(10px,1vw,16px)',
          color: '#fff',
        }}>
          {item?.rating && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" style={{ ...s.svgIcon, fill: '#fff', stroke: '#fff' }}>
                <path d="m12 2 3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z" />
              </svg>
              {item.rating}/10
            </span>
          )}
          {item?.rating && item?.year && <i style={s.dot} />}
          {item?.year && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" style={s.svgIcon}>
                <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {item.year}
            </span>
          )}
          {item?.year && genre && <i style={s.dot} />}
          {genre && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" style={s.svgIcon}>
                <circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01" />
              </svg>
              {genre}
            </span>
          )}
          {item?.seasons && (
            <><i style={s.dot} /><span>{item.seasons} Season{item.seasons > 1 ? 's' : ''}</span></>
          )}
          {item?.maturity && (
            <><i style={s.dot} /><span>{item.maturity}</span></>
          )}
        </div>

        {/* Description */}
        <p style={{
          maxWidth: 'min(560px,58%)',
          fontSize: 'clamp(12px,1.05vw,16px)',
          lineHeight: 1.65,
          fontWeight: 500,
          marginBottom: 'clamp(14px,1.6vw,24px)',
          textShadow: '0 1px 10px rgba(0,0,0,.5)',
          color: 'rgba(255,255,255,.9)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item?.description}
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(watch)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              height: 'clamp(42px,3.2vw,54px)',
              padding: '0 clamp(18px,1.8vw,30px)',
              borderRadius: 999,
              background: '#fff', color: '#111',
              fontWeight: 600, fontSize: 'clamp(13px,1.1vw,17px)',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.88)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <svg viewBox="0 0 24 24" style={{ fill: '#111', stroke: '#111', width: '1em', height: '1em', flexShrink: 0 }}>
              <path d="M6 4v16l14-8z" />
            </svg>
            Play
          </button>

          <div style={{
            display: 'inline-flex', alignItems: 'center',
            height: 'clamp(42px,3.2vw,54px)', borderRadius: 999,
            background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.1)',
          }}>
            <button
              onClick={() => item && toggleList(item)}
              aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              style={{
                width: 'clamp(50px,3.8vw,70px)', height: '100%',
                display: 'grid', placeItems: 'center', borderRadius: 999,
                background: inList ? '#fff' : 'transparent',
                color: inList ? '#111' : '#fff', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!inList) e.currentTarget.style.background = 'rgba(255,255,255,.12)' }}
              onMouseLeave={e => { if (!inList) e.currentTarget.style.background = 'transparent' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '1.4em', height: '1.4em', fill: 'none', stroke: 'currentColor', strokeWidth: 2, flexShrink: 0 }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,.2)', flexShrink: 0 }} />
            <button
              onClick={() => navigate(detail)}
              aria-label="More info"
              style={{
                width: 'clamp(50px,3.8vw,70px)', height: '100%',
                display: 'grid', placeItems: 'center', borderRadius: 999,
                background: 'transparent', color: '#fff', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg viewBox="0 0 24 24" style={{ width: '1.4em', height: '1.4em', fill: 'none', stroke: 'currentColor', strokeWidth: 2, flexShrink: 0 }}>
                <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Thumbnail strip — always at the very bottom, never overlaps content ── */}
      {items.length > 1 && (
        <div style={{
          position: 'relative', zIndex: 2,
          padding: '12px var(--pad) clamp(14px,2vh,24px)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          /* subtle gradient behind the strip for legibility */
          background: 'linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)',
        }}>
          {/* Scrollable thumbnail row */}
          <div style={{
            display: 'flex', gap: 8, flex: 1,
            overflowX: 'auto', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide: ${it.title}`}
                style={{
                  flexShrink: 0,
                  width:  i === active ? 'clamp(90px,9vw,130px)' : 'clamp(72px,7.5vw,108px)',
                  height: i === active ? 'clamp(54px,5.4vw,76px)' : 'clamp(44px,4.4vw,62px)',
                  borderRadius: 9,
                  overflow: 'hidden',
                  border: i === active ? '2px solid rgba(255,255,255,.85)' : '2px solid rgba(255,255,255,.15)',
                  cursor: 'pointer', padding: 0,
                  transition: 'width .3s, height .3s, border-color .3s, box-shadow .3s',
                  boxShadow: i === active
                    ? '0 0 0 3px rgba(255,255,255,.2), 0 4px 14px rgba(0,0,0,.6)'
                    : '0 2px 6px rgba(0,0,0,.45)',
                  position: 'relative', alignSelf: 'center',
                  background: '#111',
                }}
              >
                {(it.poster || it.backdrop) ? (
                  <img
                    src={it.poster || it.backdrop}
                    alt={it.title}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      filter: i === active ? 'none' : 'brightness(.55)',
                      transition: 'filter .3s',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', background: 'rgba(255,255,255,.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: 'rgba(255,255,255,.35)',
                    padding: '0 4px', textAlign: 'center', lineHeight: 1.2,
                  }}>
                    {it.title}
                  </div>
                )}
                {i === active && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 3, background: '#fff', borderRadius: '0 0 7px 7px',
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Next → button */}
          <button
            onClick={() => goTo((active + 1) % items.length)}
            aria-label="Next slide"
            style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.22)', color: '#fff',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
          >
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
