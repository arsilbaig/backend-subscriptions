const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const UserRole = db.user_roles;
const Agency = db.agency;
const Provider = db.provider;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const logger = require("../../logs/logger.js");
const nodemailer = require("nodemailer");

const {
  saveUserValidations,
} = require('../validations/validation');
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
  if(req.body.email!= null){
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        const error = [];
        if (!user) {
          logger.error('email error! ', 'check your email address', ' at ', new Date().toJSON());
          error.push({
            type: 'email',
            message: 'Check your email address'
          });
  
          return res.status(200).send({ error });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          logger.error('password error! ', 'check your password', ' at ', new Date().toJSON());
  
          error.push({
            type: 'password',
            message: 'Check your password'
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
                username: user.username,
                displayName: user.firstname + ' ' + user.lastname,
                photoURL: 'assets/images/avatars/profile.jpg',
                email: user.email,
              }
            },
            access_token: token,
          });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }else{
    logger.error('data error! ', 'No data provided', ' at ', new Date().toJSON());
    res.status(400).send({ message: 'No data provided' });
    
  }
  
};

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