const db = require("../models");
const Subscription = db.subscription;
const SubscriptionOrder = db.subscription_order;
const CustomerSubscriptions = db.customer_subscriptions;
const PaymentTransactions = db.payment_transactions;
const Cards = db.card_detail;
const User =  db.user;
const UserRole = db.user_roles;
const { successResponse, errorResponse } = require('../common/response');
const Op = db.Sequelize.Op;
const logger = require("../../logs/logger.js");
const { saveSubsriptionValidations } = require('../validations/validation');
const {authJwt} = require("../middleware");
const json2csv = require('json2csv').parse;

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
            subscription.status = 0,
            subscription.isEnded = 0,
            subscription.isDeleted = 0

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


const getMerchantLogo = async (user_id) =>{
    return new Promise(async function(resolve, reject){
    await User.findOne({
        attributes: ['image_url'],
        where:{
            id: user_id
        }
    }).then(function(userDataInfo){
        if(userDataInfo!=null){
            resolve(userDataInfo.dataValues.image_url);
        }else{
            resolve(false);
        }
    })
})
}

const getSubsStatus = async (user_id,subscription_id) =>{
    return new Promise(async function(resolve, reject){
    await CustomerSubscriptions.findOne({
        attributes: ['user_id'],
        where:{
            subscription_id: subscription_id,
            user_id: user_id
        }
    }).then(function(customer_subscription){
        if(customer_subscription!=null){
            resolve(true);
        }else{
            resolve(false);
        }
    })
})
}
// Get Subscription By id
exports.getSubscriptionById = async (req, res) => {
    let subscriptionId = parseInt(req.params.id);
  const getStatus = await getSubsStatus(req.userId, subscriptionId);
    console.log(getStatus);
   await Subscription.findByPk(subscriptionId)
        .then(subscription => {
            let subscribedData ={
                createdAt: subscription.dataValues.createdAt,
                description: subscription.dataValues.description,
                frequency: subscription.dataValues.frequency,
                status: getStatus?getStatus:subscription.dataValues.status,
                isActive: subscription.dataValues.isActive,
                image: subscription.dataValues.image,
                sub_name: subscription.dataValues.sub_name,
                subscription_id: subscription.dataValues.subscription_id,
                terms: subscription.dataValues.terms,
                updatedAt: subscription.dataValues.updatedAt,
                user_id: subscription.dataValues.user_id,
                withdraw_amount: subscription.dataValues.withdraw_amount,
            };
            logger.info("Subscription", "getSubscriptionById", "Info", "Successfully Get a Subscription with id = " + subscriptionId);
            res.status(200).json( subscribedData == null ? {} : subscribedData
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
            user_id: req.userId,
            isDeleted: 0
          },
        include: [{
            model: CustomerSubscriptions,
            as: "customer_subscriptions"
        }]
    })
        .then(subscription => {
            logger.info("Subscription", "getSubscriptions", "Info", "Successfully All Subscriptions");
            for (var i in subscription) {
                let status_text;
                if(subscription[i].isEnded==0){
                    status_text = "active";
                }else if(subscription[i].isEnded==1){
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
                    'total_subscriber': subscription[i].customer_subscriptions.length,
                    'description': subscription[i].description,
                    'terms': subscription[i].terms
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
    Subscription.findAll({
        where: {
            isEnded: 0,
            isDeleted: 0
        }
    })
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


exports.buySubscription = async (req, res) => {
    let customerCubscriptions = {};
    const data = [];
    try {
        // Building subscription Orders object from upoading request's body
        customerCubscriptions.user_id = req.userId,
        customerCubscriptions.subscription_id = req.body.subscription_id,
        customerCubscriptions.quantity = 1,
        //checking if customer already subscribed
      await  CustomerSubscriptions.findOne({
                where: {
                    subscription_id: req.body.subscription_id,
                    user_id : req.userId
                },
                include: [{
                    model: Subscription,
                    as: "subscription",
                    where : {
                        status: 0
                    }

                }]
        }).then(async function(subscription_row){
            if(subscription_row == null){
                // checking if card is allowd 
                const isCardAllowed = await checkCardStatus(req.body.card_detail_id);
                
                if(!isCardAllowed){
                        // Save to MySQL database
                await  CustomerSubscriptions.create(customerCubscriptions).then(async result => {

                        logger.info('Subscription Orders Created', req.userId + ' has been susbcribe successfully', ' at ', new Date().toJSON());
                        // send uploading message to client
                    await  PaymentTransactions.create({
                            user_id: req.userId,
                            subscription_id: req.body.subscription_id,
                            card_detail_id: req.body.card_detail_id,
                            amount: req.body.withdrawAmount,
                            currency_id : req.body.currency_id
                        });
                        await Subscription.update({
                            isActive: 1,
                        },{
                            where : {
                                subscription_id: req.body.subscription_id,
                                status: 0
                            }
                        })
                    await  CustomerSubscriptions.findAll({
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
                                message: "Successfull Transaction ",
                                subscription: data,
                            });
                        })
                    });
                }else{
                    res.status(400).json({
                        error: "Failed Transaction",
                    });
                }
            }else{
                res.status(400).json({
                    error: "You have already subscribed this Subscription.",
                });
            }
        })
       
    } catch (error) {

        res.status(500).json({
            message: "Fail!",
            error: errorResponse(error.message)
        });
    }
}
const checkCardStatus = async (card_id) => {
    return new Promise(async function (resolve, reject) {
      await Cards.findOne({
        where: {
          card_detail_id: card_id
        }
      }).then(function (cardInfo) {
        if (cardInfo != null) {
          resolve(cardInfo.dataValues.isActive?true:false)
        } else {
          resolve(false);
        }
      })
    })
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
        await CustomerSubscriptions.findAll({
            where: {
                user_id : req.userId,
              },
            include: [
                {
                where:{
                    isDeleted: 0
                },
                model: Subscription,
                as: "subscription"
                }
        ]
        }).then(async val => {
            for (var i in val) {
                let status_text;
                if(val[i].subscription.dataValues.status==0){
                    status_text = "active";
                }else if(val[i].subscription.dataValues.status==1){
                    status_text = "cancelled";
                }
                const MerchantLogo = await getMerchantLogo(val[i].subscription.dataValues.user_id);
                data.push({
                    'subscriptionId': val[i].subscription.dataValues.subscription_id,
                    'sub_name': val[i].subscription.dataValues.sub_name,
                    'withdraw_amount': val[i].subscription.dataValues.withdraw_amount,
                    'frequency': val[i].subscription.dataValues.frequency,
                    'image': val[i].subscription.dataValues.image,
                    'merchantLogo' : MerchantLogo?MerchantLogo:"",
                    'terms': val[i].subscription.dataValues.terms,
                    'description': val[i].subscription.dataValues.description,
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
        LEFT JOIN customer_subscriptions so 
         on(u.id = so.user_id) LEFT JOIN user_roles ur ON(ur.userId=u.id) 
        where ur.roleId=2 and so.subscription_id=`+req.params.id, { type: db.sequelize.QueryTypes.SELECT }
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

exports.endSubscription = async (req, res) => {
    try {
        // Validate
        let subscriptionId = req.params.id;
        let subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            // return a response to client
            res.status(404).json({
                message: "Not found for ending a subscription with id = " + subscriptionId,
                error: "404",
                type: "subscriptionId"
            });
        } else {
            let subscriptionStatus = 0;
            let statustext = "";
            if(subscription.dataValues.isEnded == 1){
                subscriptionStatus = 0;
                statustext ="Activated";
            }else{
                subscriptionStatus = 1;
                statustext ="Ended";
            }
            let updatedObject = {
                isEnded: subscriptionStatus
            }
            let result = await Subscription.update(updatedObject, { returning: true, where: { subscription_id: subscriptionId } });
            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not end a subscription with id = " + req.params.id,
                    error: "Id not Exists",
                    type: "subscriptionId"
                });
            }
            res.status(200).json({
                message: statustext+ " successfully a subscription with id = " + subscriptionId
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not end a subscription with id = " + req.params.id,
            error: errorResponse(error.message)
        });
    }

}


exports.activeSubscription = async (req, res) => {
    try {
        // Validate
        let subscriptionId = req.params.id;
        let subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            // return a response to client
            res.status(404).json({
                message: "Not found for activating a subscription with id = " + subscriptionId,
                error: "404",
                type: "subscriptionId"
            });
        } else {
            let updatedObject = {
                isEnded: 0
            }
            let result = await Subscription.update(updatedObject, { returning: true, where: { subscription_id: subscriptionId } });
            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not activate a subscription with id = " + req.params.id,
                    error: "Id not Exists",
                    type: "subscriptionId"
                });
            }
            res.status(200).json({
                message: "Activated successfully a subscription with id = " + subscriptionId
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not activate a Subscription with id = " + req.params.id,
            error: errorResponse(error.message)
        });
    }

}
exports.deleteSubscription = async (req, res) => {
    try {
        // Validate
        let subscriptionId = req.params.id;
        let subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            // return a response to client
            res.status(404).json({
                message: "Not found for deleting a subscription with id = " + subscriptionId,
                error: "404",
                type: "subscriptionId"
            });
        } else {
            let updatedObject = {
                isDeleted: 1
            }
            let result = await Subscription.update(updatedObject, { returning: true, where: { subscription_id: subscriptionId } });
            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not delete a subscription with id = " + req.params.id,
                    error: "Id not Exists",
                    type: "subscriptionId"
                });
            }
            res.status(200).json({
                message: "delete successfully a subscription with id = " + subscriptionId
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not delete a Subscription with id = " + req.params.id,
            error: errorResponse(error.message)
        });
    }
}
exports.cancelSubscription = async (req, res) => {
    try {
        // Validate
        let subscriptionId = req.params.id;
        let subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            // return a response to client
            res.status(404).json({
                message: "Not found for deleting a subscription with id = " + subscriptionId,
                error: "404",
                type: "subscriptionId"
            });
        } else {
            let updatedObject = {
                status: "1",
                isActive: 0
            }
            let result = await Subscription.update(updatedObject, { returning: true, where: { subscription_id: subscriptionId } });
            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not delete a subscription with id = " + req.params.id,
                    error: "Id not Exists",
                    type: "subscriptionId"
                });
            }
            res.status(200).json({
                message: "cancel successfully a subscription with id = " + subscriptionId
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not delete a Make with id = " + req.params.id,
            error: errorResponse(error.message)
        });
    }

}

const CsvParser = require("json2csv").Parser;
exports.exportCustomersCSV = async (req, res) => {
    let subscribers = [];
    
        var userIds = req.body.users;
                var subsId = parseInt(req.body.subscriptionId);
                if (subsId != null) {
                    for (var i in userIds) {
                      await  User.findOne({
                            where: {
                                id: parseInt(userIds[i])
                            }
                        }).then(function(userdata){
                            if(userdata!=null){
                                subscribers.push({ 
                                    'user_id': parseInt(userdata.dataValues.id), 
                                    'subscription_id': subsId,
                                    'Full Name' : userdata.dataValues.firstname +' '+ userdata.dataValues.lastname,
                                    'Email or Phone': userdata.dataValues.email? userdata.dataValues.email:userdata.dataValues.country_code +"-"+userdata.dataValues.phone,
                                    'Business Website': userdata.dataValues.business_website_url?userdata.dataValues.business_website_url:"",
                                    'Business Email': userdata.dataValues.business_email
                                });
                            }
                        })
                    }
    
        const fields = ['User ID', 'Subscription ID', 'Full Name', 'Email or Phone', 'Business Website', 'Business Email'];
        const csvParser = new CsvParser({ fields });
        const csvData = csvParser.parse(subscribers);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
    
        res.status(200).end(csvData);
                }
    }