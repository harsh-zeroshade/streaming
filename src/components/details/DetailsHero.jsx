import { useNavigate } from 'react-router-dom'
import { useMyList } from '../../hooks/useMyList'

/**
 * Reference .d2-hero — full-bleed backdrop + poster thumbnail + info row at bottom
 */
export default function DetailsHero({ item }) {
  const navigate = useNavigate()
  const { isInList, toggleList } = useMyList()

  if (!item) return null

  const inList    = isInList(item.id)
  const watchPath = `/watch/${item.type}/${item.id}`

  return (
    <section className="d2-hero">
      {/* Backdrop — .d-bg with mask-image */}
      <div className="d-bg" style={{ background: item.backdrop ? undefined : 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
        {item.backdrop && (
          <img src={item.backdrop} alt="" aria-hidden="true" />
        )}
      </div>

      {/* Bottom row — .d2-in */}
      <div className="d2-in">

        {/* Poster thumbnail — .d2-poster */}
        <div
          className="d2-poster"
          style={{ background: 'linear-gradient(135deg,#2a2a35,#1a1a22)', color: '#fff' }}
        >
          {item.poster && (
            <img src={item.poster} alt={`${item.title} poster`} onError={e => e.target.remove()} />
          )}
          <b>{item.title}</b>
        </div>

        {/* Info — .d2-info */}
        <div className="d2-info">

          {/* Genre tags + maturity — .d2-tags */}
          <div className="d2-tags">
            {item.genres?.map(g => <span key={g}>{g}</span>)}
            {item.maturity && <em>{item.maturity}</em>}
          </div>

          {/* Title — Bowlby One, reference .d2 .title-art .t-plain */}
          <h1
            className="title-art t-plain"
            aria-label={item.title}
          >
            <span className="ti">{item.title}</span>
          </h1>

          {/* Meta — .d2-meta */}
          <div className="d2-meta">
            {[
              item.year,
              item.duration || (item.seasons ? `${item.seasons} Season${item.seasons > 1 ? 's' : ''}` : null),
              item.language,
              item.country,
            ].filter(Boolean).map((val, i) => (
              <span key={i}>{val}</span>
            ))}
            {item.rating && <span className="g">★ {item.rating}</span>}
          </div>

          {/* Description — .d2-desc */}
          <p className="d2-desc">{item.description}</p>

          {/* Actions — reference .actions: Play pill + glass group side by side */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* White play pill */}
            <button
              className="btn-play"
              onClick={() => navigate(watchPath)}
              aria-label={`Play ${item.title}`}
            >
              <svg viewBox="0 0 24 24" style={{ fill: '#111', stroke: '#111', width: '1.1em', height: '1.1em', flexShrink: 0 }}>
                <path d="M6 4v16l14-8z" />
              </svg>
              Play
            </button>

            {/* Glass + / ℹ group */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              height: 'clamp(48px,3.8vw,65px)',
              borderRadius: 999,
              background: 'rgba(255,255,255,.14)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.08)',
            }}>
              {/* + button */}
              <button
                onClick={() => toggleList(item)}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                style={{
                  width: 'clamp(56px,4.5vw,80px)', height: '100%',
                  display: 'grid', placeItems: 'center',
                  borderRadius: 999,
                  background: inList ? '#fff' : 'transparent',
                  color: inList ? '#111' : '#fff',
                  cursor: 'pointer', border: 'none',
                  transition: 'background .2s',
                }}
                onMouseEnter={e => { if (!inList) e.currentTarget.style.background = 'rgba(255,255,255,.12)' }}
                onMouseLeave={e => { if (!inList) e.currentTarget.style.background = 'transparent' }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '1.5em', height: '1.5em', fill: 'none', stroke: 'currentColor', strokeWidth: 2, flexShrink: 0 }}>
                  {inList
                    ? <path d="M20 6 9 17l-5-5" />
                    : <path d="M12 5v14M5 12h14" />}
                </svg>
              </button>

              {/* Divider */}
              <span style={{ width: 1, height: 28, background: 'rgba(255,255,255,.2)', flexShrink: 0 }} />

              {/* ℹ button */}
              <button
                onClick={() => document.getElementById('d2body')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="More info"
                style={{
                  width: 'clamp(56px,4.5vw,80px)', height: '100%',
                  display: 'grid', placeItems: 'center',
                  borderRadius: 999,
                  background: 'transparent', color: '#fff',
                  cursor: 'pointer', border: 'none',
                  transition: 'background .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg viewBox="0 0 24 24" style={{ width: '1.5em', height: '1.5em', fill: 'none', stroke: 'currentColor', strokeWidth: 2, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
