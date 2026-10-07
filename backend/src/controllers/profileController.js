const Profile = require('../models/Profile')

// GET /api/profiles — get all profiles for current user
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user._id }).sort('order createdAt')
    res.json({ profiles })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/profiles — create a profile
exports.createProfile = async (req, res) => {
  try {
    const { name, avatar, color, isKids, language } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Profile name is required.' })

    const count = await Profile.countDocuments({ user: req.user._id })
    if (count >= 5) return res.status(400).json({ message: 'Maximum 5 profiles allowed.' })

    const profile = await Profile.create({
      user: req.user._id,
      name: name.trim(),
      avatar: avatar || null,
      color: color || '#6366f1',
      isKids: !!isKids,
      language: language || 'English',
      order: count,
    })
    res.status(201).json({ profile })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/profiles/:id — update a profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, user: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Profile not found.' })

    const { name, avatar, color, isKids, language } = req.body
    if (name !== undefined)     profile.name     = name.trim()
    if (avatar !== undefined)   profile.avatar   = avatar
    if (color !== undefined)    profile.color    = color
    if (isKids !== undefined)   profile.isKids   = isKids
    if (language !== undefined) profile.language = language
    await profile.save()

    res.json({ profile })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/profiles/:id — delete a profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Profile not found.' })
    res.json({ message: 'Profile deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
