const { Transaction, TransactionItem } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

/**
 * GET /api/transactions
 * Ambil semua transaksi dengan items
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const items = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: TransactionItem, as: 'items' }]
    })
    res.json({ data: items })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * GET /api/transactions/:id
 * Ambil transaksi berdasarkan ID
 */
exports.getTransactionById = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const item = await Transaction.findByPk(id, {
      include: [{ model: TransactionItem, as: 'items' }]
    })
    if (!item) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
    res.json({ data: item })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * POST /api/transactions
 * Buat transaksi baru dengan items
 */
exports.createTransaction = async (req, res) => {
  try {
    const payload = req.body || {}
    const items = Array.isArray(payload.items) ? payload.items : []

    if (!items.length) return res.status(400).json({ message: 'Minimal 1 item.' })

    const normalized = items.map((it) => ({
      name: String(it.name || 'Item').trim(),
      qty: Math.max(1, Number(it.qty || 1)),
      price: Math.max(0, Number(it.price || 0))
    }))

    const totals = computeTotals(normalized, payload.discount, payload.tax, payload.paid)

    if (totals.paid < totals.total) {
      return res.status(400).json({ message: 'Nominal bayar kurang dari total.' })
    }

    const t = await Transaction.sequelize.transaction()
    try {
      const trx = await Transaction.create({
        code: makeCode(),
        patientName: payload.patientName || null,
        unit: payload.unit || null,
        paymentMethod: payload.paymentMethod || 'Cash',
        note: payload.note || null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        paid: totals.paid,
        change: totals.change
      }, { transaction: t })

      await TransactionItem.bulkCreate(
        normalized.map((it) => ({
          transactionId: trx.id,
          name: it.name,
          qty: it.qty,
          price: it.price
        })),
        { transaction: t }
      )

      await t.commit()

      const created = await Transaction.findByPk(trx.id, {
        include: [{ model: TransactionItem, as: 'items' }]
      })

      res.status(201).json({ data: created })
    } catch (e) {
      await t.rollback()
      throw e
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * DELETE /api/transactions/:id
 * Hapus transaksi
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const t = await Transaction.sequelize.transaction()
    try {
      await TransactionItem.destroy({ where: { transactionId: id }, transaction: t })
      const n = await Transaction.destroy({ where: { id }, transaction: t })
      await t.commit()
      if (!n) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
      res.json({ ok: true })
    } catch (e) {
      await t.rollback()
      throw e
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
