const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { getList, addItem, removeItem } = require('../controllers/myListController')

router.get('/',               protect, getList)
router.post('/',              protect, addItem)
router.delete('/:contentId',  protect, removeItem)

module.exports = router
