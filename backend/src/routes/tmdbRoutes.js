const router = require('express').Router()
const c = require('../controllers/tmdbController')

router.get('/trending',       c.trending)
router.get('/featured',       c.featured)
router.get('/now-playing',    c.nowPlaying)
router.get('/top-rated',      c.topRated)
router.get('/genres',         c.genres)
router.get('/search',         c.search)
router.get('/genre/:genre',   c.byGenre)
router.get('/movie/:id',      c.movieDetails)
router.get('/tv/:id',         c.tvDetails)
router.get('/tv/:id/season/:season', c.tvSeason)

module.exports = router
