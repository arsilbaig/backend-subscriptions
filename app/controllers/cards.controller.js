const db = require("../models");
const Cards = db.card_detail;
const Currency= db.currency;
const { successResponse, errorResponse } = require('../common/response');
const Op = db.Sequelize.Op;
const logger = require("../../logs/logger.js");
const { saveCardValidations } = require('../validations/validation');

exports.create = (req, res) => {
    let cards = {};
    try {
        // Validate
        const { error } = saveCardValidations(req.body);
        if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));

        Cards.findOne({
            where: {
                card_number: req.body.card_number
            }
        }).then(function(isCardExists){
            if(isCardExists == null){
                
                // Building Subscriptin object from upoading request's body
                    cards.user_id = req.userId,
                    cards.card_name = req.body.card_name,
                    cards.card_number = req.body.card_number,
                    cards.expiry_date = req.body.expiry_month + req.body.expiry_year,
                    cards.cvc = req.body.cvc,
                    cards.zip_code = req.body.zip_code,
                // Save to MySQL database
                Cards.create(cards).then(result => {
                    logger.info('Cards added with card_id', req.userId + ' has been successfully', ' at ', new Date().toJSON());
                    // send uploading message to client
                    res.status(200).json({
                        message: "Cards added Successfully !",
                        cards: successResponse(result),
                    });
                });
            }else{
                res.status(400).send({ message: "You are not allowed to add this card Number.", status: false})
            }
        })
    } catch (error) {

        res.status(500).json({
            message: "Fail!",
            error: errorResponse(error.message)
        });
    }
}

exports.getCardsByUserId = async (req, res) => {
   await Cards.findAll({
    where : {
        user_id: req.userId
    }
   }).then(function(userCardsInfo){
        if(userCardsInfo.length>0){
            res.status(200).send({ info: userCardsInfo});
        }else{
            res.status(400).send({error: "No Card available for payment processing"})
        }
        
   }).catch(error => {
            res.status(500).json({
                message: "Error!",
                error: error.message
            });
        });
}

exports.getCurrencies = async (req, res) => {
    await Currency.findAll().then(function(currencyInfo){
         if(currencyInfo.length>0){
             res.status(200).send({ info: currencyInfo});
         }else{
             res.status(400).send({error: "No Currency available for payment processing"})
         }
         
    }).catch(error => {
             res.status(500).json({
                 message: "Error!",
                 error: error.message
             });
         });
 }
 