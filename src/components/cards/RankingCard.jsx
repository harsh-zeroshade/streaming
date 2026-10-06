import { useNavigate } from 'react-router-dom'

export default function RankingCard({ item, rank }) {
  const navigate = useNavigate()
  const detailPath = item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`

  return (
    <div
      className="group relative flex-none w-44 md:w-52 cursor-pointer"
      onClick={() => navigate(detailPath)}
      role="article"
      aria-label={`#${rank} ${item.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800">
        {item.poster && (
          <img src={item.poster} alt={item.title} className="w-full h-full object-cover card-hover" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Large rank number */}
      <div className="absolute -bottom-3 -left-2 flex items-end">
        <span
          className="text-8xl font-black leading-none select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255,255,255,0.15)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {rank}
        </span>
      </div>

      <div className="mt-6 pl-1">
        <p className="text-xs font-medium text-white/70 line-clamp-1">{item.title}</p>
      </div>
    </div>
  )
}
