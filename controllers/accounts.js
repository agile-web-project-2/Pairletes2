var express = require('express');
var router = express.Router();
var passport = require('passport');
var _ = require('underscore');

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

        var gymVar = account.gym;
        var intr = account.interests;
        var addr = account.address;
        var about = account.aboutMe;

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

  /*Find the account*/
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

  var gymVar = req.user.gym;
  var intr = req.user.interests;
  var addr = req.user.address;
  var about = req.user.aboutMe;

  res.render('editprofile', {
      user: req.user,
      title: 'Edit Profile',
      gym: gymVar,
      interest: intr,
      address: addr,
      aboutMe: about
  });
}


/*FIND MATCH*/
module.exports.findmatchResults = function(req,res){
  
    function getActivityMatch(a, b) {
      /* The input structure should follow the format = { interest1: '', interest2: '', interest3: '' } 
       * The output is the number of matching interests from 'me' to 'other'  */
      console.log('me: ', a);
      if (a.interest1 && a.interest2 && a.interest3) {
        console.log("Construct my interest string");
        var myInterestStr = a.interest1+' '+a.interest2+' '+a.interest3;
      } else return 0;

      console.log('other: ', b); 
      if (b.interest1 && b.interest2 && b.interest3) {
        console.log("Construct others interest string");
        var otherInterestStr = b.interest1+' '+b.interest2+' '+b.interest3;
      } else return 0;

      // create RegEx search string
      var searchStr = new RegExp(otherInterestStr.replace(/\s/g, '|'), 'g'); 

      // find matching strings
      var res = myInterestStr.match(searchStr); 

      // return the activity match strength
      if (res) {
        console.log('Activity match strength: ', res.length);
        return res.length;
      } else {
        console.log('Activity match strength: Not determined');
        return 0;
      } 
    };
    
    function getAge(birthdate) {
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

    var activity = req.body.activity;
    console.log('activity: ', activity);
    
    
    /*** DO THE SEARCH QUERY ***/
    Account.
      find({
        gender: {$in: gender},
        $or: [{"interests.interest1": activity},
              {"interests.interest2": activity},
              {"interests.interest3": activity}] 
      }).
      //limit(9).
      exec(function (err, matchResults) {
      if (err) { 
        console.log(err);
        res.render('error.jade', { message: "There is a matching error" });
      } else {
        /*** 
         * RESULTS MATCHED FROM QUERY
         ***/
        console.log('getInterestsFrom(req.user): ', req.user.interests);
        
        /* loop through all matched results from mongo query */
        var newList = [];
        for(var i=0; i<matchResults.length; i++) {
          // formulate new list from query results
          newList[i] = {
            username: matchResults[i].username,
            name: matchResults[i].name,
            gender: matchResults[i].gender,
            age: getAge(matchResults[i].birthdate),
            activityMatchStrength: getActivityMatch(req.user.interests, matchResults[i].interests),
            interests: matchResults[i].interests,
            gym: matchResults[i].gym
          };

        };

        /** UNDERSCORE TO QUERY ON THE FRONT END **/
        newList = _.sortBy(newList, 'activityMatchStrength');
        numSameGym = _.indexBy(newList, 'gym');
        numSameState = _.indexBy(newList, 'state');

        var myGym = req.user.gym

        console.log('numSameGym:', _.size({numSameGym})), 
        console.log('numSameGym: ', numSameGym );
        console.log('numSameGym: ', newList );

        /* Render the Match Results Page */
        res.render('findmatchResults.jade', {
          user: req.user,
          matchResults: matchResults,
          newList: newList.reverse(),
          selectedActivity: activity.toUpperCase()
        });
      }
    });   
};

