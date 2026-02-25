const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../utils/db')

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: true },
  role: { type: DataTypes.ENUM('admin', 'kasir'), defaultValue: 'kasir' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10)
      }
    }
  }
})

User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = User
