const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' })

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered.' })

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.cookie('token', token, cookieOptions())
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' })

    const token = signToken(user._id)
    res.cookie('token', token, cookieOptions())
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/signout
exports.signout = (_req, res) => {
  res.cookie('token', '', { maxAge: 0 })
  res.json({ message: 'Signed out successfully.' })
}

// GET /api/auth/me
exports.getMe = (req, res) => {
  const { _id: id, name, email, plan } = req.user
  res.json({ user: { id, name, email, plan } })
}
