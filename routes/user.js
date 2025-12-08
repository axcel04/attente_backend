const express = require('express')
const router = express.Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['created_at', 'DESC']] })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { fullName, email, password, role, serviceId } = req.body

    if (!fullName || !email || !password)
      return res.status(400).json({ error: 'Missing required field' })

    if (role === "agent" && !serviceId) {
      return res.status(400).json({ error: "Agents must have a serviceId" })
    }

    if (["user", "admin"].includes(role) && serviceId) {
      return res.status(400).json({ error: "Only agents can have serviceId" })
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: role || "user",
      serviceId: serviceId || null
    })

    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

module.exports = router
