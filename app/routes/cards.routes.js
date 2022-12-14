const { authJwt } = require("../middleware");
const controller = require("../controllers/cards.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    '/api/card/add',
    [authJwt.verifyToken],
    controller.create
  );

  app.get(
    '/api/card/getcardbyuser',
    [authJwt.verifyToken],
    controller.getCardsByUserId
  );
  app.get(
    '/api/currency/getall',
    [authJwt.verifyToken],
    controller.getCurrencies
  );

};