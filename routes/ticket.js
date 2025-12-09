const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { Ticket, User, Service } = require('../models')
const { authRequired, requireRole } = require('../middlewares/auth')

// get all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Service,
          attributes: ['id', 'name', 'description'],
        },
        {
        model: User,
        attributes: ['id', 'fullName', 'email'],
        }
      ]
    })
    res.json(tickets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
})

// get ticket by user Id
router.get('/ticket/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const tickets = await Ticket.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Service,
          attributes: ['id', 'name', 'description'],
        },
        {
        model: User,
        attributes: ['id', 'fullName', 'email'],
        }
      ]
    })
    res.json(tickets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
})

// get tickets by id and make sure the user owns it or is admin or agent
router.get('/:id', authRequired, async (req, res) => {
  const { id } = req.params
  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: Service,
          attributes: ['id', 'name', 'description'],
        },
        {
        model: User,
        attributes: ['id', 'fullName', 'email'],
        }
      ]
    })
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }
    // Check ownership or role
    if (req.user.role !== "admin" && req.user.role !== "agent" && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't have permission to view this ticket" })
    }
    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch ticket' })
  }
})


// create ticket
router.post('/', async (req, res) => {
  const { fullName, contact, address, serviceId, userId } = req.body
  try {
    const newTicket = await Ticket.create({
      fullName,
      contact,
      address,
      serviceId,
      userId
    })
    res.status(201).json(newTicket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create ticket' })
  }
})

// update ticket status
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
    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update ticket status' })
  }
})

// delete ticket
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
