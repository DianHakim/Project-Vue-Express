const jwt = require('jsonwebtoken')
const { User } = require('../models')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' })
    }

    const user = await User.findOne({ where: { username } })

    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const isPasswordValid = await user.checkPassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Akun tidak aktif' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })

    res.json({ user })
  } catch (err) {
    console.error('Me error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.logout = (req, res) => {
  res.json({ message: 'Logout berhasil' })
}
