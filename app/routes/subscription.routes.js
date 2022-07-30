const {authJwt} = require("../middleware");
const controller = require("../controllers/subscription.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    '/api/subscription/create',
    // [authJwt.verifyToken],
    controller.create
);
  // app.post("/api/subscription/create", controller.create);
};