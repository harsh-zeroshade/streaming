const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true, trim: true, maxlength: 20 },
  avatar:    { type: String, default: null },        // URL or null (uses gradient)
  color:     { type: String, default: '#6366f1' },   // gradient seed color
  isKids:    { type: Boolean, default: false },
  language:  { type: String, default: 'English' },
  order:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Max 5 profiles per user enforced in controller
profileSchema.index({ user: 1, name: 1 })

module.exports = mongoose.model('Profile', profileSchema)
