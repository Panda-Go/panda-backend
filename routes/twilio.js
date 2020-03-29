var express = require('express');
var router = express.Router();

var config = require('./config')
var twilioClient  = require('twilio')(config.accountSID,config.authToken);



/* To get auth sms. */
router.get('/login', function(req, res, next) {
  twilioClient
      .verify
      .services(config.serviceID)
      .verifications
      .create({
        to: `+${req.query.phoneNumber}`,
        channel: 'sms'
      })
      .then((data) => {
        res.status(200).send(data)
      });
});

/* To verify auth sms. */
router.get('/verify', function(req, res, next) {
    twilioClient
        .verify
        .services(config.serviceID)
        .verificationChecks
        .create({
            to: `+${req.query.phoneNumber}`,
            code: req.query.code
        })
        .then((data) => {
            res.status(200).send(data)
        });
});

module.exports = router;
