require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const { sequelize } = require('./models')
const serviceRoutes = require('./routes/service')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const ticketRoutes = require('./routes/ticket')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/service', serviceRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/ticket', ticketRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// HTTP server
const server = http.createServer(app)

// Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }
})

// 🔥 REND IO DISPONIBLE PARTOUT
app.locals.io = io

// Socket logic
io.on('connection', (socket) => {
  console.log('User connecté:', socket.id)

  socket.on('joinRoom', (room) => {
    socket.join(room)
    console.log(`User rejoint la room ${room}`)
  })
})

// Start server
async function start() {
  try {
    await sequelize.authenticate()
    server.listen(PORT, () =>
      console.log(`Backend + Socket OK http://localhost:${PORT}`)
    )
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
