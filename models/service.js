const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.STRING(250), allowNull: false},
    image: { type: DataTypes.STRING(250), allowNull: false},
  }, {
    tableName: 'service',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: true,
  })

  return Service
}
