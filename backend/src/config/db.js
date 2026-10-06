const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    // Don't crash the server — TMDB routes still work without MongoDB
    console.error('MongoDB connection error:', err.message)
    console.warn('Running without MongoDB — auth/list/progress features unavailable until DB is connected.')
  }
}

module.exports = connectDB
