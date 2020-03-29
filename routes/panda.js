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
  const body = req.body;
  pandas
      .insertOne(
          {
            _id: body.pandaId, weapon: "N/A", points:"1000", lat: body.lat , lng: body.lng, lastSeen: body.lastSeen
          });
  res.status(200).send()
});

/* get a  new panda. */
router.get('/info', function(req, res, next) {
  pandas.findOne({_id: req.query.pandaId}, (err, item) => {
    res.status(200).send(item)
  })
});

/* delete a panda. */
router.put('/delete', function(req, res, next) {
  pandas.deleteOne({_id: req.query.pandaId},  (err, item) => {
    res.sendStatus(201)
  });
});

/* update panda weapon. */
router.put('/update/weapon', function(req, res, next) {

  pandas.updateOne({_id: req.body.pandaId}, {'$set': {'weapon': req.body.weapon}}, (err, item) => {
    res.sendStatus(200)
  });
});


/* update panda points. */

router.put('/update/points', function(req, res, next) {

  pandas.updateOne({_id: req.body.pandaId}, {'$set': {'points': req.body.points}}, (err, item) => {
    res.sendStatus(200)
  });
});

/* update panda lastSeen. */


router.put('/update/lastSeen', function(req, res, next) {
  pandas.updateOne({_id: req.body.pandaId}, {'$set': {'lastSeen': req.body.lastSeen}}, (err, item) => {
    res.sendStatus(200)
  });
});

module.exports = router;
