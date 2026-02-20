const dayjs = require('dayjs')

function padLeft(x, len = 2) {
  return String(x).padStart(len, '0')
}

function makeCode() {
  const d = dayjs()
  return `TRX-${d.format('YYYYMMDD')}-${d.format('HHmmss')}`
}

function computeTotals(items, discount = 0, tax = 0, paid = 0) {
  const subtotal = items.reduce((a, it) => a + (it.qty * it.price), 0)
  const disc = Math.max(0, Number(discount || 0))
  const tx = Math.max(0, Number(tax || 0))
  const total = Math.max(0, subtotal - disc + tx)
  const p = Math.max(0, Number(paid || 0))
  const change = Math.max(0, p - total)
  return { subtotal, discount: disc, tax: tx, total, paid: p, change }
}

module.exports = { makeCode, computeTotals }
