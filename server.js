require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const { sequelize } = require('./models')
const postRoutes = require('./routes/posts')
const messageRoutes = require('./routes/messages')

const app = express()
const PORT = process.env.PORT || 4000

// Ensure uploads directory exists
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads'

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/post', postRoutes)
app.use('/api/message', messageRoutes)

// Health check
app.get('/', (req, res) => res.json({ ok: true }))
app.get('/api', (req, res) => res.json({ message: "API OK" }))

async function start(){
  try{
    await sequelize.authenticate()
    app.listen(PORT, () => console.log(`Backend tourne sur http://localhost:${PORT}`))
  }catch(err){
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start();
