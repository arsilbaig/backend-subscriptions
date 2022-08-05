const { authJwt } = require("../middleware");
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
    [authJwt.verifyToken],
    controller.create
  );
  app.get(
    '/api/subscription/getSubscriptionById/:id',
    [authJwt.verifyToken],
    controller.getSubscriptionById
  );
  app.get(
    '/api/subscription/getSubscriptions',
    [authJwt.verifyToken],
    controller.getSubscriptions
  );
  app.get(
    '/api/subscription/mySubscription',
    [authJwt.verifyToken],
    controller.mySubscription
  );
  app.get(
    '/api/subscription/exportusers/:id',
    [authJwt.verifyToken],
    controller.getSubscriptionsOrderBySubscriptionId
  );
  
  app.get(
    '/api/subscription/getAllMarketPlace',
    controller.getAllMarketPlace
  );

  app.post(
    '/api/subscription/exportCustomers',
    [authJwt.verifyToken],
    controller.exportCustomers
  );

  app.post(
    '/api/subscription/buySubscription',
    [authJwt.verifyToken],
    controller.buySubscription
  );
  app.delete(
    '/api/subscription/cancelSubscription/:id',
    [authJwt.verifyToken],
    controller.cancelSubscription
);
  // app.post("/api/subscription/create", controller.create);
};