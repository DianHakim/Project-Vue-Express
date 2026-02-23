const router = require('express').Router()
const transactions = require('./transactions')
const external = require('./external')
const auth = require('./auth')
const { verify } = require('../middleware/auth')

router.use('/auth', auth)
router.use('/transactions', verify, transactions)
router.use('/external', external)

module.exports = router
