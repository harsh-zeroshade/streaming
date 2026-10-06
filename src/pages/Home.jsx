import { useMemo } from 'react'
import HeroSection from '../components/hero/HeroSection'
import ContentRow from '../components/rows/ContentRow'
import ContinueWatchingRow from '../components/rows/ContinueWatchingRow'
import GenreRow from '../components/rows/GenreRow'
import { useTMDB } from '../hooks/useTMDB'
import { useContinueWatching } from '../hooks/useContinueWatching'

// Local fallbacks (shown instantly, replaced by real data)
import { getFeaturedMovies, getTrendingMovies, getNewReleaseMovies } from '../data/movies'
import { getFeaturedSeries, getTrendingSeries } from '../data/series'

const localFeatured = [...getFeaturedMovies(), ...getFeaturedSeries()]
const localTrendingMovies = getTrendingMovies()
const localTrendingSeries = getTrendingSeries()
const localNewReleases = getNewReleaseMovies()

export default function Home() {
  const { continueWatching } = useContinueWatching()

  const { data: featured }       = useTMDB('/tmdb/featured',                  localFeatured,       [])
  const { data: trendingMovies } = useTMDB('/tmdb/trending?type=movie',       localTrendingMovies, [])
  const { data: trendingSeries } = useTMDB('/tmdb/trending?type=tv',          localTrendingSeries, [])
  const { data: newReleases }    = useTMDB('/tmdb/now-playing',               localNewReleases,    [])
  const { data: recommended }    = useTMDB('/tmdb/top-rated?type=movie',      [],                  [])

  return (
    <>
      <HeroSection items={featured.slice(0, 8)} />

      <main>
        {continueWatching.length > 0 && (
          <ContinueWatchingRow items={continueWatching} />
        )}
        <ContentRow title="Trending Movies"     items={trendingMovies} layout="poster" viewAllPath="/movies" />
        <ContentRow title="Trending Series"     items={trendingSeries} layout="poster" viewAllPath="/series" />
        <ContentRow title="New Releases"        items={newReleases}    layout="poster" viewAllPath="/new-popular" />
        <ContentRow title="Top Rated"           items={recommended}    layout="poster" />
        <GenreRow />
      </main>
    </>
  )
}
