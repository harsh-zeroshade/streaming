/**
 * VidCore player URL builder.
 * VidCore embeds via:  https://vidcore.xyz/embed/movie/{tmdbId}
 *                      https://vidcore.xyz/embed/tv/{tmdbId}/{season}/{episode}
 *
 * GET /api/player/movie/:tmdbId
 * GET /api/player/tv/:tmdbId/:season/:episode
 */
const BASE = () => process.env.VIDCORE_BASE_URL || 'https://vidsrc.me'

exports.movieEmbed = (req, res) => {
  const { tmdbId } = req.params
  if (!tmdbId) return res.status(400).json({ message: 'tmdbId required.' })
  const embedUrl = `${BASE()}/embed/movie/${tmdbId}`
  res.json({ embedUrl })
}

exports.tvEmbed = (req, res) => {
  const { tmdbId, season = 1, episode = 1 } = req.params
  if (!tmdbId) return res.status(400).json({ message: 'tmdbId required.' })
  const embedUrl = `${BASE()}/embed/tv/${tmdbId}/${season}/${episode}`
  res.json({ embedUrl })
}
