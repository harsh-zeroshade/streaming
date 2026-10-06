import { useNavigate } from 'react-router-dom'
import { useMyList } from '../../hooks/useMyList'
import ProgressBar from '../common/ProgressBar'

export default function ContentCard({ item, layout = 'poster', progress }) {
  const navigate = useNavigate()
  const { isInList, toggleList } = useMyList()

  if (!item) return null

  const isPoster   = layout === 'poster'
  const image      = isPoster ? item.poster : item.backdrop
  const detailPath = item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`
  const watchPath  = `/watch/${item.type}/${item.id}`
  const genre      = item.genres?.[0] ?? ''

  return (
    /* Pure CSS hover — no framer-motion, so clicks always fire reliably */
    <article
      className="card"
      tabIndex={0}
      aria-label={item.title}
      style={{ aspectRatio: isPoster ? '2/3' : '16/9', width: isPoster ? 'var(--card-w)' : 'clamp(220px,22vw,380px)' }}
      onClick={() => navigate(detailPath)}
      onKeyDown={e => e.key === 'Enter' && navigate(detailPath)}
    >
      {/* Poster */}
      <div className="poster" style={{ background: 'linear-gradient(135deg,#2a2a35,#1a1a22)', color: '#fff' }}>
        {image && <img src={image} alt="" loading="lazy" onError={e => e.target.remove()} />}
      </div>

      {/* Hover overlay — play navigates to watch, rest of overlay navigates to detail */}
      <div className="hover" onClick={() => navigate(detailPath)}>
        <span
          onClick={e => { e.stopPropagation(); navigate(watchPath) }}
          aria-label={`Play ${item.title}`}
        >
          <svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z" /></svg>
        </span>
        <b>{item.title}</b>
        <small>{item.year} <i>★</i> {item.rating}</small>
      </div>

      {/* Tag */}
      <div className="tag">
        {genre && item.year ? `${genre} · ${item.year}` : genre || item.year || ''}
      </div>

      {/* Progress bar */}
      {progress !== undefined && progress > 0 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 6px 6px' }}>
          <ProgressBar progress={progress} height="h-[3px]" />
        </div>
      )}
    </article>
  )
}
