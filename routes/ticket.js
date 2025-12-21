const express = require('express')
const router = express.Router()
const { Ticket, User, Service } = require('../models')
const { authRequired, requireRole } = require('../middlewares/auth')


// -------------------------------------------------------------
// GET tickets by serviceId
// -------------------------------------------------------------
router.get('/service/:serviceId', async (req, res) => {
  const { serviceId } = req.params

  try {
    const tickets = await Ticket.findAll({
      where: { serviceId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name', 'description'] },
        { model: User, attributes: ['id', 'fullName', 'email'] }
      ]
    })

    res.json(tickets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
})


// -------------------------------------------------------------
// GET tickets by userId
// -------------------------------------------------------------
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const tickets = await Ticket.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name'] }
      ]
    })

    res.json(tickets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
})


// -------------------------------------------------------------
// GET ALL tickets
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'fullName'] }
      ]
    })

    res.json(tickets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
})


// -------------------------------------------------------------
// CREATE ticket
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  const { fullName, contact, address, serviceId, userId } = req.body

  try {
    const ticket = await Ticket.create({
      fullName,
      contact,
      address,
      serviceId,
      userId
    })

    res.status(201).json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create ticket' })
  }
})


// -------------------------------------------------------------
// UPDATE ticket status + SOCKET NOTIFICATION 🔥
// -------------------------------------------------------------
router.put('/:id/status', authRequired, async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const ticket = await Ticket.findByPk(id)
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    ticket.status = status
    await ticket.save()

    // 🔥 SOCKET.IO
    const io = req.app.locals.io
    io.to(`ticket_${ticket.userId}`).emit('notification', {
      message: `Votre ticket #${id} est ${status}`,
      status
    })

    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update ticket' })
  }
})


// -------------------------------------------------------------
// DELETE ticket (admin only)
// -------------------------------------------------------------
router.delete('/:id', authRequired, requireRole(['admin']), async (req, res) => {
  const { id } = req.params

  try {
    const ticket = await Ticket.findByPk(id)
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    await ticket.destroy()
    res.json({ message: 'Ticket deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete ticket' })
  }
})

module.exports = router
