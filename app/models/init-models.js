var DataTypes = require("sequelize").DataTypes;
var _authuser = require("./authuser");
var _roles = require("./roles");
var _subscription = require("./subscription");
var _subscription_order = require("./subscription_order");
var _user_roles = require("./user_roles");
var _users = require("./users");
var _customer_subscriptions = require("./customer_subscriptions");
var _card_detail = require("./card_detail");
var _currency = require("./currency");
var _payment_transactions = require("./payment_transactions");

function initModels(sequelize) {
  var authuser = _authuser(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var subscription = _subscription(sequelize, DataTypes);
  var subscription_order = _subscription_order(sequelize, DataTypes);
  var user_roles = _user_roles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var customer_subscriptions = _customer_subscriptions(sequelize, DataTypes);
  var card_detail = _card_detail(sequelize, DataTypes);
  var currency = _currency(sequelize, DataTypes);
  var payment_transactions = _payment_transactions(sequelize, DataTypes);


  roles.belongsToMany(users, { as: 'userId_users', through: user_roles, foreignKey: "roleId", otherKey: "userId" });
  users.belongsToMany(roles, { as: 'roleId_roles', through: user_roles, foreignKey: "userId", otherKey: "roleId" });
  user_roles.belongsTo(roles, { as: "role", foreignKey: "roleId"});
  roles.hasMany(user_roles, { as: "user_roles", foreignKey: "roleId"});
  subscription_order.belongsTo(subscription, { as: "subscription", foreignKey: "subscription_id"});
  subscription.hasMany(subscription_order, { as: "subscription_orders", foreignKey: "subscription_id"});
  subscription.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(subscription, { as: "subscriptions", foreignKey: "user_id"});
  subscription_order.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(subscription_order, { as: "subscription_orders", foreignKey: "user_id"});
  user_roles.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(user_roles, { as: "user_roles", foreignKey: "userId"});
  customer_subscriptions.belongsTo(subscription, { as: "subscription", foreignKey: "subscription_id"});
  subscription.hasMany(customer_subscriptions, { as: "customer_subscriptions", foreignKey: "subscription_id"});
  customer_subscriptions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(customer_subscriptions, { as: "customer_subscriptions", foreignKey: "user_id"});
  card_detail.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(card_detail, { as: "card_details", foreignKey: "user_id"});

  payment_transactions.belongsTo(card_detail, { as: "card_detail", foreignKey: "card_detail_id"});
  card_detail.hasMany(payment_transactions, { as: "payment_transactions", foreignKey: "card_detail_id"});
  payment_transactions.belongsTo(currency, { as: "currency", foreignKey: "currency_id"});
  currency.hasMany(payment_transactions, { as: "payment_transactions", foreignKey: "currency_id"});
  payment_transactions.belongsTo(subscription, { as: "subscription", foreignKey: "subscription_id"});
  subscription.hasMany(payment_transactions, { as: "payment_transactions", foreignKey: "subscription_id"});
  payment_transactions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(payment_transactions, { as: "payment_transactions", foreignKey: "user_id"});

  return {
    authuser,
    roles,
    subscription,
    subscription_order,
    user_roles,
    users,
    customer_subscriptions,
    card_detail,
    currency,
    payment_transactions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
