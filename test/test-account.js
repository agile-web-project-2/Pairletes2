var should = require('chai').should();

/************************************************************************************
 * For local Mongo Server start server e.g ( sudo mongod --dbpath /var/lib/mongodb/ ) 
 ************************************************************************************/

var mongoose = require('mongoose');
var mlab = require('../mlab-user-pass.js');

// require('../app_api/models/account.js');
// var Account = mongoose.model('Account');
var Account = require('../models/account');
var db;

// dummy user data
var dUser = {
    username: 'johnytest',
    name: 'John',
    email: 'john@tmail.com',
    //password: String,
    gender: 'Male',
    birthdate: '1992-05-19',
    gym: 'Fitness First',
    address: [{street: 'Coode st', city: 'Perth', state: 'WA', country: 'Australia'}],
    interests: [{interest1: 'running', interest2: 'swimming', interest3: 'cycling'}],
    aboutMe: 'Triathalon man'
}


describe('Account: Adds new account to the database; ', function() {
    
    before(function(done){
        db = mongoose.connect('mongodb://localhost:27017/test');
        done();
    });

    beforeEach(function(done) {
        // create account instance
        Account.register(new Account(dUser), 'p@s5w0Rd',
        function(err, account) {
            if (err) {
                console.log('There was an error while registering your username!', err);
                console.log('account: ' + account);
                // sendJsonResponse(res, 400, err);
            } else {
                console.log('Your username is registered!');
                // sendJsonResponse(res, 201, account);
            }
            done();
        });
    });

    it('should find an account by username', function(done) {
        Account.findOne({ username: 'johnytest' }, function(err, account) {
            account.username.should.eql('johnytest');
            console.log("   email: ", account.username);
            done(); //Call done to tell mocha that we are done with this test
        });
    });

    it('should store password as hash', function(done) {
        Account.findOne({ username: 'johnytest' }, { hash: 1 }, function(err, account) {
            account.hash.should.exist;
            console.log("   hash: ", account.hash);
            done(); //Call done to tell mocha that we are done with this test
        });
    });

    it('should find account by username and update it', function(done) {
        var query = {username: 'johnytest'};
        var update = { $set: {aboutMe: 'This is new about me.'}};
        var options = {new: true, upsert: true};
        var callback = function(err, account) {
            if(err) {
                console.log("something went wrong when updating the data");
            }
            console.log(" about:", account.aboutMe);
            account.aboutMe.should.eql('This is new about me.')
            done();
        };
        Account.findOneAndUpdate(query, update, options, callback);
    });

    it('should get the account object by email', function(done) {
        var query = Account.where({ username: 'johnytest'});
        query.findOne(function(err, account) {
            if (err) {
                console.log("something went wrong when updating the data");
            }
            if (account) {
                console.log(account)
            }
            done();
        });

    });


    afterEach(function(done) {
        Account.remove({}, function() {
            done();
        });
    });

    after(function(done){// after all the tests have finished
        mongoose.connection.close();
        done();
    });
});
