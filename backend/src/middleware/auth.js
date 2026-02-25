const jwt = require('jsonwebtoken')

const verify = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (err) {
    console.error('JWT verification error:', err.message)
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses hanya untuk admin' })
  }
  next()
}

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses tidak diizinkan' })
  }
  next()
}

module.exports = { verify, adminOnly, allowRoles }
