const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(32), allowNull: false, unique: true },

  patientName: { type: DataTypes.STRING(120), allowNull: true },
  unit: { type: DataTypes.STRING(120), allowNull: true },
  paymentMethod: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'Cash' },
  note: { type: DataTypes.STRING(500), allowNull: true },

  subtotal: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  discount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  tax: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  total: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  paid: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  change: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 }
}, {
  tableName: 'transactions'
})

module.exports = Transaction
