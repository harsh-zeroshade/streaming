const router = require('express').Router()
const { signup, signin, signout, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

router.post('/signup',  signup)
router.post('/signin',  signin)
router.post('/signout', signout)
router.get('/me',       protect, getMe)

module.exports = router
