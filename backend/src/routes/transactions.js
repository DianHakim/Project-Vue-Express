const router = require('express').Router()
const transactionController = require('../controllers/transactionController')

router.get('/', transactionController.getAllTransactions)
router.get('/:id', transactionController.getTransactionById)
router.post('/', transactionController.createTransaction)
router.delete('/:id', transactionController.deleteTransaction)

module.exports = router
