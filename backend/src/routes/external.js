const router = require('express').Router()
const externalController = require('../controllers/externalController')

router.get('/ping', externalController.ping)

module.exports = router
