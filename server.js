
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios');
var multer = require('multer');
var util = require('util');
const moment = require("moment");
var ApkReader = require('node-apk-parser');
require('dotenv').config();
var cron = require('node-cron');


const hostname = (process.env.NODE_ENV == 'development') ? process.env.DEVELOPMENT_HOST : process.env.CLIENT_HOST;
const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

// SSL Configration
const httpsOptions = {
  cert: fs.readFileSync('./ssl/falcon_messagepoint_tv.crt'),
  ca: fs.readFileSync('./ssl/falcon_messagepoint_tv.ca-bundle'),
  key: fs.readFileSync('./ssl/falcon_messagepoint_tv.key')
};

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
//app.use(expressValidator())
app.use(bodyParser.json());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// database
const db = require("./app/models");
const Role = db.role;


//db.sequelize.sync();

Role.findAll().then(function (res) {
  console.log('Role Exist')
}).catch(err => {
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log('Drop and Resync Database with { force: true }');
  // });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/subscription.routes')(app);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

const server1 = httpServer.listen(httpPort, hostname, function () {
  let host = server1.address().address
  let port = server1.address().port
  console.log("App listening at http://%s:%s", host, port);
});

const server = httpsServer.listen(httpsPort, hostname, function () {
   let host = server.address().address
   let port = server.address().port
   console.log("App listening at http://%s:%s", host, port);
 });
