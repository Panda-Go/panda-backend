var express = require('express');
var router = express.Router();
var config = require('./config');
var dbo;
var pandas;
var weapons;

const POINTS_LOST_LEAVE_SAFE_AREA = 20;

// Connect to the PandaGO MongoDB
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
  if (err) throw err;
  dbo = db.db("PandaGoDB");
  pandas = dbo.collection("pandas");
  weapons = dbo.collection("weapons");
});


/* Create new panda. */
router.post('/create', function(req, res, next) {
  const body = req.body;
  pandas.delete()
      .insertOne(
          {
            _id: body.pandaId, weapon: "N/A", points:1000, lat: body.lat , lng: body.lng, lastSeen: body.lastSeen, name: body.name
          });
  res.status(200).send()
});

/* WARNING DANGEROUS API */
router.delet('/remove', function(req, res, next) {
    const body = req.body;
    pandas.remove()
    res.status(200).send()
});

/* Get a  new panda. */
router.get('/info', function(req, res, next) {
  pandas.findOne({_id: req.query.pandaId}, (err, item) => {
    res.status(200).send(item)
  })
});

/* Delete a panda. */
router.put('/delete', function(req, res, next) {
  pandas.deleteOne({_id: req.query.pandaId},  (err, item) => {
    res.sendStatus(201)
  });
});

/* Update panda weapon. */
router.put('/update/weapon', function(req, res, next) {
  pandas.updateOne({_id: req.body.pandaId}, {'$set': {'weapon': req.body.weapon}}, (err, item) => {
    res.sendStatus(200)
  });
});

/* Update panda points. */
router.put('/update/points', function(req, res, next) {
  pandas.updateOne({_id: req.body.pandaId}, {'$set': {'points': req.body.points}}, (err, item) => {
    res.sendStatus(200)
  });
});

/* Update panda lastSeen. */
router.put('/update/lastSeen', function(req, res, next) {
  pandas.updateOne({_id: req.body.pandaId}, {'$set': {'lastSeen': req.body.lastSeen}}, (err, item) => {
    res.sendStatus(200)
  });
});

/* Get weapon cost*/
router.get('/getcost', (req, res, next) => {
    weapons.findOne({name: req.query.name}, (err, item) => {
        console.log(`Cost of weapon: ${item.cost}`);
        res.send(item)
    });
});

/* Get all weapon*/
router.get('/weapons', (req, res, next) => {
    weapons.find({}).toArray( (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});

/* Panda purchases weapon. */
router.put('/purchase', (req, res, next) => {
    weapons.findOne({name: req.body.name}, (err, item) => {
        let weaponPoints = item.cost
        pandas.findOne({_id: req.body.pandaId}, (err, data) => {
            pandas.updateOne({_id: req.body.pandaId}, {'$set': {'points': (data.points - weaponPoints), 'weapon':req.body.name}}, (err, item) => {
                res.sendStatus(200)
            });
        });
    });
});

/* Get list of all pandas. */
router.get('/get_all_pandas', (req, res, next) => {
    pandas.find({}).toArray( (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    });
});


/* Let the Pandas fight */
router.put('/fight', (req, res, next) => {
    let winnerPandaId = req.body.winner;
    let loserPandaId = req.body.loser;
    pandas.findOne({_id: winnerPandaId}, (err, data) => {
        pandas.updateOne({_id: winnerPandaId}, {'$set': {'points': 500 + parseInt(data.points)}}, (err, item) => {
        });
    });

    pandas.findOne({_id: loserPandaId}, (err, data) => {
        pandas.updateOne({_id: loserPandaId}, {'$set': {'points': (data.points - 250), 'weapon':'N/A'}}, (err, item) => {
            res.sendStatus(200)
        });
    });
});

module.exports = router;
