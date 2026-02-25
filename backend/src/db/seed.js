require('dotenv').config()
const { sequelize } = require('./index')
const { Transaction, TransactionItem, User } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

async function main() {
  await sequelize.sync({ alter: true })

  // Create admin user
  const adminUser = await User.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      username: 'admin',
      password: '123456', // Will be hashed by the model hook
      email: 'admin@clinic.local',
      role: 'admin',
      isActive: true
    }
  })

  console.log('✓ Admin user created/found:', adminUser[0].username)

  // Create kasir user
  const kasirUser = await User.findOrCreate({
    where: { username: 'kasir' },
    defaults: {
      username: 'kasir',
      password: 'kasir123',
      email: 'kasir@clinic.local',
      role: 'kasir',
      isActive: true
    }
  })

  console.log('✓ Kasir user created/found:', kasirUser[0].username)

  // Create sample transactions
  const sampleTransactions = [
    {
      items: [
        { name: 'Konsultasi Dokter', qty: 1, price: 100000 },
        { name: 'USG Abdomen', qty: 1, price: 150000 }
      ],
      patientName: 'Bapak Joko',
      unit: 'Poli Umum'
    },
    {
      items: [
        { name: 'Periksa Kehamilan', qty: 1, price: 120000 },
        { name: 'USG Kandungan', qty: 1, price: 200000 }
      ],
      patientName: 'Ibu Siti',
      unit: 'Poli KIA'
    },
    {
      items: [
        { name: 'Vaksinasi Anak', qty: 2, price: 50000 },
        { name: 'Periksa Kesehatan', qty: 1, price: 75000 }
      ],
      patientName: 'Anak Budi',
      unit: 'Poli Anak'
    }
  ]

  let createdCount = 0
  for (const sample of sampleTransactions) {
    try {
      const totals = computeTotals(sample.items, 0, 0, 0)
      
      const trx = await Transaction.create({
        code: makeCode(),
        patientName: sample.patientName,
        unit: sample.unit,
        paymentMethod: 'Cash',
        note: 'Terima kasih.',
        userId: adminUser[0].id,
        ...totals
      })

      await TransactionItem.bulkCreate(
        sample.items.map(it => ({ transactionId: trx.id, ...it }))
      )

      console.log('✓ Transaction created:', trx.code)
      createdCount++
    } catch (err) {
      // Skip duplicate code errors, continue seeding
      if (err.name !== 'SequelizeUniqueConstraintError') {
        throw err
      }
      console.log('⚠ Transaction with same timestamp already exists, skipping...')
    }
  }

  console.log(`✓ Seeding complete! Created ${createdCount} transactions.`)
  process.exit(0)
}

main().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
