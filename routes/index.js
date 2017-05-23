var express = require('express');
var router = express.Router();
var passport = require('passport');

/* MODEL VARIABLES */
var Account = require('../models/account');
/* CONTROLLER VARIABLES*/
var ctrlPerson = require('../controllers/person');
var ctrlAccount = require('../controllers/accounts');


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

/***** HOMEPAGE ****/
router.get('/', function(req, res){
  res.render('index', { user : req.user });
});


/***** REGISTER ****/
router.get('/register', function(req, res) {
      res.render('register', { });
});

/*POST NEW REGISTER-USER*/
router.post('/register', function(req, res) {
  var bday = req.body.yr + '-' + req.body.mth + '-' + req.body.day;
  Account.
    register(new Account({
      username : req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      birthdate: bday,
      gym: {}}),
       req.body.password,
 function(err, account) {
   if (err) {
     console.log('There was an error while registering the email!', err);
     console.log('account: ' + account);
    //  sendJsonResponse(res, 400, err);
     return res.render('register', { account : account });
   } else {
     console.log('The email is registered!');
    //  sendJsonResponse(res, 201, account);
     res.redirect('/login');
   };

   passport.authenticate('local')(req, res, function () {
     res.redirect('/login');
     });
 });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/profile/'+req.user.id);
});


/***** LOGIN *****/
router.get('/login', function(req, res) {
      res.render('login', { user : req.user });
});


/***** LOGOUT *****/
router.get('/logout', function(req, res) {
      req.logout();
          res.redirect('/');
});


/***** MESSAGES *****/
router.get('/messages', function(req, res) {
      res.render('messages');
});

router.get('/profile/:id', ctrlAccount.getProfile);


/***** EDIT PROFILE *****/
router.get('/editprofile', function(req, res) {
  res.render('editprofile', {
      title: 'Edit Profile',
      user: req.user
  });
});

/***** POST UPDATE PROFILE *****/
router.post('/editprofile', ctrlAccount.updateProfile);




/***** PERSON LIST ******/
router.get('/person', ctrlPerson.personList);
router.post('/person', ctrlPerson.newPerson);
/* DELETE person */
router.get('/delete/:id', ctrlPerson.deletePerson);


module.exports = router;
