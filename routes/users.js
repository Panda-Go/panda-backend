var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    var userListing = {};

    dbo.collection("users").find({}).toArray( (err, result) => {
        if (err) throw err;

        userListing = result;
        console.log(result);
        
        db.close();

    });

    // res.send('respond with a resource');
    res.send(result);
});

router.get('/')

module.exports = router;
