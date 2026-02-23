const router = require('express').Router()
const authController = require('../controllers/authController')
const { verify } = require('../middleware/auth')

router.post('/login', authController.login)
router.post('/logout', verify, authController.logout)
router.get('/me', verify, authController.me)

module.exports = router
