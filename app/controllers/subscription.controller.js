const db = require("../models");
const Subscription = db.subscription;
const SubscriptionOrder = db.subscription_order;
const CustomerSubscriptions = db.customer_subscriptions;
const User =  db.user;
const UserRole = db.user_roles;
const { successResponse, errorResponse } = require('../common/response');
const Op = db.Sequelize.Op;
const logger = require("../../logs/logger.js");
const { saveSubsriptionValidations } = require('../validations/validation');
const {authJwt} = require("../middleware");

exports.create = (req, res) => {
    let subscription = {};

   

    try {
        // Validate
        const { error } = saveSubsriptionValidations(req.body);
        if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));
        // Building Subscriptin object from upoading request's body
            subscription.user_id = req.userId,
            subscription.sub_name = req.body.subName,
            subscription.withdraw_amount = req.body.withdrawAmount,
            subscription.frequency = req.body.frequency,
            subscription.image = req.body.image,
            subscription.description = req.body.description,
            subscription.terms = req.body.terms,
            subscription.status = 0

        // Save to MySQL database
        Subscription.create(subscription).then(result => {
            logger.info('Subscription Created', req.body.userId + ' has been susbcribe successfully', ' at ', new Date().toJSON());
            // send uploading message to client
            res.status(200).json({
                message: "Subscription Create Successfully !",
                subscription: successResponse(result),
            });
        });
    } catch (error) {

        res.status(500).json({
            message: "Fail!",
            error: errorResponse(error.message)
        });
    }
}

// Get Subscription By id
exports.getSubscriptionById = (req, res) => {
    let subscriptionId = req.params.id;
    Subscription.findByPk(subscriptionId)
        .then(subscription => {
            logger.info("Subscription", "getSubscriptionById", "Info", "Successfully Get a Subscription with id = " + subscriptionId);
            res.status(200).json( subscription == null ? {} : subscription
            );
        })
        .catch(error => {
            res.status(500).json({
                message: "Error!",
                error: error.message
            });
        });
}


exports.getSubscriptions = (req, res) => {
    const data = [];
    Subscription.findAll({
        where: {
            user_id: req.userId
          },
        include: [{
            model: SubscriptionOrder,
            as: "subscription_orders"
        }]
    })
        .then(subscription => {
            logger.info("Subscription", "getSubscriptions", "Info", "Successfully All Subscriptions");
            for (var i in subscription) {
                let status_text;
                if(subscription[i].status==0){
                    status_text = "active";
                }else if(subscription[i].status==1){
                    status_text = "ended";
                }else{
                    status_text = "draft"
                }
                data.push({
                    'subscriptionId': subscription[i].subscription_id,
                    'userId': subscription[i].user_id,
                    'sub_name': subscription[i].sub_name,
                    'withdraw_amount': subscription[i].withdraw_amount,
                    'frequency': subscription[i].frequency,
                    'image': subscription[i].image,
                    'status': status_text,
                    'total_subscriber': subscription[i].subscription_orders.length,
                });
            }
            res.status(200).json(
               data == null ? {} : data
            );
        })
        .catch(error => {
            res.status(500).json({
                message: "Error!",
                error: error.message
            });
        });
}

exports.exportCustomers = async (req, res) => {
    let customers = [];
    let subscriptionOrders = {};
    try {
        // Building export Customers object from upoading request's body
        var userIds = req.body.users;
        var subsId = req.body.subscriptionId;
        if (subsId != null) {
            for (var i in userIds) {
                customers.push({ 'user_id': userIds[i].userId, 'subscription_id': subsId});
                subscriptionOrders.user_id = customers[i].user_id;
                subscriptionOrders.subscription_id = customers[i].subscription_id;
                subscriptionOrders.status = 0;
                subscriptionOrders.amount = 0;
                subscriptionOrders.expiry_date = new Date();
                await SubscriptionOrder.create(subscriptionOrders);
            }
            res.status(200).json({
                message: "Customer imported successfully",
                users: []
            });
        }
    } 
    catch (error) {
        res.status(500).json({
            message: "Fail!",
            error: errorResponse(error.message)
        });
    }
}



exports.getAllMarketPlace = (req, res) => {
    const data = [];
    Subscription.findAll()
        .then(subscription => {
            logger.info("Subscription", "getSubscriptions", "Info", "Successfully All Subscriptions");
            for (var i in subscription) {
                data.push({
                    'subscriptionId': subscription[i].subscription_id,
                    'sub_name': subscription[i].sub_name,
                    'image': subscription[i].image
                });
            }
            res.status(200).json(
                data == null ? {} : data
            );
        })
        .catch(error => {
            res.status(500).json({
                message: "Error!",
                error: error.message
            });
        });
}


exports.buySubscription = (req, res) => {
    let customerCubscriptions = {};
    const data = [];
    try {
        // Building subscription Orders object from upoading request's body
        customerCubscriptions.user_id = req.userId,
        customerCubscriptions.subscription_id = req.body.subscription_id,
        customerCubscriptions.quantity = 1,

        // Save to MySQL database
        CustomerSubscriptions.create(customerCubscriptions).then(result => {

            logger.info('Subscription Orders Created', req.userId + ' has been susbcribe successfully', ' at ', new Date().toJSON());
            // send uploading message to client
            CustomerSubscriptions.findAll({
                where: {
                    subscription_id: req.body.subscription_id,
                    user_id : req.userId
                  },
                include: [{
                    model: Subscription,
                    as: "subscription"
                }]
            }).then(val => {
                for (var i in val) {
                    data.push({
                        'subscriptionId': val[i].subscription.dataValues.subscription_id,
                        'sub_name': val[i].subscription.dataValues.sub_name,
                        'withdraw_amount': val[i].subscription.dataValues.withdraw_amount,
                        'frequency': val[i].subscription.dataValues.frequency,
                        'image': val[i].subscription.dataValues.image
                    });
                }
                res.status(200).json({
                    subscription: data,
                });
            })
        });
    } catch (error) {

        res.status(500).json({
            message: "Fail!",
            error: errorResponse(error.message)
        });
    }
}
const getUserRole = async (userId) => {
    return new Promise(async function (resolve, reject) {
      await UserRole.findOne({
        where: {
          userId: userId
        }
      }).then(function (userroledata) {
        if (userroledata != null) {
          resolve(userroledata.dataValues.roleId)
        } else {
          resolve(false);
        }
      })
    })
  }
exports.mySubscription = async (req, res) => {
    const data = [];
    try {
        const roleid = await getUserRole(req.userId);
        
        if (roleid && roleid == 1) {
            res.status(400).json({
                error: "Merchant doest not have its own subscriptions",
            });
        } else if (roleid && roleid == 2) {
           // send uploading message to client
        await   CustomerSubscriptions.findAll({
            where: {
                user_id : req.userId,
              },
            include: [{
                model: Subscription,
                as: "subscription"
            }]
        }).then(val => {
            for (var i in val) {
                let status_text;
                if(val[i].subscription.dataValues.status==0){
                    status_text = "active";
                }else if(val[i].subscription.dataValues.status==1){
                    status_text = "cancelled";
                }
                data.push({
                    'subscriptionId': val[i].subscription.dataValues.subscription_id,
                    'sub_name': val[i].subscription.dataValues.sub_name,
                    'withdraw_amount': val[i].subscription.dataValues.withdraw_amount,
                    'frequency': val[i].subscription.dataValues.frequency,
                    'image': val[i].subscription.dataValues.image,
                    'status': status_text
                });
            }
            res.status(200).json(data);
        });
        } 
             
    } catch (error) {

        res.status(500).json({
            message: "Fail!",
            error: errorResponse(error.message)
        });
    }
}

exports.getSubscriptionsOrderBySubscriptionId = (req, res) => {
    const data = [];
    db.sequelize.query(
        `SELECT u.* FROM users u
        LEFT JOIN subscription_order so 
         on(u.id = so.user_id)
        where  so.subscription_id=`+req.body.subscription_id, { type: db.sequelize.QueryTypes.SELECT }
        )
        .then(userInfo => {
            if(userInfo.length>0){
                res.status(200).json(
                    userInfo == null ? {} : userInfo
                 );
            }else{
                res.status(400).json({
                    message: "Error!",
                    error: "No customer is assigned to this subscription."
                });
            }
            
            
        })
        .catch(error => {
            res.status(500).json({
                message: "Error!",
                error: error.message
            });
        });
}
