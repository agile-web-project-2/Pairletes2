var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../models/db');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

/* Register new user */
module.exports.registerNewUser = function(req, res) {
  var bday = req.body.year + '-' + req.body.mth + '-' + req.body.day;

  // register account through passport local
  Account.
    register(new Account({
      username : (req.body.username).toLowerCase(),
      name: req.body.name,
      email: (req.body.email).toLowerCase(),
      gender: req.body.gender,
      birthdate: bday
    }), req.body.password,
      function(err, account) {
        if (err) {
          console.log('There was an error while registering the username!', err);
          console.log('account: ' + account);
         //  sendJsonResponse(res, 400, err);
          return res.render('register', { account : account });
        } else {
          console.log('The username is registered!');
         //  sendJsonResponse(res, 201, account);
          // res.redirect('/login');

          // login and redirect the user to the profile page after registration.
          passport.authenticate('local')(req, res, function () {
            res.redirect('/profile/'+req.user.username);
          });
        };
      });
};

/*GET profile*/
module.exports.getProfile = function(req,res){
  //routed from /profile/:id
  //Found the account
  //Account.findById(req.params.id, function(err, account){
  console.log('req.params.username: %s,    req.params.id: %s', req.params.username, req.params.id);
  Account.findOne({username: req.params.username}, function(err, account){
    if(err){
      console.log(err);
      res.render('error.jade', {
          message: "Whooops, an error occured.\nThis user doesn't seem to be on Pairletes"
      });
    } else {
      console.log(account);
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
        res.redirect('/profile/'+req.user.username);
      //res.json(account);
    })

  });

};

/*
*GET UPDATE PROFILE
*URL: /editprofile
*/
module.exports.prefillUpdateProfile = function(req, res) {
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
    
    function getActivityMatch(me, other) {
      /* The input structure should follow the format = { interest1: '', interest2: '', interest3: '' } 
       * The output is the number of matching interests from 'me' to 'other'  */
      console.log('me: ', me);

      if (typeof(me.interest1 || me.interest2 || me.interest3) !== 'undefined') {
        console.log("passes through me");
        var myInterestStr = me.interest1+' '+me.interest2+' '+me.interest3;
      } else return 0;

      console.log('other: ', other); 
      if (other.interest1 && other.interest2 && other.interest3) {
        console.log("passes through other");
        var otherInterestStr = other.interest1+' '+other.interest2+' '+other.interest3;
      } else return 0;

      var searchStr = new RegExp(otherInterestStr.replace(/\s/g, '|'), 'g'); // create RegEx search string
      var res = myInterestStr.match(searchStr); // find matching strings
      return res.leng
    };
    
    function age(birthdate) {
      /* Input a date in Date() format; return years since date */ 
      return Math.floor((new Date() - birthdate)/31540000000);
    }

    /* Adjust the 'Any' gender input from the dropdown menu to
     * form a list 'Male' and 'Female', for passing to mongo query */
    var gender
    if (req.body.gender == 'Any') {
      gender = ['Male', 'Female'];
    } else {
     gender = req.body.gender;
    }

    /* Limit the potential match candidates to people of the same 
     * Gym type as the logged in user */
    var gym = req.user.gym;
    console.log(gym);
    
    
    /*** DO THE SEARCH QUERY ***/
    Account.
      find({
        gender: {$in: gender}/*,*/
        // gym: gym
      }).
      limit(9).
      exec(function (err, matchResults) {
      if (err) { 
        console.log(err);
        res.render('error.jade', { message: "There is a matching error" });
      } else {
        /*** 
         * RESULTS MATCHED FROM QUERY
         ***/
        console.log('0th me interest: ', req.user.interests);
        /* Add blank interest values if none exist */
        if (!req.user.interests[0]) {
          req.user.interests[0] = {interest1: '', interest2: '', interest3: ''};
        };
        var me = req.user.interests[0];
        console.log('1st me: ', req.user.interests);
        
        /* loop through all matched results from mongo query */
        var activityMatchStrength, other;
        for(var i=0; i<matchResults.length; i++) {
          /* determine age from birthdate */
          matchResults[i].age = age(matchResults[i].birthdate);
          console.log('match results: ', matchResults[i]);
          /* Strength of match by similar activities */    
          matchResults[i].activityMS = getActivityMatch(me, matchResults[i].interests);
          console.log('matchResults[i].activityMS: ',matchResults[i].activityMS)
        };
        res.render('findmatchResults.jade', {
          user: req.user,
          matchResults: matchResults
        });
      }
    });   
};

