require('dotenv').config()
const { sequelize } = require('./index')
const { Transaction, TransactionItem } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

async function main() {
  await sequelize.sync({ alter: true })

  const items = [
    { name: 'Konsultasi', qty: 1, price: 100000 },
    { name: 'USG', qty: 1, price: 150000 }
  ]
  const totals = computeTotals(items, 0, 0, 300000)

  const trx = await Transaction.create({
    code: makeCode(),
    patientName: 'Contoh Pasien',
    unit: 'Poli KIA',
    paymentMethod: 'Cash',
    note: 'Terima kasih.',
    ...totals
  })

  await TransactionItem.bulkCreate(items.map(it => ({ transactionId: trx.id, ...it })))

  console.log('Seed inserted:', trx.id)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
