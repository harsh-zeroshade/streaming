const mongoose = require('mongoose')

const watchProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  progress: [{
    contentId:       { type: String, required: true },
    type:            { type: String, enum: ['movie', 'series'] },
    title:           String,
    poster:          String,
    backdrop:        String,
    progressSeconds: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 0 },
    progress:        { type: Number, default: 0 }, // 0-100 %
    season:          Number,
    episode:         Number,
    episodeId:       String,
    updatedAt:       { type: Date, default: Date.now },
  }],
}, { timestamps: true })

watchProgressSchema.index({ user: 1 }, { unique: true })

module.exports = mongoose.model('WatchProgress', watchProgressSchema)
