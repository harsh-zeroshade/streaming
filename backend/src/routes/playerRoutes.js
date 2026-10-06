const router = require('express').Router()
const { movieEmbed, tvEmbed } = require('../controllers/playerController')

router.get('/movie/:tmdbId',                      movieEmbed)
router.get('/tv/:tmdbId/:season/:episode',        tvEmbed)

module.exports = router
