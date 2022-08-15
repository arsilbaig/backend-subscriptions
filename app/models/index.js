const config = require("../config/db.config.js");

var DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/users")(sequelize, Sequelize);
db.role = require("../models/roles.js")(sequelize, Sequelize);
db.roles = require("../models/roles")(sequelize, DataTypes);
db.user_roles = require("../models/user_roles")(sequelize, DataTypes);
db.authuser = require("../models/authuser")(sequelize, DataTypes);
db.subscription = require("../models/subscription")(sequelize, DataTypes);
db.subscription_order = require("../models/subscription_order")(sequelize, DataTypes);
db.customer_subscriptions = require("../models/customer_subscriptions")(sequelize, DataTypes);
db.card_detail = require("../models/card_detail")(sequelize, DataTypes);
db.currency = require("../models/currency")(sequelize, DataTypes);
db.payment_transactions = require("../models/payment_transactions")(sequelize, DataTypes);



db.user_roles.belongsTo(db.user, {
   as: "user", 
   foreignKey: "userId"
  });
db.user.hasMany(db.user_roles, {
   as: "user_role", 
   foreignKey: "userId"
  });
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.card_detail.belongsTo(db.user, { 
  as: "user", 
  foreignKey: "user_id"
});
db.user.hasMany(db.card_detail, { 
  as: "card_details", 
  foreignKey: "user_id"
});

db.subscription_order.belongsTo(db.subscription, { as: "subscription", foreignKey: "subscription_id"});
db.subscription.hasMany(db.subscription_order, { as: "subscription_orders", foreignKey: "subscription_id"});

db.customer_subscriptions.belongsTo(db.subscription, { as: "subscription", foreignKey: "subscription_id"});
db.subscription.hasMany(db.customer_subscriptions, { as: "customer_subscriptions", foreignKey: "subscription_id"});
db.customer_subscriptions.belongsTo(db.user, { as: "user", foreignKey: "user_id"});
db.user.hasMany(db.customer_subscriptions, { as: "customer_subscriptions", foreignKey: "user_id"});
db.ROLES = ["merchant", "customer"];

module.exports = db;