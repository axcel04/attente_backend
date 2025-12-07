const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING(255), allowNull: false },
    contact: { type: DataTypes.STRING(250), allowNull: false},
    address: { type: DataTypes.STRING(250), allowNull: false},
    status: { 
      type: DataTypes.ENUM("en_attente", "appel", "servi", "annulee"), 
      allowNull: false,
      defaultValue: "en_attente"
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "service",
        key: "id"
      }
    }
  }, {
    tableName: 'ticket',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: true,
  })

  return Ticket
}
