const { Sequelize } = require('sequelize')
const path = require('path')

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

const Service = require('./service')(sequelize)
const Ticket = require('./ticket')(sequelize)
const User = require('./user')(sequelize)

db.Service = Service
db.Ticket = Ticket
db.User = User
sequelize.sync({ alter: true })

Ticket.belongsTo(Service, { foreignKey: 'serviceId' })
Service.hasMany(Ticket, { foreignKey: 'serviceId', onDelete: 'CASCADE' })

User.belongsTo(Service, { foreignKey: 'serviceId' })
Service.hasMany(User, { foreignKey: 'serviceId', onDelete: 'CASCADE' })


module.exports = db
