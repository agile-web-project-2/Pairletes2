var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../models/db');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

/* Register new user */
module.exports.registerNewUser = function(req, res) {
  var bday = req.body.yr + '-' + req.body.mth + '-' + req.body.day;

  //CLean data ready for db store

  // register account through passport local
  Account.
    register(new Account({
      username : req.body.username,
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      birthdate: bday
    }), req.body.password,
      function(err, account) {
        if (err) {
          console.log('There was an error while registering the email!', err);
          console.log('account: ' + account);
         //  sendJsonResponse(res, 400, err);
          return res.render('register', { account : account });
        } else {
          console.log('The email is registered!');
         //  sendJsonResponse(res, 201, account);
          // res.redirect('/login');

          // loggin and redirect the user to the profile page after registration.
          passport.authenticate('local')(req, res, function () {
            res.redirect('/profile/'+req.user.id);
          });
        };



      });
};

/*GET profile*/
module.exports.getProfile = function(req,res){
  var account = new Account();
  //routed from /profile/:id
  //Found the account
  Account.findById(req.params.id, function(err, account){
  //Account.findOne({username: 'req.params.username'}, function(err, account){  
    if(err){
      console.log(err);
      res.render('error.jade', {
          message: "Whooops, this user doesn't seem to be on Pairletes"
      });
    } else {

      //res.json(account);
      if (account) {
        var x = account.birthdate;
        var year = x.getFullYear();
        var month = x.getMonth()+1;
        var dt = x.getDate();
      

        if (dt < 10) {
        dt = '0' + dt;
        }

        if (month < 10) {
        month = '0' + month;
        }
        x = year + '-' + month + '-' + dt;

        //Check if gym returns a string or object
        if (typeof account.gym != 'string'){
          var gymVar = " ";
        } else {
          var gymVar = account.gym;
        }

        //Check if interests returns a string or object
        if (typeof account.interests[0] == 'undefined' || typeof account.interests[0] == 'null'){
          var intr = " ";
        } else {
          var intr = account.interests[0];
        }

        //Check if address returns a string or object
        if (typeof account.address[0] == 'undefined'){
          var addr = " ";
        } else {
          var addr = account.address[0];
        }

        //Check if aboutMe returns a string or object
        if (typeof account.aboutMe == 'undefined'){
          var about = " ";
        } else {
          var about = account.aboutMe;
        }

        res.render('profile.jade', {
            user: req.user,
            title: 'Profile',
            account: account,
            birthdate: x,
            gym: gymVar,
            interest: intr,
            address: addr,
            aboutMe: about
        });
      } else {
        res.render('error.jade', {
          message: "Whooops, this user doesn't seem to be on Pairletes"
        });
      };
    };
  });
};


/*UPDATE profile*/
module.exports.updateProfile = function(req,res){
  //New instance of account object
  var account = new Account();
  //routed from /profile/:id

  //Find the account
  Account.findById(req.user.id, function(err, account){
    //Error handler
    if(err)
      res.send(err);

    //UPDATE
    account.address = {"street": req.body.street,
      "city": req.body.city,
      "state": req.body.state,
      "country": req.body.country};
    account.interests = {"interest1": req.body.interest1, "interest2": req.body.interest2, "interest3": req.body.interest3};
    account.gym = req.body.gym;
    account.aboutMe = req.body.about;

    account.save(function(err){
      if(err){
        res.send(err);
        return;
      }
        res.redirect('/profile/'+req.user.id);
      //res.json(account);
    })

  });

};

/*
*GET UPDATE PROFILE
*URL: /editprofile
*/
module.exports.prefillUpdateProfile = function(req, res) {
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
}


/*FIND MATCH*/
module.exports.findmatchResults = function(req,res){
    Account.findOne({ 
      username: 'p'
    }, 'username name gender birthdate gym address interests aboutMe', function (err, account) {
      if (err) { 
        console.log(err);
        res.render('error.jade', { message: "There is a matching error" });
      };
    });

    matchResults = [{
      username: "mattyrat"
    },{
      username: "Louigi"
    }];

    res.render('findmatchResults.jade', {
      matchResults: matchResults
    });

      

};