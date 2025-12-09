const express = require('express');
const router = express.Router();
const { Ticket, User, Service } = require('../models');
const { authRequired, requireRole } = require('../middlewares/auth');


// -------------------------------------------------------------
// 1️⃣ GET tickets by userId + serviceId (MOST SPECIFIC — must come first)
// -------------------------------------------------------------
router.get('/service/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const tickets = await Ticket.findAll({
      where: { serviceId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name', 'description'] },
        { model: User, attributes: ['id', 'fullName', 'email'] }
      ]
    });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});



// -------------------------------------------------------------
// 2️⃣ GET tickets by userId
// -------------------------------------------------------------
router.get('/ticket/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const tickets = await Ticket.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name', 'description'] },
        { model: User, attributes: ['id', 'fullName', 'email'] }
      ]
    });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


// -------------------------------------------------------------
// 3️⃣ GET tickets by serviceId (renamed to avoid conflicts)
// -------------------------------------------------------------
router.get('/service/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  try {
    const tickets = await Ticket.findAll({
      where: { serviceId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name', 'description'] },
        { model: User, attributes: ['id', 'fullName', 'email'] }
      ]
    });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


// -------------------------------------------------------------
// 4️⃣ GET ALL tickets
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: Service, attributes: ['id', 'name', 'description'] },
        { model: User, attributes: ['id', 'fullName', 'email'] }
      ]
    });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


// -------------------------------------------------------------
// 5️⃣ GET single ticket by ID (must come after others)
// -------------------------------------------------------------
router.get('/:id', authRequired, async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: Service, attributes: ['id', 'name', 'description'] },
        { model: User, attributes: ['id', 'fullName', 'email'] }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Ownership / Role check
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'agent' &&
      ticket.userId !== req.user.id
    ) {
      return res.status(403).json({ error: "You don't have permission to view this ticket" });
    }

    res.json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});


// -------------------------------------------------------------
// 6️⃣ Create ticket
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  const { fullName, contact, address, serviceId, userId } = req.body;

  try {
    const newTicket = await Ticket.create({
      fullName,
      contact,
      address,
      serviceId,
      userId
    });

    res.status(201).json(newTicket);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});


// -------------------------------------------------------------
// 7️⃣ Update ticket status
// -------------------------------------------------------------
router.put('/:id/status', authRequired, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});


// -------------------------------------------------------------
// 8️⃣ Delete ticket (Admin only)
// -------------------------------------------------------------
router.delete('/:id', authRequired, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.destroy();

    res.json({ message: 'Ticket deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});


module.exports = router;
