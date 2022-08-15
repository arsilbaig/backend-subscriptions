const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('currency', {
    currency_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cur_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cur_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cur_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    cur_price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'currency',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "currency_id" },
        ]
      },
    ]
  });
};
