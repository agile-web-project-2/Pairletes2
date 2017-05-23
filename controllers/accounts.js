var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../models/db');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

/*get profile*/
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


    res.render('profile.jade', {
          user: req.user,
          title: 'Profile',
          account: account,
          birthdate: x
    });

  });
};

/*Update profile*/
module.exports.updateProfile = function(req,res){
  var account = new Account();
  //routed from /profile/:id
  //Found the account
  Account.findById(req.params.id, function(err, account){
    if(err)
      res.send(err);

    //update
    //account.gym = req.body.gym;
    account.gym = "snap";

    account.save(function(err){
      if(err){
        res.send(err);
        return;
      }

      res.json(account);
    })

  });
};
