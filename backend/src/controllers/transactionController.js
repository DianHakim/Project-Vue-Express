const { Transaction, TransactionItem, User } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

/**
 * GET /api/transactions
 * Ambil semua transaksi dengan items (hanya data aktif)
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const items = await Transaction.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
      include: [
        { model: TransactionItem, as: 'items', where: { deletedAt: null }, required: false },
        { model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'], required: false }
      ]
    })
    res.json({ data: items })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * GET /api/transactions/:id
 * Ambil transaksi berdasarkan ID (hanya data aktif)
 */
exports.getTransactionById = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const item = await Transaction.findByPk(id, {
      include: [
        { model: TransactionItem, as: 'items', where: { deletedAt: null }, required: false },
        { model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'], required: false }
      ]
    })
    if (!item || item.deletedAt) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
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
        userId: req.user?.id || null,
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
        include: [
          { model: TransactionItem, as: 'items' },
          { model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'], required: false }
        ]
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
 * Soft delete transaksi (set deletedAt)
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const t = await Transaction.sequelize.transaction()
    try {
      const trx = await Transaction.findByPk(id, { transaction: t })
      if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
      if (trx.deletedAt) return res.status(404).json({ message: 'Transaksi sudah dihapus' })

      const now = new Date()
      await TransactionItem.update({ deletedAt: now }, { where: { transactionId: id }, transaction: t })
      await Transaction.update({ deletedAt: now }, { where: { id }, transaction: t })
      await t.commit()
      res.json({ ok: true, message: 'Transaksi berhasil dihapus' })
    } catch (e) {
      await t.rollback()
      throw e
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * POST /api/transactions/:id/restore
 * Restore soft-deleted transaksi
 */
exports.restoreTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const t = await Transaction.sequelize.transaction()
    try {
      const trx = await Transaction.findByPk(id, { paranoid: false, transaction: t })
      if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
      if (!trx.deletedAt) return res.status(400).json({ message: 'Transaksi belum dihapus' })

      await TransactionItem.update({ deletedAt: null }, { where: { transactionId: id }, transaction: t })
      await Transaction.update({ deletedAt: null }, { where: { id }, transaction: t })
      await t.commit()
      
      const restored = await Transaction.findByPk(id, {
        include: [{ model: TransactionItem, as: 'items', where: { deletedAt: null }, required: false }]
      })
      res.json({ data: restored, message: 'Transaksi berhasil dikembalikan' })
    } catch (e) {
      await t.rollback()
      throw e
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * GET /api/transactions/trash/deleted
 * Ambil semua transaksi yang sudah dihapus (soft deleted)
 */
exports.getDeletedTransactions = async (req, res) => {
  try {
    const items = await Transaction.findAll({
      where: { deletedAt: { [require('sequelize').Op.not]: null } },
      order: [['deletedAt', 'DESC']],
      include: [
        { model: TransactionItem, as: 'items', required: false },
        { model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'], required: false }
      ]
    })
    res.json({ data: items })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

/**
 * DELETE /api/transactions/:id/permanent
 * Hard delete - Hapus permanen transaksi yang sudah soft deleted
 */
exports.permanentDeleteTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const t = await Transaction.sequelize.transaction()
    try {
      const trx = await Transaction.findByPk(id, { transaction: t })
      if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
      if (!trx.deletedAt) return res.status(400).json({ message: 'Hanya transaksi yang dihapus yang bisa dihapus permanen' })

      await TransactionItem.destroy({ where: { transactionId: id }, transaction: t })
      await Transaction.destroy({ where: { id }, transaction: t })
      await t.commit()
      res.json({ ok: true, message: 'Transaksi berhasil dihapus secara permanen' })
    } catch (e) {
      await t.rollback()
      throw e
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
