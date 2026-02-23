const Transaction = require('./Transaction')
const TransactionItem = require('./TransactionItem')
const User = require('./User')

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items', onDelete: 'CASCADE' })
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' })

module.exports = { Transaction, TransactionItem, User }
