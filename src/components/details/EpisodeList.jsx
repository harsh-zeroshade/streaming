import { useNavigate } from 'react-router-dom'
import EpisodeCard from '../cards/EpisodeCard'

export default function EpisodeList({ episodes = [], seriesId, progressMap = {} }) {
  const navigate = useNavigate()

  if (!episodes.length) return (
    <p className="text-white/40 text-sm py-6">No episodes available.</p>
  )

  const handlePlay = (episode) => {
    navigate(`/watch/series/${episode.id}`)
  }

  return (
    <div className="divide-y divide-white/5">
      {episodes.map((ep) => (
        <EpisodeCard
          key={ep.id}
          episode={ep}
          progress={progressMap[ep.id]?.progress}
          onPlay={handlePlay}
        />
      ))}
    </div>
  )
}
