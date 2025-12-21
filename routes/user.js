const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { User, Service } = require('../models')
const { authRequired, requireRole } = require('../middlewares/auth')

// get all users from admin
router.get('/', authRequired, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.findAll({ order: [['created_at', 'DESC']] })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// admin get all agents with nested services
router.get('/agents', authRequired, requireRole("admin"), async (req, res) => {
  try {
    const agents = await User.findAll({
      where: { role: 'agent' },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Service,
          attributes: ['id', 'name', 'description'],
        }
      ]
    });
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});


// get connected user
router.get('/me', authRequired, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  })
  res.json(user)
})
// admin getting user by id
router.get('/:id', authRequired, async (req, res) => {
  const { id } = req.params
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "You can't access another user's profile" })
  }
  const user = await User.findByPk(id)
  res.json(user)
})


// create user (admin only or register)
router.post('/create', async (req, res) => {
  try {
    const { fullName, email, password, role, serviceId } = req.body

    if (!fullName || !email || !password)
      return res.status(400).json({ error: 'Missing required field' })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "user",
      serviceId: serviceId || null
    })

    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// update user (admin only)
router.put('/:id', authRequired, requireRole("admin"), async (req, res) => {
  const { id } = req.params
  const { fullName, email, password, role, serviceId } = req.body
  try {
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update fields
    user.fullName = fullName || user.fullName
    user.email = email || user.email
    user.role = role || user.role
    user.serviceId = serviceId || user.serviceId

    // If password is provided, hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    await user.save()
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// delete user (admin only)
router.delete('/:id', authRequired, requireRole("admin"), async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    await user.destroy()
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

module.exports = router
