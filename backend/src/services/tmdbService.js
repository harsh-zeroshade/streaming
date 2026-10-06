const https = require('https')

const BASE = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const KEY  = process.env.TMDB_API_KEY

// Fresh agent per request — avoids connection reuse / keepAlive issues on Windows
const makeAgent = () => new https.Agent({ keepAlive: false, rejectUnauthorized: true })

/** HTTPS GET with automatic retries on ECONNRESET */
const get = (url, retries = 3) => new Promise((resolve, reject) => {
  const attempt = (remaining) => {
    const req = https.get(url, {
      agent: makeAgent(),
      headers: { accept: 'application/json' },
    }, (res) => {
      let raw = ''
      res.on('data', c => { raw += c })
      res.on('end', () => {
        try {
          const json = JSON.parse(raw)
          if (res.statusCode >= 400) return reject(new Error(`TMDB ${res.statusCode}: ${json.status_message || res.statusMessage}`))
          resolve(json)
        } catch (e) {
          reject(new Error('TMDB parse error: ' + e.message))
        }
      })
    })
    req.on('error', (err) => {
      if ((err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') && remaining > 0) {
        console.warn(`TMDB retry (${remaining} left): ${err.code}`)
        setTimeout(() => attempt(remaining - 1), 400)
      } else {
        reject(err)
      }
    })
    req.setTimeout(12000, () => { req.destroy(); reject(new Error('TMDB timeout')) })
  }
  attempt(retries)
})

const tmdb = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('api_key', KEY)
  Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(String(k), String(v)))
  return get(url.toString())
}

// ── helpers ──────────────────────────────────────────────────────
const IMG   = p => p ? `https://image.tmdb.org/t/p/original${p}` : null
const THUMB = p => p ? `https://image.tmdb.org/t/p/w500${p}`     : null

const normaliseMovie = m => ({
  id:              `tmdb-movie-${m.id}`,
  tmdbId:          m.id,
  type:            'movie',
  title:           m.title || m.original_title,
  description:     m.overview,
  year:            m.release_date ? parseInt(m.release_date) : null,
  rating:          m.vote_average ? m.vote_average.toFixed(1) : null,
  poster:          THUMB(m.poster_path),
  backdrop:        IMG(m.backdrop_path),
  genres:          (m.genres || []).map(g => g.name).filter(Boolean),
  duration:        m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : null,
  durationMinutes: m.runtime || null,
  language:        m.original_language?.toUpperCase(),
  maturity:        m.adult ? '18+' : '13+',
  featured:        (m.vote_average || 0) >= 7.5,
  trending:        true,
  newRelease:      false,
  director:        m.credits?.crew?.find(c => c.job === 'Director')?.name || null,
  cast:            (m.credits?.cast || []).slice(0, 6).map(c => c.name),
  trailer: (() => {
    const t = m.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    return t ? `https://www.youtube.com/embed/${t.key}` : null
  })(),
})

const normaliseSeries = s => ({
  id:             `tmdb-series-${s.id}`,
  tmdbId:         s.id,
  type:           'series',
  title:          s.name || s.original_name,
  description:    s.overview,
  year:           s.first_air_date ? parseInt(s.first_air_date) : null,
  rating:         s.vote_average ? s.vote_average.toFixed(1) : null,
  poster:         THUMB(s.poster_path),
  backdrop:       IMG(s.backdrop_path),
  genres:         (s.genres || []).map(g => g.name).filter(Boolean),
  seasons:        s.number_of_seasons || null,
  totalEpisodes:  s.number_of_episodes || null,
  language:       s.original_language?.toUpperCase(),
  maturity:       '13+',
  featured:       (s.vote_average || 0) >= 7.5,
  trending:       true,
  newRelease:     false,
  status:         s.status?.toLowerCase() === 'ended' ? 'complete' : 'ongoing',
  cast:           (s.credits?.cast || []).slice(0, 6).map(c => c.name),
  trailer: (() => {
    const t = s.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    return t ? `https://www.youtube.com/embed/${t.key}` : null
  })(),
})

const normaliseEpisode = (ep, seriesId) => ({
  id:          `tmdb-ep-${seriesId}-s${ep.season_number}e${ep.episode_number}`,
  tmdbId:      ep.id,
  seriesId:    `tmdb-series-${seriesId}`,
  type:        'episode',
  title:       ep.name,
  description: ep.overview,
  season:      ep.season_number,
  episode:     ep.episode_number,
  thumbnail:   THUMB(ep.still_path),
  runtime:     ep.runtime,
  rating:      ep.vote_average?.toFixed(1),
  airDate:     ep.air_date,
})

const normaliseAny = item => {
  const mt = item.media_type
  if (mt === 'tv'    || (!mt && item.name))  return normaliseSeries(item)
  if (mt === 'movie' || (!mt && item.title)) return normaliseMovie(item)
  return null
}

// ── public API ───────────────────────────────────────────────────

exports.getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  const data = await tmdb(`/trending/${mediaType}/${timeWindow}`)
  return data.results.map(normaliseAny).filter(Boolean)
}

exports.getMovieDetails = async (id) => {
  const data = await tmdb(`/movie/${id}`, { append_to_response: 'credits,videos' })
  return normaliseMovie(data)
}

exports.getSeriesDetails = async (id) => {
  const data = await tmdb(`/tv/${id}`, { append_to_response: 'credits,videos' })
  return normaliseSeries(data)
}

exports.getEpisodes = async (id, season) => {
  const data = await tmdb(`/tv/${id}/season/${season}`)
  return (data.episodes || []).map(ep => normaliseEpisode(ep, id))
}

exports.searchMulti = async (query, page = 1) => {
  const data = await tmdb('/search/multi', { query, page, include_adult: false })
  return data.results
    .filter(i => i.media_type !== 'person' && (i.title || i.name))
    .map(normaliseAny)
    .filter(Boolean)
}

exports.getByGenre = async (genreName, type = 'movie') => {
  const list  = await tmdb(`/genre/${type}/list`)
  const genre = list.genres.find(g => g.name.toLowerCase() === genreName.toLowerCase())
  if (!genre) return []
  const ep   = type === 'movie' ? '/discover/movie' : '/discover/tv'
  const data = await tmdb(ep, { with_genres: genre.id, sort_by: 'popularity.desc' })
  const norm = type === 'movie' ? normaliseMovie : normaliseSeries
  return data.results.map(norm)
}

exports.getGenresList = async () => {
  const [mov, tv] = await Promise.all([tmdb('/genre/movie/list'), tmdb('/genre/tv/list')])
  const all = {}
  ;[...mov.genres, ...tv.genres].forEach(g => { all[g.name] = g })
  return Object.values(all)
}

exports.getNowPlaying = async () => {
  const data = await tmdb('/movie/now_playing')
  return data.results.map(normaliseMovie)
}

exports.getTopRated = async (type = 'movie') => {
  const ep   = type === 'movie' ? '/movie/top_rated' : '/tv/top_rated'
  const data = await tmdb(ep)
  const norm = type === 'movie' ? normaliseMovie : normaliseSeries
  return data.results.map(norm)
}
