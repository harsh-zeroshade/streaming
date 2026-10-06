const MyList = require('../models/MyList')

// GET /api/mylist
exports.getList = async (req, res) => {
  try {
    const doc = await MyList.findOne({ user: req.user._id })
    res.json({ items: doc?.items || [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/mylist
exports.addItem = async (req, res) => {
  try {
    const item = req.body
    if (!item?.contentId || !item?.type)
      return res.status(400).json({ message: 'contentId and type are required.' })

    let doc = await MyList.findOne({ user: req.user._id })
    if (!doc) doc = await MyList.create({ user: req.user._id, items: [] })

    const exists = doc.items.some(i => i.contentId === item.contentId)
    if (!exists) {
      doc.items.unshift({ ...item, addedAt: new Date() })
      await doc.save()
    }
    res.json({ items: doc.items })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/mylist/:contentId
exports.removeItem = async (req, res) => {
  try {
    const doc = await MyList.findOne({ user: req.user._id })
    if (doc) {
      doc.items = doc.items.filter(i => i.contentId !== req.params.contentId)
      await doc.save()
    }
    res.json({ items: doc?.items || [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
