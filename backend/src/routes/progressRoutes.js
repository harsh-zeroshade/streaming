const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { getProgress, saveProgress, deleteProgress } = require('../controllers/watchProgressController')

router.get('/',               protect, getProgress)
router.post('/',              protect, saveProgress)
router.delete('/:contentId',  protect, deleteProgress)

module.exports = router
