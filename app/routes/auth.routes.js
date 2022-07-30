const {
  verifySignUp,
  authJwt
} = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  
  app.get(
    "/users/customer",
    controller.signInWithToken
  );

  app.put(
    "/api/profile/update",
    [authJwt.verifyToken],
    controller.profileUpdate
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/authuser", controller.authuser);
  app.post("/api/auth/impersonate", controller.impersonate);

  
};