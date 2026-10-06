import { Play } from 'lucide-react'
import ProgressBar from '../common/ProgressBar'

export default function EpisodeCard({ episode, progress, onPlay }) {
  if (!episode) return null

  return (
    <button
      onClick={() => onPlay?.(episode)}
      className="group w-full flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
      aria-label={`Play episode ${episode.episode}: ${episode.title}`}
    >
      {/* Thumbnail */}
      <div className="relative flex-none w-36 md:w-44 aspect-video rounded-lg overflow-hidden bg-neutral-800">
        {episode.thumbnail && (
          <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Play size={16} fill="black" className="text-black ml-0.5" />
          </div>
        </div>
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-1 pb-1">
            <ProgressBar progress={progress} height="h-1" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-white/90">
            {episode.episode}. {episode.title}
          </p>
          <span className="flex-none text-xs text-white/40">{episode.duration}</span>
        </div>
        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{episode.description}</p>
      </div>
    </button>
  )
}
