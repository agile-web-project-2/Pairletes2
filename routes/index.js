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


/***** GET CHAT *****/
//gets all the chats into one page
router.get('/messages', ctrlChat.getChats);

//get a single chat
router.get('/messages/:recipId', ctrlChat.enterChat);

//send reply
router.post('/messages/:chatId', ctrlChat.sendReply);

//new conversation
router.post('messages/newMessage/:recipId', ctrlChat.newMessage);

router.get('/profile/:id', ctrlAccount.getProfile);
//router.get('/profile/:username', ctrlAccount.getProfile);


/***** GET EDIT PROFILE *****/
// router.get('/editprofile', ctrlAccount.getEditProfile);
router.get('/editprofile', function(req, res) {
  //var account = new Account();
  //TO DISPLAY IN INPUT TEXTBOXES ------unused at the moment
  //Check if gym returns a string or object
  // Account.findById(req.params.id, function(err, account){
  //
  // });
  if (typeof req.user.gym != 'string' || typeof req.user.gym == 'undefined' ){
    var gymVar = " ";
  } else {
    var gymVar = req.user.gym;
  }

  //Check if interests returns a string or object
  if (typeof req.user.interests[0] == 'undefined'){
    var intr = " ";
  } else {
    var intr = req.user.interests[0];
  }

  //Check if address returns a string or object
  if (typeof req.user.address[0] == 'undefined'){
    var addr = " ";
  } else {
    var addr = req.user.address[0];
  }

  //Check if aboutMe returns a string or object
  if (typeof req.user.aboutMe == 'undefined'){
    var about = " ";
  } else {
    var about = req.user.aboutMe;
  }

  res.render('editprofile', {
      user: req.user,
      title: 'Edit Profile',
      // account: account,
      gym: gymVar,
      interest: intr,
      address: addr,
      aboutMe: about
  });
});

/***** POST UPDATE PROFILE *****/
router.post('/editprofile', ctrlAccount.updateProfile);



/***** GET ABOUT *****/
router.get('/about', function(req, res) {
      res.render('about', { user : req.user });
});



/***** GET FINDMATCH *****/
router.get('/findmatch', function(req, res) {
      res.render('findmatch', { user : req.user });
});

/**** POST FINDMATCH *****/
router.post('/findmatch', ctrlAccount.findmatchResults);



// /***** PERSON LIST ---- Remove later ******/
// router.get('/person', ctrlPerson.personList);
// router.post('/person', ctrlPerson.newPerson);
// /* DELETE person */
// router.get('/delete/:id', ctrlPerson.deletePerson);


module.exports = router;
