const router = require('express').Router()
const c = require('../controllers/profileController')
const { protect } = require('../middleware/auth')

router.use(protect)   // all profile routes require auth

router.get('/',      c.getProfiles)
router.post('/',     c.createProfile)
router.put('/:id',   c.updateProfile)
router.delete('/:id',c.deleteProfile)

module.exports = router
