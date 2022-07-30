const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('agencyads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    orgName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    orgPlayerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    routeId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    vehicleId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    playerId: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agencyads',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "AgencyId",
        using: "BTREE",
        fields: [
          { name: "agencyId" },
        ]
      },
    ]
  });
};
