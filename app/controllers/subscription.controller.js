const db = require("../models");
const Subscription = db.subscription;
const SubscriptionOrder = db.subscription_order;
const {successResponse,errorResponse} = require('../common/response');
const Op = db.Sequelize.Op;
const logger = require("../../logs/logger.js");
const {saveSubsriptionValidations} = require('../validations/validation');

exports.create = (req, res) => {
  let subscription = {};

  try {
      // Validate
      const { error } = saveSubsriptionValidations(req.body);
      if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));
      // Building Subscriptin object from upoading request's body
      subscription.user_id = req.body.userId,
      subscription.sub_name = req.body.subName,
      subscription.withdraw_amount = req.body.withdrawAmount,
      subscription.frequency = req.body.frequency,
      subscription.image = req.body.image,
      subscription.description = req.body.description,
      subscription.terms = req.body.terms,
      subscription.status = 0

      // Save to MySQL database
      Subscription.create(subscription).then(result => {
        logger.info('Subscription Created', req.body.userId +' has been susbcribe successfully', ' at ', new Date().toJSON());
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
            res.status(200).json({
                message: " Successfully Get a Subscription with id = " + subscriptionId,
                subscription: subscription == null ? {} : subscription
            });
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
        include: [{
          model: SubscriptionOrder,
          as: "subscription_orders"
        }]
    })
        .then(subscription => {
            logger.info("Subscription", "getSubscriptions", "Info", "Successfully All Subscriptions");
            for (var i in subscription) {
                data.push({ 
                'subscriptionId': subscription[i].subscription_id,
                'sub_name': subscription[i].sub_name,
                'withdraw_amount': subscription[i].withdraw_amount,
                'frequency': subscription[i].frequency,
                'image': subscription[i].image,
                'status': subscription[i].status,
                'total_subscriber': subscription[i].subscription_orders.length,
            });
            }
            res.status(200).json({
                message: "Successfully All Subscriptions",
                subscription: data == null ? {} : data
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error!",
                error: error.message
            });
        });
}

// exports.exportCustomers = (req, res) => {
//     let customers = {};
//     let subscriptionOrders = {};
  
//     try {
        
//         // Building export Customers object from upoading request's body
//         var userIds = req.body.users;
//         var subsId = req.body.subscriptionId;
//        if(subsId !=null){
//         for (var i in val) {
//             customers.push({ 'user_id': userIds[i].userId, 'subscription_id': subsId ,'status': 0});
//             subscriptionOrders.user_id = customers[i].user_id;
//             subscriptionOrders.subscription_id = customers[i].subscription_id;
//             await SubscriptionOrder.create(subscriptionOrders);
//         }
//        }
//         // Save to MySQL database
//         Subscription.create(customers).then(result => {
//           logger.info('Subscription Created', req.body.userId +' has been susbcribe successfully', ' at ', new Date().toJSON());
//             // send uploading message to client
//             res.status(200).json({
//                 message: "Subscription Create Successfully !",
//                 subscription: successResponse(result),
//             });
//         });
//     } catch (error) {
      
//         res.status(500).json({
//             message: "Fail!",
//             error: errorResponse(error.message)
//         });
//     }
//   }
  