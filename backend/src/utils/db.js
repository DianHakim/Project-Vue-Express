const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  'struk_db',   // ganti sesuai db kamu
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
)

module.exports = { sequelize }   // 🔥 WAJIB OBJECT
