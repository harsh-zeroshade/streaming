const mongoose = require('mongoose')

const myListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    contentId:   { type: String, required: true }, // TMDB id
    type:        { type: String, enum: ['movie', 'series'], required: true },
    title:       String,
    poster:      String,
    backdrop:    String,
    year:        Number,
    rating:      String,
    genres:      [String],
    description: String,
    addedAt:     { type: Date, default: Date.now },
  }],
}, { timestamps: true })

// Ensure one list doc per user
myListSchema.index({ user: 1 }, { unique: true })

module.exports = mongoose.model('MyList', myListSchema)
