const tmdb = require('../services/tmdbService')

// GET /api/tmdb/trending?type=all&window=week
exports.trending = async (req, res) => {
  try {
    const { type = 'all', window = 'week' } = req.query
    res.json(await tmdb.getTrending(type, window))
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/movie/:id
exports.movieDetails = async (req, res) => {
  try { res.json(await tmdb.getMovieDetails(req.params.id)) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/tv/:id
exports.tvDetails = async (req, res) => {
  try { res.json(await tmdb.getSeriesDetails(req.params.id)) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/tv/:id/season/:season
exports.tvSeason = async (req, res) => {
  try { res.json(await tmdb.getEpisodes(req.params.id, req.params.season)) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/search?q=batman
exports.search = async (req, res) => {
  try {
    const { q, page = 1 } = req.query
    if (!q) return res.status(400).json({ message: 'Query required.' })
    res.json(await tmdb.searchMulti(q, page))
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/genre/:genre?type=movie
exports.byGenre = async (req, res) => {
  try {
    const { type = 'movie' } = req.query
    res.json(await tmdb.getByGenre(req.params.genre, type))
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/genres
exports.genres = async (req, res) => {
  try { res.json(await tmdb.getGenresList()) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/featured  (trending movies + tv combined, high rated)
exports.featured = async (req, res) => {
  try {
    const [movies, tv] = await Promise.all([
      tmdb.getTrending('movie', 'week'),
      tmdb.getTrending('tv', 'week'),
    ])
    const combined = [...movies.slice(0, 5), ...tv.slice(0, 5)]
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 8)
    res.json(combined)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/now-playing
exports.nowPlaying = async (req, res) => {
  try { res.json(await tmdb.getNowPlaying()) }
  catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/tmdb/top-rated?type=movie
exports.topRated = async (req, res) => {
  try {
    const { type = 'movie' } = req.query
    res.json(await tmdb.getTopRated(type))
  } catch (err) { res.status(500).json({ message: err.message }) }
}
