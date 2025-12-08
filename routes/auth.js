const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')


const JWT_SECRET = process.env.JWT_SECRET

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" })

  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(404).json({ error: "User not found" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: "Invalid password" })

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, fullName: user.fullName, role: user.role }
  })
})

module.exports = router