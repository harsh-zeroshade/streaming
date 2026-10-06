/**
 * Content service — sync API matching the original interface.
 * Uses local mock data immediately (so pages render instantly),
 * and provides separate async helpers for TMDB live data.
 */
import { api } from './apiService'
import {
  movies,
  getFeaturedMovies, getTrendingMovies, getNewReleaseMovies, getMoviesByGenre,
} from '../data/movies'
import {
  series,
  getFeaturedSeries, getTrendingSeries, getNewReleaseSeries, getSeriesByGenre,
} from '../data/series'
import { getEpisodes, getEpisodeById, getNextEpisode, getPrevEpisode } from '../data/episodes'
import { searchContent } from '../utils/filterContent'

/** Extract numeric TMDB id from an id string like "tmdb-movie-550" */
export const extractTmdbId = (item) => {
  if (!item) return null
  if (item.tmdbId) return String(item.tmdbId)
  const m = String(item.id || '').match(/(\d+)$/)
  return m ? m[1] : null
}

// ─────────────────────────────────────────────────────────────────
// SYNC content service — identical interface to the original.
// All pages keep working with local data immediately.
// ─────────────────────────────────────────────────────────────────
export const contentService = {
  // ── Movies ──────────────────────────────────────────────────────
  getAllMovies:       () => movies,
  getMovieById:      (id) => movies.find(m => m.id === id) || null,
  getTrendingMovies: () => getTrendingMovies(),
  getFeaturedMovies: () => getFeaturedMovies(),
  getNewReleaseMovies: () => getNewReleaseMovies(),
  getMoviesByGenre:  (genre) => getMoviesByGenre(genre),

  // ── Series ──────────────────────────────────────────────────────
  getAllSeries:       () => series,
  getSeriesById:     (id) => series.find(s => s.id === id) || null,
  getTrendingSeries: () => getTrendingSeries(),
  getFeaturedSeries: () => getFeaturedSeries(),
  getNewReleaseSeries: () => getNewReleaseSeries(),
  getSeriesByGenre:  (genre) => getSeriesByGenre(genre),

  // ── Mixed ────────────────────────────────────────────────────────
  getAllContent:  () => [...movies, ...series],
  getFeaturedAll: () => [...getFeaturedMovies(), ...getFeaturedSeries()],
  getTrendingAll: () => [...getTrendingMovies(), ...getTrendingSeries()],

  // ── Episodes ─────────────────────────────────────────────────────
  getEpisodes,
  getEpisodeById,
  getNextEpisode,
  getPrevEpisode,

  // ── Search ───────────────────────────────────────────────────────
  search: (query) => searchContent([...movies, ...series], query),

  // ── Related ──────────────────────────────────────────────────────
  getRelated: (item, limit = 8) => {
    const pool = item.type === 'movie' ? movies : series
    return pool
      .filter(i => i.id !== item.id && i.genres?.some(g => item.genres?.includes(g)))
      .slice(0, limit)
  },
}

// ─────────────────────────────────────────────────────────────────
// ASYNC TMDB helpers — used only where live data is explicitly needed.
// These do NOT replace the sync methods above.
// ─────────────────────────────────────────────────────────────────
export const tmdbService = {
  search: async (query) => {
    if (!query?.trim()) return []
    try {
      return await api.get(`/tmdb/search?q=${encodeURIComponent(query)}`)
    } catch {
      return searchContent([...movies, ...series], query)
    }
  },

  getTrending: async (type = 'all') => {
    try { return await api.get(`/tmdb/trending?type=${type}&window=week`) }
    catch { return type === 'movie' ? getTrendingMovies() : getTrendingSeries() }
  },

  getMovieDetails: async (tmdbId) => {
    try { return await api.get(`/tmdb/movie/${tmdbId}`) }
    catch { return null }
  },

  getSeriesDetails: async (tmdbId) => {
    try { return await api.get(`/tmdb/tv/${tmdbId}`) }
    catch { return null }
  },

  getEpisodes: async (tmdbId, season) => {
    try { return await api.get(`/tmdb/tv/${tmdbId}/season/${season}`) }
    catch { return [] }
  },

  getFeatured: async () => {
    try { return await api.get('/tmdb/featured') }
    catch { return [...getFeaturedMovies(), ...getFeaturedSeries()] }
  },

  getByGenre: async (genreName, type = 'movie') => {
    try { return await api.get(`/tmdb/genre/${encodeURIComponent(genreName)}?type=${type}`) }
    catch { return [] }
  },

  getEmbedUrl: (item, season = 1, episode = 1) => {
    const base = import.meta.env.VITE_VIDCORE_BASE_URL || 'https://vidsrc.me'
    const tmdbId = extractTmdbId(item) || item?.tmdbId
    if (!tmdbId) return item?.trailer || null
    if (item?.type === 'movie') return `${base}/embed/movie/${tmdbId}`
    return `${base}/embed/tv/${tmdbId}/${season}/${episode}`
  },
}
