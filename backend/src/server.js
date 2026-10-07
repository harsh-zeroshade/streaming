require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const connectDB    = require('./config/db')

// ── Routes ────────────────────────────────────────────────────────
const authRoutes     = require('./routes/authRoutes')
const tmdbRoutes     = require('./routes/tmdbRoutes')
const myListRoutes   = require('./routes/myListRoutes')
const progressRoutes = require('./routes/progressRoutes')
const playerRoutes   = require('./routes/playerRoutes')
const profileRoutes  = require('./routes/profileRoutes')

connectDB()

const app = express()

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    const allowed = (process.env.CLIENT_URL || '')
      .split(',')
      .map(u => u.trim())
      .filter(Boolean)
    // Also allow any *.vercel.app subdomain for preview deploys
    if (
      allowed.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) ||
      origin === 'http://localhost:5173'
    ) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Simple request logger in dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/tmdb',     tmdbRoutes)
app.use('/api/mylist',   myListRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/player',   playerRoutes)
app.use('/api/profiles', profileRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// 404 fallback
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Run: npx kill-port ${PORT}`)
    process.exit(1)
  } else {
    throw err
  }
})
