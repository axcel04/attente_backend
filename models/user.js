const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM("user", "agent", "admin"),
      allowNull: false,
      defaultValue: "user"
    },
    email: { type: DataTypes.STRING(250), allowNull: false },
    password: { type: DataTypes.STRING(250), allowNull: false },

    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "service",
        key: "id"
      }
    }
  }, {
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return User
}
