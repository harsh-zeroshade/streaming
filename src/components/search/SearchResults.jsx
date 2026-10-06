import { useNavigate } from 'react-router-dom'
import { Play, Star } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import { Search } from 'lucide-react'

export default function SearchResults({ results, query }) {
  const navigate = useNavigate()

  if (!results.length) {
    return (
      <EmptyState
        icon={Search}
        title={`No results for "${query}"`}
        description="Try different keywords, a genre name, or a cast member."
      />
    )
  }

  return (
    <div>
      <p className="text-sm text-white/40 mb-4">
        {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((item) => {
          const detailPath = item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`
          const watchPath = `/watch/${item.type}/${item.id}`
          return (
            <div
              key={item.id}
              className="flex gap-3 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 rounded-xl p-3 transition-all cursor-pointer group"
              onClick={() => navigate(detailPath)}
              role="article"
              aria-label={item.title}
            >
              <div className="flex-none w-20 aspect-[2/3] rounded-lg overflow-hidden bg-neutral-800">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="font-semibold text-white text-sm line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5 mb-2">
                  <span className="text-xs text-white/40">{item.year}</span>
                  <span className="text-xs text-white/30 capitalize">{item.type}</span>
                  {item.rating && (
                    <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                      <Star size={9} fill="currentColor" />{item.rating}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{item.description}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(watchPath) }}
                  className="mt-2 flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  <Play size={11} fill="currentColor" /> Play
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
