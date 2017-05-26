var express = require('express');
var router = express.Router();
var passport = require('passport');

/* MODEL VARIABLES */
var Account = require('../models/account');
/* CONTROLLER VARIABLES*/
var ctrlPerson = require('../controllers/person');
var ctrlAccount = require('../controllers/accounts');
var ctrlChat = require('../controllers/chat')


/* Request needed to GET data to the views --- CONFIGURE LATER*/
var request = require('request');
var apiOptions = {
  server : "http://localhost:5000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://pairletes.herokuapp.com";
}


var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/***** GET HOMEPAGE ****/
router.get('/', function(req, res){
  res.render('index', { user : req.user });
});


/***** GET REGISTER ****/
router.get('/register', function(req, res) {
      res.render('register', { });
});

/*POST NEW REGISTER-USER*/
router.post('/register', ctrlAccount.registerNewUser);

/***** POST LOGIN *****/
router.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/findmatch');
});


/***** GET LOGIN *****/
router.get('/login', function(req, res) {
      res.render('login', { user : req.user });
});


/***** GET LOGOUT *****/
router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
});

/*****GET CHATROOM****/
//render chat room page
router.get('/CHATROOM', function(req, res){
  res.render('chatRoom', {user : req.user});
});

/***** GET CHAT *****/
//gets all the chats into one page
router.get('/messages', function(req, res){
  var chats = ctrlChat.getChats;
  res.render('chat', {chats: chats, user: req.user});
});

//get a single chat
router.get('/messages/:recipId', ctrlChat.enterChat);

//send reply
router.post('/messages/:chatId', ctrlChat.sendReply);

//Page for creating new message
router.get('/messages/newMessage/:recipId', ctrlChat.createNewMessage);

//new conversation
router.post('/messages/newMessage/:recipId', ctrlChat.newMessage);

router.get('/profile/:username', ctrlAccount.getProfile);
//router.get('/profile/:username', ctrlAccount.getProfile);


/***** GET EDIT PROFILE *****/
// router.get('/editprofile', ctrlAccount.getEditProfile);
router.get('/editprofile', ctrlAccount.prefillUpdateProfile);

/***** POST UPDATE PROFILE *****/
router.post('/editprofile', ctrlAccount.updateProfile);



/***** GET FINDMATCH *****/
router.get('/findmatch', function(req, res) {
      res.render('findmatch', { user : req.user });
});

/**** POST FINDMATCH *****/
router.post('/findmatch', ctrlAccount.findmatchResults);



/***** GET ABOUT PAGES *****/
router.get('/about', function(req, res) {
      res.render('about', { user : req.user });
});

router.get('/about/matchalgo', function(req, res) {
      res.render('matchalgo', { user : req.user });
});

router.get('/about/designprocess', function(req, res) {
      res.render('designprocess', { user : req.user });
});

router.get('/about/testing', function(req, res) {
      res.render('testing', { user : req.user });
});

router.get('/about/references', function(req, res) {
      res.render('references', { user : req.user });
});

module.exports = router;
