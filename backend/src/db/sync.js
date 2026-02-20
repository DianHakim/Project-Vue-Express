require('dotenv').config()
const { sequelize } = require('./index')
require('../models')

async function main() {
  await sequelize.sync({ alter: true })
  console.log('DB sync done.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
