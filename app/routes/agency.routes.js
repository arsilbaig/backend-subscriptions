const { authJwt } = require("../middleware");
const controller = require("../controllers/agency.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/Agency/create",
    [authJwt.verifyToken],
    controller.addAgency
  );
  
  app.get(
    "/api/Agency/getall",
    [authJwt.verifyToken],
    controller.getAllAgencies
  );
  app.get(
    "/api/Agency/admin/getall",
    [authJwt.verifyToken],
    controller.getAllAgenciesForAdmin
  );
  
// calling sored procedure
  app.get(
    "/api/Agency/getallPro",
    [authJwt.verifyToken],
    controller.getAllAgenciesPro
  );
  
  app.get(
    "/api/Agency/get/:id",
    [authJwt.verifyToken],
    controller.getAgencyById
  );

  app.put(
    "/api/Agency/remove",
    [authJwt.verifyToken],
    controller.removeAgency
  );

  app.put(
    "/api/Agency/update",
    [authJwt.verifyToken],
    controller.updateAgency
  );
  app.post(
    "/api/Agency/forgotpassword",
    [authJwt.verifyToken],
    controller.forgotpassword
  );
  
  app.post(
    "/api/auth/verifyOTP",
    [authJwt.verifyToken],
    controller.verifyOtp
  );

  app.put(
    "/api/Agency/resetpassword",
    [authJwt.verifyToken],
    controller.setForgotPassword
  );
  
};
