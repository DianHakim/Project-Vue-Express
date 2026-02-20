const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const { sequelize } = require('./utils/db')   // pastikan path benar
require('./models') // 🔥 WAJIB supaya model ter-register

const routes = require('./routes')

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate()
    return res.json({ status: 'ok', db: 'connected' })
  } catch (e) {
    return res.status(503).json({
      status: 'degraded',
      db: 'disconnected',
      message: e.message
    })
  }
})

app.use('/api', routes)

app.use((req, res) =>
  res.status(404).json({ message: 'Not found' })
)

const port = process.env.PORT || 4000

// 🔥 SERVER JALAN SETELAH DB SIAP
sequelize.sync({ alter: true })   // bikin tabel kalau belum ada
  .then(() => {
    console.log('Database synced')
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error('DB Sync Error:', err)
  })
