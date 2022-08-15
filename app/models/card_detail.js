const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('card_detail', {
    card_detail_id: {
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
    card_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    card_number: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    expiry_date: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    cvc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'card_detail',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "card_detail_id" },
        ]
      },
      {
        name: "user_card_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
