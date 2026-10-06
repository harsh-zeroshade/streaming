import { Clock, X } from 'lucide-react'

export default function RecentSearches({ searches, onSelect, onRemove, onClear }) {
  if (!searches.length) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recent</h3>
        <button
          onClick={onClear}
          className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((term) => (
          <div
            key={term}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 group"
          >
            <Clock size={12} className="text-white/30" aria-hidden="true" />
            <button
              onClick={() => onSelect(term)}
              className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {term}
            </button>
            <button
              onClick={() => onRemove(term)}
              className="text-white/20 hover:text-white/60 transition-colors ml-1 cursor-pointer"
              aria-label={`Remove "${term}" from recent searches`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
