const router = require('express').Router()
const transactions = require('./transactions')
const external = require('./external')

router.use('/transactions', transactions)
router.use('/external', external)

module.exports = router
