const router = require('express').Router()
const transactionController = require('../controllers/transactionController')
const { adminOnly } = require('../middleware/auth')

router.get('/', transactionController.getAllTransactions)
router.get('/trash/deleted', adminOnly, transactionController.getDeletedTransactions)
router.get('/:id', transactionController.getTransactionById)
router.post('/', transactionController.createTransaction)
router.delete('/:id', adminOnly, transactionController.deleteTransaction)
router.delete('/:id/permanent', adminOnly, transactionController.permanentDeleteTransaction)
router.post('/:id/restore', adminOnly, transactionController.restoreTransaction)

module.exports = router
