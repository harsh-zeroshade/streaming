import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ContentGrid from '../components/rows/ContentGrid'
import ContentRow from '../components/rows/ContentRow'
import ContinueWatchingRow from '../components/rows/ContinueWatchingRow'
import EmptyState from '../components/common/EmptyState'
import WebGLBackground from '../components/common/WebGLBackground'
import { useMyList } from '../hooks/useMyList'
import { useContinueWatching } from '../hooks/useContinueWatching'
import { contentService } from '../services/contentService'
import { Heart } from 'lucide-react'

export default function MyList() {
  const { myList } = useMyList()
  const { continueWatching } = useContinueWatching()
  const navigate = useNavigate()

  const recommended = useMemo(
    () => contentService.getAllContent()
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 8),
    []
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 120 }}>
      {/* Same green animated background as Search */}
      <WebGLBackground active={true} theme="green" />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 var(--pad)' }}>
        <h1 style={{ fontSize: 'clamp(22px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 6 }}>My List</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', marginBottom: 'clamp(20px,3vw,40px)' }}>
          {myList.length} {myList.length === 1 ? 'title' : 'titles'} saved
        </p>

        {myList.length > 0 ? (
          <ContentGrid items={myList} layout="poster" />
        ) : (
          <EmptyState
            icon={Heart}
            title="Your list is empty"
            description="Add movies and series to your list by clicking the + button on any title."
            actionLabel="Browse Content"
            onAction={() => navigate('/')}
          />
        )}

        {continueWatching.length > 0 && (
          <div style={{ margin: '48px calc(-1 * var(--pad)) 0' }}>
            <ContinueWatchingRow items={continueWatching} />
          </div>
        )}

        <div style={{ margin: '48px calc(-1 * var(--pad)) 0' }}>
          <ContentRow title="Recommended for You" items={recommended} layout="poster" />
        </div>
      </div>
    </div>
  )
}
