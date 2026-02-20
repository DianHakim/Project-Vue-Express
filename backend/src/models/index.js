const Transaction = require('./Transaction')
const TransactionItem = require('./TransactionItem')

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items', onDelete: 'CASCADE' })
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' })

module.exports = { Transaction, TransactionItem }
