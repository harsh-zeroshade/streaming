const WatchProgress = require('../models/WatchProgress')

// GET /api/progress
exports.getProgress = async (req, res) => {
  try {
    const doc = await WatchProgress.findOne({ user: req.user._id })
    res.json({ progress: doc?.progress || [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/progress
exports.saveProgress = async (req, res) => {
  try {
    const { contentId, type, title, poster, backdrop,
            progressSeconds, durationMinutes, season, episode, episodeId } = req.body

    if (!contentId) return res.status(400).json({ message: 'contentId required.' })

    const pct = durationMinutes > 0
      ? Math.min(100, Math.round((progressSeconds / (durationMinutes * 60)) * 100))
      : 0

    let doc = await WatchProgress.findOne({ user: req.user._id })
    if (!doc) doc = await WatchProgress.create({ user: req.user._id, progress: [] })

    const idx = doc.progress.findIndex(p => p.contentId === contentId)
    const entry = { contentId, type, title, poster, backdrop,
                    progressSeconds, durationMinutes, progress: pct,
                    season, episode, episodeId, updatedAt: new Date() }

    if (idx !== -1) doc.progress[idx] = entry
    else doc.progress.unshift(entry)

    await doc.save()
    res.json({ entry })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/progress/:contentId
exports.deleteProgress = async (req, res) => {
  try {
    const doc = await WatchProgress.findOne({ user: req.user._id })
    if (doc) {
      doc.progress = doc.progress.filter(p => p.contentId !== req.params.contentId)
      await doc.save()
    }
    res.json({ message: 'Removed.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
