const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscription_order', {
    subscription_order_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription',
        key: 'subscription_id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'subscription_order',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "subscription_order_id" },
        ]
      },
      {
        name: "user_subscription_order_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "subscription_order_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "subscription_id" },
        ]
      },
    ]
  });
};
