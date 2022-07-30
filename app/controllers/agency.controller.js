const db = require("../models");
const {
  Op
} = require("sequelize");
const config = require("../config/auth.config");
const crypto = require("../config/crypto_hash");
const {
  messages
} = require('../common/messages');
const {
  successResponse,
  errorResponse
} = require('../common/response');
const logger = require("../../logs/logger.js");
var bcrypt = require("bcryptjs");
const Agency = db.agency;
const Contact = db.contacts;
const Authuser = db.authuser;
const TempApi = db.temp_api;
const User = db.user;
const UserRoles = db.user_roles;
const ProviderDetail = db.provider_detail;
const {
  encrypt,
  decrypt
} = require('../config/crypto_hash.js');
const nodemailer = require("nodemailer");

const {
  saveAgencyValidations,
  updateAgencyValidations,
  saveAuthUserValidation,
  updateForgotPasswordValidation,
} = require('../validations/validation');

exports.addAgency = (req, res) => {
  let staff = {};
  try {
    // Validate
    const {
      error
    } = saveAgencyValidations(req.body);
    if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));

    let orgInstance = User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (orgrow) {

      if (orgInstance) {
        if (orgrow == null) {
          User.create({
            username: req.body.username,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: bcrypt.hashSync(req.body.password, 8),
            role: req.body.role,
            isActive: 1,
            isDeleted: req.body.isDeleted
          }).then(user_result => {
            // Building model object from upoading request's body
            staff.firstname = req.body.firstname;
            staff.lastname = req.body.lastname;
            staff.provider_id = req.body.provider_id;
            staff.user_id = user_result.dataValues.id;
            staff.agency_compaign_id = req.body.agency_compaign_id;
            staff.language = req.body.language;
            staff.api_key = req.body.api_key;
            Agency.create(staff).then(result => {
              let contact_save = {}
              let contacts = req.body.contacts;
              if (contacts.length > 0) {
                for (let i = 0; i < contacts.length; i++) {
                  contact_save.name = contacts[i].name;
                  contact_save.phone = contacts[i].phone;
                  contact_save.designation = contacts[i].designation;
                  contact_save.agency_id = result.dataValues.agency_id;
                  Contact.create(contact_save).then(result_contact => {});
                }
              }
              //sending email
             // logger.info('Email sent to Agency User', req.body.username+' Email sent successfully', ' at ', new Date().toJSON());
            //  sendEmail(req.body.email, "Agency: " + req.body.firstname + " " + req.body.lastname + " Created Successfully", "Your Agency has been created successfully. Your temporary password is '123456789', you can reste your password through given below link. ")
              // send uploading message to client
              let tempapi = {}
              tempapi.agency_id = result.dataValues.agency_id;
              tempapi.api_key = req.body.api_key;
              TempApi.create(tempapi).then(result_tempapi => {});

              UserRoles.create({
                roleId: req.body.role,
                userId: user_result.dataValues.id
            });

            ProviderDetail.create({
              provider_id: req.body.provider_id,
              agency_id: result.dataValues.agency_id,
              stop_api: req.body.stop_api,
              route_api: req.body.route_api,
              vehicle_api: req.body.vehicle_api,
              public_api: req.body.public_api
            })
            logger.info('Add Agency API called! ', req.body.username+' Agency has been created successfully', ' at ', new Date().toJSON());
              res.status(200).json({
                message: "Agency has been created successfully!",
                staff: successResponse(result),
              });
            });
            })
        } else {
          logger.error('Agency Email already exists! ', req.body.username+' Agency email is already existing!', ' at ', new Date().toJSON());
          res.status(400).json({
            message: errorResponse("Agency's email is already existing!"),
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      message: errorResponse(error.message)
    });
  }
}

const sendEmail = (to, subject, message) => {
  var smtpTr = nodemailer.createTransport({
    host: config.SMTP_HOSTNAME_TEST,
    port: config.SMTP_PORT_TEST,
    auth: {
      user: config.SMTP_USERNAME_TEST,
      pass: config.SMTP_PASSWORD_TEST
    }
  });
  var mailOptions = {
    from: config.WEBTITLE + "<" + config.SMTP_USERNAME_TEST + ">",
    to: to, // list of receivers
    subject: subject, // Subject line
    text: message // plain text body
  }
  smtpTr.sendMail(mailOptions, function (err, data) {
    if (err) {
      logger.error('Email failed! ', to +' Email not sent', ' at ', new Date().toJSON());
      console.log('Email not sent!');
    } else {
      logger.error('Email sent! ', to +' Email sent successfully', ' at ', new Date().toJSON());
      console.log('Email sent successfully');
    }
  });
}

exports.updateAgency = async (req, res) => {
  try {
    // Validate
     const { error } = updateAgencyValidations(req.body);
     if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));
    let agency_id = req.body.agency_id;
    let user = await Agency.findByPk(agency_id);

    if (!user) {
      // return a response to client
      logger.error('Update Agency ', agency_id +' Not Found for updating a Agency with id = ', ' at ', new Date().toJSON());
      res.status(400).json({
        message: errorResponse("Not Found for updating a Agency with id = " + agency_id),
      });
    } else {
      // update new change to database
      let updatedObject = {
        agency_id: req.body.agency_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        updatedAt: new Date(),
      }
      let result = await Agency.update(updatedObject, {
        returning: true,
        where: {
          agency_id: agency_id
        }
      });
      let user_id = req.body.user_id;
      let userinfoupdate = {}
      userinfoupdate.username= req.body.username;
      userinfoupdate.firstname= req.body.firstname;
      userinfoupdate.lastname= req.body.lastname;
      userinfoupdate.role= req.body.role;
      userinfoupdate.isActive= 1;
      userinfoupdate.isDeleted= req.body.isDeleted;

      if(req.body.password!="1"){
        userinfoupdate.password = bcrypt.hashSync(req.body.password, 8);
    }
      User.update(userinfoupdate, {
        returning: true,
        where: {
          id: user_id
        }
      });
      let contact_save = {}
      let contacts = req.body.contacts;
      if (contacts.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
          let contact_id= contacts[i].contact_id;
          contact_save.contact_id = contacts[i].contact_id;
          contact_save.name = contacts[i].name;
          contact_save.phone = contacts[i].phone;
          contact_save.designation = contacts[i].designation;
          contact_save.agency_id = req.body.agency_id;
          Contact.update(contact_save, {
            returning: true,
            where: {
              contact_id: contact_id,
              agency_id: req.body.agency_id
            }
          });
        }
      }
      let provider_detail_id = req.body.provider_detail_id;
      let provider_update={
        provider_id: req.body.provider_id,
        agency_id: req.body.agency_id,
        stop_api: req.body.stop_api,
        route_api: req.body.route_api,
        vehicle_api: req.body.vehicle_api,
        public_api: req.body.public_api
      };
      ProviderDetail.update(provider_update, {
        returning: true,
        where: {
          provider_detail_id: provider_detail_id,
          agency_id:req.body.agency_id
        }
      })

      // return the response to client
      if (!result) {
        logger.fatal('Can not Update Agency ', req.params.id +' Error -> Can not update a Agency with id = ', ' at ', new Date().toJSON());
        res.status(400).json({
          message: errorResponse("Error -> Can not update a Agency with id = " + req.params.id),
        });
      }
      logger.info('Update Agency =  ', agency_id +' Update successfully a Agency with id = '+agency_id, ' at ', new Date().toJSON());
      res.status(200).json({
        Agency: successResponse(updatedObject),
      });
    }
  } catch (error) {
    logger.fatal('Update Agency Error=  ', req.params.id +' Error -> Can not update a Agency with id = '+req.params.id, ' at ', new Date().toJSON());
    res.status(400).json({
      error: errorResponse(error.message)
    });
  }
}
//calling stored procedure
exports.getAllAgenciesPro = (req, res, next) => {
  let provider_id = req.body.provider_id;
  db.sequelize.query('CALL get_agencies(' + provider_id + ');', res, next)
    .then(result => {
      if (result.length > 0) {
        res.status(200).json({
          result: successResponse(result),
        });
      } else {
        res.status(400).json({
          message: errorResponse("No agency found against this provider"),
        });
      }

    })
    .catch(error => {
      // log on console
      res.status(400).json({
        error: errorResponse(error)
      });
    });
}

exports.getAllAgencies = (req, res) => {
  Agency.findAll({
    where: {
      isDeleted: 0,
      provider_id: req.body.provider_id,
    },
    include: [{
      model: Contact,
      as: "contacts"
    }]
  }).then(function (Agency) {
    logger.info('Get All Agency ', ' Get all Agencys successfully! ', ' at ', new Date().toJSON());
    res.status(200).json({
      staff: successResponse(Agency),
    });
  }).catch(err => {
    logger.fatal('Failed ', ' Failed to Get all Agencys! ', ' at ', new Date().toJSON());
    res.status(400).json({
      message: errorResponse(err.message)
    });
  });
}

exports.getAllAgenciesForAdmin = (req, res) => {
  Agency.findAll({
    where: {
      isDeleted: 0,
    },
    include: [
      {
      model: Contact,
      as: "contacts"
    },{
      model: User,
      as: "users",
      attributes:['username','email']
    },{
      model: ProviderDetail,
      as: "provider_details",
      attributes:['provider_detail_id','public_api','vehicle_api','stop_api','route_api']
    }
  ]
  }).then(function (Agency) {
    logger.info('Get All Agency ', ' Get all Agencies successfully! ', ' at ', new Date().toJSON());
    res.status(200).json({
      staff: successResponse(Agency),
    });
  }).catch(err => {
    res.status(400).json({
      message: errorResponse(err.message)
    });
  });
}


exports.removeAgency = (req, res) => {
  Agency.update({
    isDeleted: 1,
  }, {
    where: {
      agency_id: req.body.id
    }
  }).then(function (Agency) {
    logger.info('Soft Deleted Agency', ' Agency removed successfully! ', ' at ', new Date().toJSON());
    res.status(200).json({
      staff: successResponse(true),
    });
  }).catch(err => {
    logger.fatal('Failed to  Delete Agency', err.message , ' at ', new Date().toJSON());
    res.status(400).json({
      message: errorResponse(err.message)
    });
  });
  //res.status(200).send(true);
}

exports.getAgencyById = (req, res) => {
  Agency.findAll({
    where: {
      agency_id: req.params.id
    },
    include: [
      {
      model: Contact,
      as: "contacts"
    },{
      model: User,
      as: "users",
      attributes:['username','email']
    },{
      model: ProviderDetail,
      as: "provider_details",
      attributes:['provider_detail_id','public_api','vehicle_api','stop_api','route_api']
    }
  ]
  }).then(function (AgencyById) {
    logger.info('Get Single Agency', ' Get Agency by ID successfully! '+JSON.stringify(AgencyById), ' at ', new Date().toJSON());
    res.status(200).json({
      staff: successResponse(AgencyById),
    });
  }).catch(err => {
    logger.fatal('Failed to Get Single Agency', ' Get Agency by ID could not successfull! '+ err.message, ' at ', new Date().toJSON());
    res.status(400).json({
      message: errorResponse(err.message)
    });
  });
}

exports.forgotpassword = (req, res) => {
  let forgotpwd = {};
  try {
    let checkUserByEmail = Agency.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (user_row) {
      if (checkUserByEmail) {
        if (user_row == null) {
          logger.error('Forgot Password', ' Email does not exists with this No. = '+ req.body.email, ' at ', new Date().toJSON());
          return res.status(400).json({
            message: errorResponse("Email does not exists with this No. = " + req.body.email),
          });

        } else {
          let authUserEmail = Authuser.findOne({
            where: {
              email: req.body.email
            }
          }).then(function (userrow) {
            if (authUserEmail) {
              if (userrow != null) {
                Authuser.destroy({
                  where: {
                    authuser_id: userrow.authuser_id
                  }
                });
              }
            }
          })
          var expiryTime = 60;
          // Validate
          const {
            error
          } = saveAuthUserValidation(req.body);
          if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));
          var rand = Math.floor(Math.random() * 10000) + 1;
          //sending email
          sendEmail(
            req.body.email,
            "MPM Falcon - Forgot Password",
            "Your OTP code is " + rand + ". It will be expire in " + expiryTime
          )

          // two factor authentication
          var expiry_time;
          expiry_time = new Date();
          //expires in one minute.
          expiry_time.setSeconds(expiry_time.getSeconds() + expiryTime);

          forgotpwd.email = req.body.email;
          forgotpwd.otp = rand;
          forgotpwd.otp_expiry = expiry_time;
          Authuser.create(forgotpwd).then(result => {
            // send uploading message to client

          });
          logger.info('Forgot Password', ' Otp sent to email. Your OTP code is ' + rand + '. It will be expire in ' + expiryTime, ' at ', new Date().toJSON());
          res.status(200).json({
            data: successResponse("Otp sent to email. Your OTP code is " + rand + ". It will be expire in " + expiryTime)
          });
        }
      }
    })

  } catch (error) {
    res.status(400).json({
      error: errorResponse(error.message)
    });
  }
}


exports.setForgotPassword = (req, res) => {
  try {
    const {
      error
    } = updateForgotPasswordValidation(req.body);
    if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));
    // return the response to client
    let userInstance = Agency.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (userrow) {
      if (userInstance) {
        if (userrow != null) {
          let agency_id = userrow.agency_id;
          const hashpassword = encrypt(req.body.password);
          // update new change to database
          let updatedObject = {
            password: hashpassword,
            updatedAt: new Date()
          }
          let result = Agency.update(updatedObject, {
            returning: true,
            where: {
              agency_id: agency_id
            }
          });
          // return the response to client
          if (!result) {
            logger.error('setForgotPassword', ' Error -> Can not reset the password with phone no. = ' + req.body.email, ' at ', new Date().toJSON());
            res.status(400).json({
              message: errorResponse("Error -> Can not reset the password with phone no. = " + req.body.email),
            });
          }
          //sending email
          sendEmail(
            req.body.email,
            "MPM Falcon - Password Reset Successfully",
            "Your Password has been successfully updated."
          )
          logger.info('setForgotPassword', ' Password reset successfully.', ' at ', new Date().toJSON());
          res.status(200).json({
            data: successResponse(updatedObject)
          });
        } else {
          logger.info('setForgotPassword', ' Somethinng went wrong.', ' at ', new Date().toJSON());
          res.status(400).json({
            message: errorResponse("Somethinng went wrong."),
          });
        }
      }
    })
  } catch (error) {
    res.status(403).json({
      error: errorResponse(error.message)
    });
  }
}

exports.verifyOtp = (req, res) => {
  try {
    let authUserPhone = Authuser.findOne({
      where: {
        email: req.body.email,
        otp: req.body.otp_code
      }
    }).then(function (userrow) {
      if (authUserPhone) {
        if (userrow != null) {
          let dateNow = new Date();
          let expiryDate = userrow.otp_expiry;
          // User took too long to enter the code

          if (expiryDate <= dateNow.getTime()) {
            logger.info('OPT Verification', ' Your OTP code has been expired! Click below to resend.', ' at ', new Date().toJSON());
            res.status(200).json({
              status: false,
              message: "Your OTP code has been expired! Click below to resend.",
            });
          } else {
            logger.info('OTP Verification', ' OTP code verified.', ' at ', new Date().toJSON());
            res.status(200).json({
              message: successResponse("OTP code verified.")
            });
          }

        } else {
          logger.info('OTP Verification Failed', 'Somethinng went wrong.', ' at ', new Date().toJSON());
          res.status(400).json({
            message: errorResponse("Somethinng went wrong."),
          });
        }
      }
    })
  } catch (error) {
    res.status(400).json({
      error: errorResponse(error.message)
    });
  }
}