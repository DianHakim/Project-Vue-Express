const axios = require('axios')

/**
 * GET /api/external/ping
 * Fetch ke external service untuk testing
 */
exports.ping = async (req, res) => {
  try {
    const url = process.env.EXTERNAL_PING_URL || 'https://httpbin.org/get'
    const r = await axios.get(url, { timeout: 15000 })
    res.json({ ok: true, url, data: r.data })
  } catch (e) {
    res.status(502).json({ ok: false, message: e.message })
  }
}
