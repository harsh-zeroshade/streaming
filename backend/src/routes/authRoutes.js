const router = require('express').Router()
const { signup, signin, signout, getMe, updateProfile, changePassword, updatePlan } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

router.post('/signup',          signup)
router.post('/signin',          signin)
router.post('/signout',         signout)
router.get('/me',               protect, getMe)
router.post('/update-profile',  protect, updateProfile)
router.post('/change-password', protect, changePassword)
router.post('/update-plan',     protect, updatePlan)

module.exports = router
