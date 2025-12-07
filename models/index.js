const { Sequelize } = require('sequelize')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
  }
)

const db = { sequelize, Sequelize }

// Import models
const Post = require('./post')(sequelize)
const Message = require('./message')(sequelize)

db.Post = Post
db.Message = Message
module.exports = db
