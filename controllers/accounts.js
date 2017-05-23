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
  //Postman: POST, x-www-form-encoded req.body.id
  //key: id, value: 5923dc317ed18c941dad6cb4
  //key: gym, value: 'jetts'

  var account = new Account();
  //routed from /profile/:id
  //Found the account
  Account.findById(req.user.id, function(err, account){
    if(err)
      res.send(err);

    //console.log(req.user.id); //coming up undefined

    //update
    account.gym = req.body.gym;

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
