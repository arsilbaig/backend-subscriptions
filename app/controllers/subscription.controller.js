const db = require("../models");
const Subscription = db.subscription;
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
      subscription.terms = req.body.terms

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

