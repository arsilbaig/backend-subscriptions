const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const UserRole = db.user_roles;
const Authuser = db.authuser;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const logger = require("../../logs/logger.js");
const nodemailer = require("nodemailer");
require('dotenv').config();
const {
  saveUserValidations,
} = require('../validations/validation');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
//const loginfo = new logger();
// create a custom timestamp format for log statements

// exports.authenticate = (req, res) => {
//   let user = {};

//   try {

//     const users = { id: 3, user_token: 4 }

//     const token = jwt.sign({ users }, config.secret);
//     res.json({
//       token: token
//     })
//   }
//   catch (error) {
//     res.status(403).json({
//       message: "Forbidden!",
//       error: error.message
//     });
//   }
// }

exports.signup = async (req, res) => {
  const { error } = saveUserValidations(req.body);
  if (error) return res.status(400).send(errorResponse(error.details[0].message, {}));
await User.findOne({
  where: {
    account_id: req.body.walletName,
  }
}).then(async function(userrow){
  if(userrow==null){
    User.create({
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      account_id: req.body.walletName,
      country_code: req.body.countryCode,
      email: req.body.email,
      business_email: req.body.business_email,
      image_url: req.body.image_url,
      business_website_url: req.body.business_website_url,
      phone: req.body.phone,
      role: req.body.role,
      status: 0,
    })
      .then(user => {
        if (req.body.role) {
          Role.findAll({
            where: {
              id: req.body.role
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
            return  res.json({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              walletName: req.body.walletName,
              countryCode: req.body.countryCode,
                email: req.body.email,
                business_email: req.body.business_email,
                image_url: req.body.image_url,
                business_website_url: req.body.business_website_url,
                phone: req.body.phone,
                role: req.body.role,
                status: 0,
                message: "User registered successfully!"
              });
            });
          });
        } else {
          // user role = 1
          logger.info('User Registered! ', req.body.email+' registered successfully', ' at ', new Date().toJSON());
          user.setRoles([1]).then(() => {
          return  res.json({
              firstname: req.body.firstName,
              lastname: req.body.lastName,
              account_id: req.body.walletName,
              country_code: req.body.countryCode,
              email: req.body.email,
              business_email: req.body.business_email,
              image_url: req.body.image_url,
              business_website_url: req.body.business_website_url,
              phone: req.body.phone,
              role: req.body.role,
              status: 0,
              message: "User registered successfully!"
            });
          });
        }
    //return res.status(200).json({ message: "User registered successfully!" });
      })
      
  }else{
    return res.status(400).json({ message: "User is already exists" });
  }

}) .catch(err => {
  res.status(500).json({ message: err.message });
});
  // Save User to Database
  
};

exports.signin = (req, res) => {
  if(req.body.walletName!= null){

    let authUserPhone = Authuser.findOne({
      where: {
        email: req.body.email,
        otp: req.body.otp
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
                     
              User.findOne({
                where: {
                  account_id: req.body.walletName
                }
              })
                .then(user => {
                  const error = [];
                  if (!user) {
                    logger.error('Account error! ', 'check your wallet Name', ' at ', new Date().toJSON());
                    error.push({
                      type: 'walletName',
                      message: 'Check your walletName'
                    });
            
                    return res.status(200).send({ error });
                  }
            
                  var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 31536000 // 24 hours
                  });
            
                  var authorities = [];
                  user.getRoles().then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                      authorities.push(roles[i].name);
                    }
                    res.status(200).send({
                      user: {
                        id: user.id,
                        from: 'live-db',
                        role: authorities[0],
                        data: {
                          walletName: user.account_id,
                          displayName: user.firstname + ' ' + user.lastname,
                          photoURL: 'assets/images/avatars/profile.jpg',
                          email: user.email,
                        }
                      },
                      jwtAccessToken: token,
                    });
                  });
                })
                .catch(err => {
                  res.status(500).send({ message: err.message });
                });
            }
          }
      }
    })

  }else{
    return result.status(400).send({
      message: errorResponse("Account Id does not provided")
    })
  }
  
};


exports.authuser = (req, res) => {
  let authuser = {};
  try {
    var verifier = "";
    var emailsend = false;
    if(req.body.email){
      verifier = req.body.email;
      emailsend = true;
    }else{
      emailsend = false;
      verifier = req.body.phone;
    }
    let authUserrecord = Authuser.findOne({ where: { email: verifier } }).then(function (userrow) {
      if (authUserrecord) {
        if (userrow != null) {
          Authuser.destroy({
            where: {
              authuserId: userrow.authuserId
            }
          });
        }
      }
    })
    var expiryTime = 60;
    // Validate
    if(emailsend){
      sendEmail(req.body.email, " OTP Verification Code", "Your OTP code is : " + rand + " Do not share with anyone at any risk. This code will expires in "+ expiryTime+ " Seconds")
    }else{
      var rand = Math.floor(100000 + Math.random() * 900000);
      // two factor authentication
      client.messages.create({
        body: 'Your OTP code is : ' + rand + ' Do not share with anyone at any risk. This code will expires in ' + expiryTime + ' Seconds',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: req.body.phone_no
      })
        .then(message => console.log(message.sid));
   
    }
       var expiry_time;
    expiry_time = new Date();
    //expires in one minute.
    expiry_time.setSeconds(expiry_time.getSeconds() + expiryTime);

    authuser.email = verifier;
    authuser.otp = rand;
    authuser.otp_expiry = expiry_time;
    // Save to MySQL database
    Authuser.create(authuser).then(result => {
      // send uploading message to client
      res.status(200).json({
        message: "saved and otp sent to = " + verifier,
        customer: successResponse(result),
      });
    });
  }
  catch (error) {
    res.status(403).json({
      message: "Forbidden!",
      error: errorResponse(error.message)
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

exports.signInWithToken = (req, res) => {
  User.findOne({
    where: { id: req.userId }
  }).then(function (user) {
    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push(roles[i].name);
      }
      Agency.findOne({
        attributes: ['agency_id'],
        where:  {
          user_id: user.id
        }
      }).then(function(agencyUser){
        if(agencyUser!= null){
          res.status(200).send({
            user: {
              id: user.id,
              from: 'live-db',
              agency_id: agencyUser.dataValues.agency_id,
              role: authorities[0],
              data: {
                username: user.username,
                displayName: user.firstname + ' ' + user.lastname,
                photoURL: 'assets/images/avatars/profile.jpg',
                email: user.email,
              }
            },
            access_token: req.headers['authorization'],
          });
        }else{
          res.status(200).send({
            user: {
              id: user.id,
              from: 'live-db',
              role: authorities[0],
              data: {
                username: user.username,
                displayName: user.firstname + ' ' + user.lastname,
                photoURL: 'assets/images/avatars/profile.jpg',
                email: user.email,
              }
            },
            access_token: req.headers['authorization'],
          });
        }
      });
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
}


exports.impersonate = (req, res) => {

  if(req.body.provider_id > 0 && req.body.provider_id!=undefined){
    Provider.findOne({
      attributes: ['user_id'],
      where: {
        provider_id : req.body.provider_id,
        isTokenfied : req.body.isTokenfied
      }
    }).then(function(specificUser){
      console.log(specificUser);
      if(specificUser != null){
        UserRole.findOne({
          include:[{
            model: User,
            as: "user",
            where: {
              id: specificUser.dataValues.user_id
            }
          }]
        }).then(function(userrolesdata){
          if(userrolesdata== null){
            logger.error('Roles error ', 'No roles associated with this user', ' at ', new Date().toJSON());
            return res.status(403).send({
              message: "No roles associated with this user."
            });
          }else{
            Role.findOne({
              where: {
                id: userrolesdata.dataValues.roleId
              },
            }).then(function(userrole){
              if(userrole!= null){
                if(userrole.dataValues.name=='admin' || userrole.dataValues.name=='provider-admin'){
                  User.findOne({
                    where: {
                      email: req.body.email
                    }
                  })
                    .then(user => {
                      const error = [];
                      
                
                      var token = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 31536000 // 24 hours
                      });
                
                      var authorities = [];
                      user.getRoles().then(roles => {
                        for (let i = 0; i < roles.length; i++) {
                          authorities.push(roles[i].name);
                        }
    
                        //getting agencyId if required
                        Agency.findOne({
                          attributes: ['agency_id'],
                          where:  {
                            user_id: user.id
                          }
                        }).then(function(agencyUser){
                          if(agencyUser!= null){
                            logger.info('Impersonate to ', user.username, ' at ', new Date().toJSON());
                            res.status(200).send({
                              user: {
                                id: user.id,
                                from: 'live-db',
                                agency_id: agencyUser.dataValues.agency_id,
                                role: authorities[0],
                                data: {
                                  username: user.username,
                                  displayName: user.firstname + ' ' + user.lastname,
                                  photoURL: 'assets/images/avatars/profile.jpg',
                                  email: user.email,
                                }
                              },
                              access_token: token,
                            });
                          }else{
                            logger.info('Impersonate to ', user.username, ' at ', new Date().toJSON());
                            res.status(200).send({
                              user: {
                                id: user.id,
                                from: 'live-db',
                                role: authorities[0],
                                data: {
                                  username: user.username,
                                  displayName: user.firstname + ' ' + user.lastname,
                                  photoURL: 'assets/images/avatars/profile.jpg',
                                  email: user.email,
                                }
                              },
                              access_token: token,
                            });
                          }
                        });
                      
                      });
                    }).catch(err => {
                      res.status(500).send({ message: err.message });
                    });
                }
              }
            })
          }
        })
      }else{
        makeAgencyLogin(req, res);
      }
    })
  }else{
    makeAgencyLogin(req, res);
  }
  
};

const makeAgencyLogin = (req, res) => {
  
  var agency_data_id=0;
  let token = "";
  if(typeof req.headers['authorization'] !== 'undefined'){
   token = req.headers['authorization'].split(' ')[1];
    req.headers['authorization'] = token;
  }else{
    token = false;
  }
 // let token = req.headers['authorization'].split(' ')[1];
 
  
  if (!token) {
    logger.error('token error ', 'No token provided', ' at ', new Date().toJSON());
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      logger.error('Unauthorized ', 'Unauthorized User', ' at ', new Date().toJSON());
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    let userId = decoded.id;
    UserRole.findOne({
      include:[{
        model: User,
        as: "user",
        where: {
          id: userId
        }
      }]
    }).then(function(userrolesdata){
      if(userrolesdata== null){
        logger.error('Roles error ', 'No roles associated with this user', ' at ', new Date().toJSON());
        return res.status(403).send({
          message: "No roles associated with this user."
        });
      }else{
        Role.findOne({
          where: {
            id: userrolesdata.dataValues.roleId
          },
        }).then(function(userrole){
          if(userrole!= null){
            if(userrole.dataValues.name=='admin' || userrole.dataValues.name=='provider-admin' || userrole.dataValues.name=='agency-admin'){
              User.findOne({
                where: {
                  email: req.body.email
                }
              })
                .then(user => {
                  const error = [];
                  if (!user) {
                    logger.error('email error ', 'Check your email address', ' at ', new Date().toJSON());
                    error.push({
                      type: 'email',
                      message: 'Check your email address'
                    });
            
                    return res.status(200).send({ error });
                  }
            
                  var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 31536000 // 24 hours
                  });
            
                  var authorities = [];
                  user.getRoles().then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                      authorities.push(roles[i].name);
                    }

                    //getting agencyId if required
                    Agency.findOne({
                      attributes: ['agency_id'],
                      where:  {
                        user_id: user.id
                      }
                    }).then(function(agencyUser){
                      if(agencyUser!= null){
                        logger.info('Impersonate to ', user.username, ' at ', new Date().toJSON());
                        res.status(200).send({
                          user: {
                            id: user.id,
                            from: 'live-db',
                            agency_id: agencyUser.dataValues.agency_id,
                            role: authorities[0],
                            data: {
                              username: user.username,
                              displayName: user.firstname + ' ' + user.lastname,
                              photoURL: 'assets/images/avatars/profile.jpg',
                              email: user.email,
                            }
                          },
                          access_token: token,
                        });
                      }else{
                        logger.info('Impersonate to ', user.username, ' at ', new Date().toJSON());
                        res.status(200).send({
                          user: {
                            id: user.id,
                            from: 'live-db',
                            role: authorities[0],
                            data: {
                              username: user.username,
                              displayName: user.firstname + ' ' + user.lastname,
                              photoURL: 'assets/images/avatars/profile.jpg',
                              email: user.email,
                            }
                          },
                          access_token: token,
                        });
                      }
                    });
                  
                  });
                }).catch(err => {
                  res.status(500).send({ message: err.message });
                });
            }
          }
        })
      }
    })
  })
}

exports.profileUpdate = (req, res) => {
  User.update({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
    isActive: req.body.isActive,
  },
    {
      where: { id: req.body.id }
    }).then(function () {
      res.status(200).send({
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        isActive: req.body.isActive,
      });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}