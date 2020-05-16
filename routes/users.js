var express = require('express');
var router = express.Router();
var fs=require('fs');
var session=require('express-session');
var FileStore=require('session-file-store')(session);
const bodyParser=require('body-parser');
const User=require('../models/users');
const passport=require('passport');
var path = require('path');
var fs=require('fs');
router.use(bodyParser.json());
router.use(express.static("routes"));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+'/movie.html');
});
router.get('/signup', function(req, res, next) {
  res.sendFile(__dirname+'/signup.html');
});
router.get('/movie', function(req, res, next) {
  router.use(express.static("routes"));
  res.sendFile(__dirname+'/movie.html');
});
router.get('/login', function(req, res, next) {
  res.sendFile(__dirname+'/login.html');
});
router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null) {
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.redirect('/');
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if(!req.session.user) {
    User.findOne({username: req.body.username})
    .then((user,err) => {
        if (user.username === req.body.username && user.password === req.body.password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>LOGIN SUCCESSFULL!</h1><button><a href="logout">logout</a></button></body></html>');
      }
      else{
        var err = new Error('Incorrect password!');
      err.status = 404;
      next(err);
      }
    })
    .catch((err) =>{
      var err = new Error('Incorrect username!');
      err.status = 404;
      next(err);
    })
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('<html><body><h1>LOGIN SUCCESSFULL!</h1><button><a href="logout">logout</a></button></body></html>');
  }
});
router.get('/logout',(req,res)=>{
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session_id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
