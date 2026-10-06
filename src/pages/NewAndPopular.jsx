import { useMemo } from 'react'
import ContentRow from '../components/rows/ContentRow'
import RankingCard from '../components/cards/RankingCard'
import { useTMDB } from '../hooks/useTMDB'
import { contentService } from '../services/contentService'

export default function NewAndPopular() {
  // Local fallbacks shown instantly while TMDB loads
  const localTrending  = useMemo(() => contentService.getTrendingAll(), [])
  const localNewMovies = useMemo(() => contentService.getNewReleaseMovies(), [])
  const localNewSeries = useMemo(() => contentService.getNewReleaseSeries(), [])

  // Live TMDB data
  const { data: trending }    = useTMDB('/tmdb/trending',              localTrending,  [])
  const { data: nowPlaying }  = useTMDB('/tmdb/now-playing',           localNewMovies, [])
  const { data: topRatedTV }  = useTMDB('/tmdb/top-rated?type=tv',     localNewSeries, [])
  const { data: topRated }    = useTMDB('/tmdb/top-rated?type=movie',  [],             [])

  // Top 10 from trending + topRated combined, deduplicated by tmdbId
  const top10 = useMemo(() => {
    const seen = new Set()
    return [...trending, ...topRated]
      .filter(item => {
        const k = item.tmdbId || item.id
        if (seen.has(k)) return false
        seen.add(k); return true
      })
      .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
      .slice(0, 10)
  }, [trending, topRated])

  return (
    <div className="page-top" style={{ paddingBottom: 120 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <div style={{ padding: '0 var(--pad)', marginBottom: 'clamp(24px,3vw,40px)' }}>
          <h1 style={{ fontSize: 'clamp(22px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 6 }}>
            New &amp; Popular
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>What everyone's watching right now.</p>
        </div>

        {/* Top 10 ranking */}
        {top10.length > 0 && (
          <section style={{ marginBottom: 'clamp(24px,4vw,48px)' }}>
            <div style={{ padding: '0 var(--pad)', marginBottom: 'clamp(14px,1.6vw,24px)' }}>
              <h2 style={{ fontSize: 'clamp(18px,1.7vw,26px)', fontWeight: 700, letterSpacing: '-.01em' }}>
                Top 10 This Week
              </h2>
            </div>
            <div style={{
              display: 'flex', gap: 'clamp(10px,1.4vw,18px)',
              padding: '6px var(--pad) 16px',
              overflowX: 'auto', scrollbarWidth: 'none',
            }}>
              {top10.map((item, i) => (
                <RankingCard key={item.id || item.tmdbId} item={item} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        <ContentRow title="Trending Now"          items={trending}   layout="poster" />
        <ContentRow title="New Movie Releases"    items={nowPlaying} layout="poster" />
        <ContentRow title="Top Rated TV Shows"    items={topRatedTV} layout="poster" />
      </div>
    </div>
  )
}
