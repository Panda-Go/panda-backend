var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb');
var config = require('./routes/config');
// var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var pandasRouter = require('./routes/panda');
var twilioRouter = require('./routes/twilio');

// Use Environment-defined port or 3000
var port = process.env.PORT || 3000;

// Connect to the PandaGO MongoDB
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("PandaGoDB");

    // Sample Test Query to DB
    dbo.collection("pandas").find({}).toArray( (err, result) => {
        if (err) throw err;
        console.log(result);
        db.close();
    });
    
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/panda', pandasRouter);
app.use('/twilio', twilioRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
app.listen(port);

module.exports = app;
