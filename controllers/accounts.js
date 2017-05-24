var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../models/db');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

/*GET profile*/
module.exports.getProfile = function(req,res){
  var account = new Account();
  //routed from /profile/:id
  //Found the account
  Account.findById(req.params.id, function(err, account){
    if(err){
      res.send(err);
    }

    //res.json(account);
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
