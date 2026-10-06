import { useNavigate } from 'react-router-dom'
import { genres } from '../../data/genres'

export default function GenreRow() {
  const navigate = useNavigate()

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Browse by Genre</h2>
      </div>

      <div className="row genres">
        {genres.map(genre => (
          <button
            key={genre.id}
            className="genre"
            onClick={() => navigate(`/genre/${genre.slug}`)}
            aria-label={`Browse ${genre.name}`}
            style={{ background: genre.color || '#1a1a2e' }}
          >
            <img
              src={genre.backdrop}
              alt=""
              loading="lazy"
              onError={e => { e.target.style.display = 'none' }}
            />
            <span>{genre.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
