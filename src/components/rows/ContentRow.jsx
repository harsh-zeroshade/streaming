import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ContentCard from '../cards/ContentCard'

export default function ContentRow({ title, items = [], layout = 'poster', viewAllPath }) {
  const navigate = useNavigate()
  const rowRef   = useRef(null)

  if (!items.length) return null

  const scrollNext = () => {
    const r = rowRef.current
    if (r) r.scrollBy({ left: r.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        {viewAllPath && (
          <a href="#" className="view-all"
            onClick={e => { e.preventDefault(); navigate(viewAllPath) }}>
            View All
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        )}
      </div>

      {/* reference: .row-wrap wraps .row + .next scroll button */}
      <div className="row-wrap">
        <div className="row" ref={rowRef}>
          {items.map(item => (
            <ContentCard key={item.id} item={item} layout={layout} />
          ))}
        </div>
        <button className="next" onClick={scrollNext} aria-label="Scroll right">
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: 'none', stroke: '#fff', strokeWidth: 2 }}>
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
