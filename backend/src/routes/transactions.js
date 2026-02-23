const router = require('express').Router()
const transactionController = require('../controllers/transactionController')

router.get('/', transactionController.getAllTransactions)
router.get('/trash/deleted', transactionController.getDeletedTransactions)
router.get('/:id', transactionController.getTransactionById)
router.post('/', transactionController.createTransaction)
router.delete('/:id', transactionController.deleteTransaction)
router.delete('/:id/permanent', transactionController.permanentDeleteTransaction)
router.post('/:id/restore', transactionController.restoreTransaction)

module.exports = router
