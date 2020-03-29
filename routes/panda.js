var express = require('express');
var router = express.Router();
var config = require('./config');
var dbo;
var pandas;


// Connect to the PandaGO MongoDB
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
  if (err) throw err;
  dbo = db.db("PandaGoDB");
  pandas = dbo.collection("pandas");
});




/* create new panda. */
router.post('/create', function(req, res, next) {
  // Sample Test Query to DB
  const body = req.body;
  pandas
      .insertOne(
          {
            _id: body.phoneNumber, weapon: "N/A", points:"1000", lat: body.lat , lng: body.lng
          });
  res.status(200).send()
});

module.exports = router;
