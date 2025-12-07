const express = require('express')
const router = express.Router()
const { Message } = require('../models')

// GET /message - list messages
router.get('/', async (req, res) => {
  try{
    const messages = await Message.findAll({ order: [['created_at', 'DESC']] })
    res.json(messages)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// POST /message - create message
router.post('/', async (req, res) => {
  try{
    const { full_name, email, subject, message } = req.body
    if (!full_name || !email || !message) return res.status(400).json({ error: 'Missing required field' })
    const m = await Message.create({ full_name, email, subject, message })
    res.status(201).json(m)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Failed to create message' })
  }
})

module.exports = router
