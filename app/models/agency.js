const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agency', {
    agency_id: {
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
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'provider',
        key: 'provider_id'
      }
    },
    language: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    api_key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pause_config: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'agency',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "agency_id" },
        ]
      },
      {
        name: "agency_ibfk_0",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "agency_provider_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "provider_id" },
        ]
      },
    ]
  });
};
