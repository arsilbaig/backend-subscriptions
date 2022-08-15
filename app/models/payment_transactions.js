const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment_transactions', {
    payment_id: {
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
    card_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'card_detail',
        key: 'card_detail_id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'currency',
        key: 'currency_id'
      }
    }
  }, {
    sequelize,
    tableName: 'payment_transactions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "payment_id" },
        ]
      },
      {
        name: "payment_card_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "card_detail_id" },
        ]
      },
      {
        name: "payment_subscription_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "subscription_id" },
        ]
      },
      {
        name: "payment_user_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "payment_currency_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "currency_id" },
        ]
      },
    ]
  });
};
