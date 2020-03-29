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


/* To verify auth sms. */
router.get('/notify/warning', function(req, res, next) {
    // twilioClient.messages
    //     .create({
    //         body: '!!!!!!!!! DONT GO OUT !!!!!!!!!!!!',
    //         from: '+12563872716',
    //         to: '+12137099617'
    //     })
    //     .then((data) => {
    //     console.log("Hello")
    // });
    // res.status(200).send("ok")

    const notificationOpts = {
        toBinding: JSON.stringify({
            binding_type: 'sms',
            address: `+${req.query.phoneNumber}`,
        }),
        body: 'YOU ARE GOING OUT. \n' +
            'YOU ARE GOING TO LOSE PANDA POINTS !!!!! \n' +
            'FOLLOW THESE 5 THINGS STAY SAFE. \n' +
            '1. HANDS: Wash them often\n' +
            '2. ELBOW: Cough into it\n' +
            '3. FACE: Don\'t touch it\n' +
            '4. SPACE: Keep safe distance\n' +
            '5. HOME: Stay if you can',
    };

    twilioClient.notify
        .services(config.notificationID)
        .notifications.create(notificationOpts)
        .then(notification => console.log())
        .catch(error => console.log(error));

    res.status(200).send("ok")

});

/* To verify auth sms. */
router.get('/notify/wash', function(req, res, next) {

    const notificationOpts = {
        toBinding: JSON.stringify({
            binding_type: 'sms',
            address: `+${req.query.phoneNumber}`,
        }),
        body: 'YOU JUST CAME BACK FROM OUTSIDE \n' +
            '!!!!!! WASH YOUR HANDS !!!!!!',
    };

    twilioClient.notify
        .services(config.notificationID)
        .notifications.create(notificationOpts)
        .then(notification => console.log())
        .catch(error => console.log(error));

    res.status(200).send("ok")

});




module.exports = router;
