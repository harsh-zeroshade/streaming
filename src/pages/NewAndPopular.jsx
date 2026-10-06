import { useMemo } from 'react'
import ContentRow from '../components/rows/ContentRow'
import RankingCard from '../components/cards/RankingCard'
import { contentService } from '../services/contentService'

export default function NewAndPopular() {
  const trending  = useMemo(() => contentService.getTrendingAll(), [])
  const newMovies = useMemo(() => contentService.getNewReleaseMovies(), [])
  const newSeries = useMemo(() => contentService.getNewReleaseSeries(), [])
  const top10     = useMemo(() =>
    contentService.getAllContent()
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 10), []
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 120 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <div style={{ padding: '0 var(--pad)', marginBottom: 'clamp(24px,3vw,40px)' }}>
          <h1 style={{ fontSize: 'clamp(22px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 6 }}>New &amp; Popular</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>What everyone's watching right now.</p>
        </div>

        {/* Top 10 ranking */}
        <section style={{ marginBottom: 'clamp(24px,4vw,48px)' }}>
          <div style={{ padding: '0 var(--pad)', marginBottom: 'clamp(14px,1.6vw,24px)' }}>
            <h2 style={{ fontSize: 'clamp(18px,1.7vw,26px)', fontWeight: 700, letterSpacing: '-.01em' }}>Top 10 This Week</h2>
          </div>
          <div style={{
            display: 'flex', gap: 'clamp(10px,1.4vw,18px)',
            padding: '6px var(--pad) 16px',
            overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {top10.map((item, i) => (
              <RankingCard key={item.id} item={item} rank={i + 1} />
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ContentRow title="Trending Now"        items={trending}   layout="poster" />
          <ContentRow title="New Movie Releases"  items={newMovies}  layout="poster" />
          <ContentRow title="New Series"          items={newSeries}  layout="poster" />
        </div>

      </div>
    </div>
  )
}
